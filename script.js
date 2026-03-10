const scenes = {
  envelope: document.getElementById("scene-envelope"),
  riddle: document.getElementById("scene-riddle"),
  selected: document.getElementById("scene-selected"),
  narrative: document.getElementById("scene-narrative"),
  reveal: document.getElementById("scene-reveal"),
  key: document.getElementById("scene-key")
};

const envelopeButton = document.getElementById("envelope-button");
const riddleForm = document.getElementById("riddle-form");
const riddleInput = document.getElementById("riddle-answer");
const riddleFeedback = document.getElementById("riddle-feedback");
const revealButton = document.getElementById("reveal-button");
const welcomeText = document.getElementById("welcome-text");
const ambientAudio = document.getElementById("ambient-audio");

function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  const rawName = params.get("name");

  if (!rawName) {
    return "Guest";
  }

  return rawName
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 40);
}

function setWelcomeName() {
  const guestName = getGuestName();
  welcomeText.textContent = `Welcome, ${guestName}.`;
}

function showScene(key) {
  Object.values(scenes).forEach((scene) => {
    scene.classList.remove("scene-active");
  });

  scenes[key].classList.add("scene-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function tryStartAudio() {
  if (!ambientAudio) {
    return;
  }

  ambientAudio.volume = 0.35;
  ambientAudio.play().catch(() => {
    // Playback can fail silently if browser policy blocks audio.
  });
}

function bindEnvelopeScene() {
  envelopeButton.addEventListener("click", () => {
    envelopeButton.classList.add("envelope-opening");
    tryStartAudio();

    setTimeout(() => {
      showScene("riddle");
      riddleInput.focus();
    }, 700);
  });
}

function bindRiddleScene() {
  riddleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = riddleInput.value.trim().toLowerCase();

    if (!answer.includes("health")) {
      riddleFeedback.textContent = "Hint: The answer contains one core word in this invitation.";
      return;
    }

    riddleFeedback.textContent = "Access granted.";
    scenes.riddle.classList.add("fade-to-black");

    setTimeout(() => {
      scenes.riddle.classList.remove("fade-to-black");
      showScene("selected");
    }, 900);

    setTimeout(() => {
      showScene("narrative");
      setupNarrativeObserver();
    }, 2500);

    setTimeout(() => {
      showScene("reveal");
    }, 11000);
  });
}

function setupNarrativeObserver() {
  const blocks = document.querySelectorAll(".narrative-block");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.4
    }
  );

  blocks.forEach((block) => observer.observe(block));

  // Trigger a smooth auto-scroll journey on first run.
  let current = 0;
  const timer = setInterval(() => {
    current += 1;

    if (current >= blocks.length) {
      clearInterval(timer);
      return;
    }

    blocks[current].scrollIntoView({ behavior: "smooth", block: "center" });
  }, 2000);
}

function bindRevealScene() {
  revealButton.addEventListener("click", () => {
    showScene("key");
  });
}

function init() {
  setWelcomeName();
  bindEnvelopeScene();
  bindRiddleScene();
  bindRevealScene();
}

init();
