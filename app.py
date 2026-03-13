import os
from datetime import datetime

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from twilio.rest import Client

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

load_dotenv(os.path.join(BASE_DIR, ".env"))

app = Flask(__name__, static_folder=None)

DATABASE_URL = os.getenv(
    "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'rsvps.db')}"
)

app.config.update(
    SQLALCHEMY_DATABASE_URI=DATABASE_URL,
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
)

db = SQLAlchemy(app)


class RSVP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(200), nullable=False)
    phone_number = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    guests = db.Column(db.Integer, default=0)
    attendance = db.Column(db.String(20), nullable=False)
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


def _twilio_client():
    sid = os.getenv("TWILIO_ACCOUNT_SID")
    token = os.getenv("TWILIO_AUTH_TOKEN")
    if not sid or not token:
        return None
    return Client(sid, token)


def _format_whatsapp_message(rsvp: RSVP) -> str:
    guest_message = rsvp.message.strip() if rsvp.message else "-"
    return (
        "New RSVP Received 🎉\n"
        f"Name: {rsvp.full_name}\n"
        f"Phone: {rsvp.phone_number}\n"
        f"Email: {rsvp.email}\n"
        f"Guests: {rsvp.guests}\n"
        f"Attendance: {rsvp.attendance}\n"
        f"Message: {guest_message}"
    )


def _send_whatsapp(rsvp: RSVP) -> bool:
    from_number = os.getenv("TWILIO_WHATSAPP_FROM")
    to_number = os.getenv("WHATSAPP_HOST_TO")
    client = _twilio_client()
    if not from_number or not to_number or client is None:
        print("WhatsApp send skipped: missing Twilio credentials or numbers.")
        return False

    try:
        client.messages.create(
            body=_format_whatsapp_message(rsvp),
            from_=from_number,
            to=to_number,
        )
    except Exception as exc:
        print(f"WhatsApp send failed: {exc}")
        return False

    return True


@app.route("/api/rsvp", methods=["POST"])
def create_rsvp():
    data = request.get_json(silent=True) or request.form or {}

    full_name = (data.get("full_name") or data.get("fullName") or "").strip()
    phone_number = (data.get("phone_number") or data.get("phoneNumber") or "").strip()
    email = (data.get("email") or "").strip()
    attendance = (data.get("attendance") or data.get("attend") or "").strip()
    message = (data.get("message") or "").strip()

    guests_raw = data.get("guests") or data.get("number_of_guests") or "0"
    try:
        guests = max(0, int(guests_raw))
    except (TypeError, ValueError):
        guests = 0

    if not full_name or not phone_number or not email or not attendance:
        return (
            jsonify({"error": "Full name, phone, email, and attendance are required."}),
            400,
        )

    rsvp = RSVP(
        full_name=full_name,
        phone_number=phone_number,
        email=email,
        guests=guests,
        attendance=attendance,
        message=message,
    )

    db.session.add(rsvp)
    db.session.commit()

    whatsapp_sent = _send_whatsapp(rsvp)

    return jsonify({"ok": True, "rsvp_id": rsvp.id, "whatsapp_sent": whatsapp_sent})


@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.route("/<path:filename>")
def static_files(filename):
    if filename.startswith("api/"):
        return ("Not Found", 404)

    safe_path = os.path.abspath(os.path.join(BASE_DIR, filename))
    if not safe_path.startswith(BASE_DIR):
        return ("Not Found", 404)

    if not os.path.isfile(safe_path):
        return ("Not Found", 404)

    return send_from_directory(BASE_DIR, filename)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port, debug=True)
