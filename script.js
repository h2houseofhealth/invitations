window.addEventListener("load", () => {
  const body = document.body;
  const bgMusic = document.querySelector("#bg-music");
  const scene = document.querySelector(".scene");
  const light = document.querySelector(".light");
  const wrapper = document.querySelector(".wrapper");
  const letter = document.querySelector(".letter");
  const tapOpen = document.querySelector("#tap-open");
  const form = document.querySelector("#answer-form");
  const answerInput = document.querySelector("#riddle-answer");
  const submitButton = form.querySelector('button[type="submit"]');
  const result = document.querySelector("#result");
  const hintWords = document.querySelector("#hint-words");
  const hintBottle = document.querySelector("#hint-bottle");
  const hintPills = document.querySelectorAll(".hint-pill");
  const endScreen = document.querySelector("#end-screen");
  const quoteEl = document.querySelector("#cinematic-quote");
  const quoteLayer = document.querySelector("#quote-layer");
  const quoteParticleField = document.querySelector("#quote-particle-field");
  const identityPanel = document.querySelector("#identity-panel");
  const lockButton = document.querySelector("#lock-button");
  const keyPanel = document.querySelector("#key-panel");
  const keyStatus = document.querySelector("#key-status");
  const enterButton = document.querySelector("#enter-button");
  const eventStage = document.querySelector("#event-stage");
  const eventParticleField = document.querySelector("#event-particle-field");
  const rsvpButton = document.querySelector("#rsvp-button");
  const rsvpPanel = document.querySelector("#rsvp-panel");
  const rsvpForm = document.querySelector("#rsvp-form");
  const rsvpName = document.querySelector("#rsvp-name");
  const rsvpEmail = document.querySelector("#rsvp-email");
  const rsvpPhone = document.querySelector("#rsvp-phone");
  const rsvpAttend = document.querySelector("#rsvp-attend");
  const rsvpGuests = document.querySelector("#rsvp-guests");
  const rsvpMessage = document.querySelector("#rsvp-message");
  const rsvpSuccess = document.querySelector("#rsvp-success");
  const rsvpError = document.querySelector("#rsvp-error");

  const quotes = [
    { text: "You have been selected", className: "from-center", duration: 4800 },
    {
      text: "In a world obsessed with disease, a few choose prevention",
      className: "from-top-left",
      duration: 5000
    },
    {
      text: "In a system built for speed, a few demand precision.",
      className: "from-bottom-right",
      duration: 5000
    },
    { text: "In an era of reactive medicine...", className: "from-bottom", duration: 4700 },
    { text: "A new circle is forming", className: "from-top", duration: 4700 },
    {
      text: "WELCOME TO THE FUTURE OF HEALTH",
      className: "from-center glow",
      duration: 5200
    }
  ];

  let narrativeStarted = false;
  let gateUnlocked = false;
  let quoteParticlesSeeded = false;
  let finalParticlesSeeded = false;
  let lightDotsSeeded = false;
  let hasActivatedMusic = false;

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const tryStartMusic = () => {
    if (!bgMusic) {
      return;
    }

    bgMusic.volume = 0.55;
    bgMusic.loop = true;

    const playPromise = bgMusic.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const activateMusic = () => {
    if (hasActivatedMusic) {
      return;
    }

    hasActivatedMusic = true;
    tryStartMusic();
  };

  ["click", "touchstart", "keydown"].forEach((eventName) => {
    window.addEventListener(eventName, activateMusic, { once: true, passive: true });
  });

  const seedLightDots = (count = 420) => {
    if (lightDotsSeeded || !light) {
      return;
    }

    for (let index = 0; index < count; index += 1) {
      const dot = document.createElement("span");
      dot.className = "light-dot";
      dot.style.setProperty("--left", `${randomBetween(0, 100)}%`);
      dot.style.setProperty("--top", `${randomBetween(0, 100)}%`);
      dot.style.setProperty("--size", `${randomBetween(1.4, 4.4)}px`);
      dot.style.setProperty("--duration", `${randomBetween(7, 18)}s`);
      dot.style.setProperty("--delay", `${randomBetween(-18, 0)}s`);
      dot.style.setProperty("--x-mid", `${randomBetween(-120, 120)}px`);
      dot.style.setProperty("--y-mid", `${randomBetween(-120, 120)}px`);
      dot.style.setProperty("--x-end", `${randomBetween(-180, 180)}px`);
      dot.style.setProperty("--y-end", `${randomBetween(-180, 180)}px`);
      dot.style.setProperty("--start-scale", randomBetween(0.45, 0.95).toFixed(2));
      dot.style.setProperty("--mid-scale", randomBetween(0.8, 1.3).toFixed(2));
      dot.style.setProperty("--end-scale", randomBetween(0.5, 1.05).toFixed(2));
      dot.style.setProperty("--peak-opacity", randomBetween(0.22, 0.58).toFixed(2));
      light.appendChild(dot);
    }

    lightDotsSeeded = true;
  };

  seedLightDots();

  const seedQuoteParticles = (count = 220) => {
    if (quoteParticlesSeeded || !quoteParticleField) {
      return;
    }

    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement("span");
      particle.className = "quote-particle";
      particle.style.setProperty("--left", `${randomBetween(0, 100)}%`);
      particle.style.setProperty("--top", `${randomBetween(0, 100)}%`);
      particle.style.setProperty("--size", `${randomBetween(2, 7)}px`);
      particle.style.setProperty("--duration", `${randomBetween(8, 20)}s`);
      particle.style.setProperty("--delay", `${randomBetween(-20, 0)}s`);
      particle.style.setProperty("--x-mid", `${randomBetween(-130, 130)}px`);
      particle.style.setProperty("--y-mid", `${randomBetween(-100, -20)}px`);
      particle.style.setProperty("--x-end", `${randomBetween(-170, 170)}px`);
      particle.style.setProperty("--y-end", `${randomBetween(-260, 140)}px`);
      particle.style.setProperty("--start-scale", randomBetween(0.45, 0.95).toFixed(2));
      particle.style.setProperty("--mid-scale", randomBetween(0.85, 1.35).toFixed(2));
      particle.style.setProperty("--end-scale", randomBetween(0.45, 1.1).toFixed(2));
      particle.style.setProperty("--peak-opacity", randomBetween(0.22, 0.7).toFixed(2));
      quoteParticleField.appendChild(particle);
    }

    quoteParticlesSeeded = true;
  };

  const seedFinalStageParticles = (count = 220) => {
    if (finalParticlesSeeded || !eventParticleField) {
      return;
    }

    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement("span");
      particle.className = "quote-particle final-particle";
      particle.style.setProperty("--left", `${randomBetween(0, 100)}%`);
      particle.style.setProperty("--top", `${randomBetween(0, 100)}%`);
      particle.style.setProperty("--size", `${randomBetween(2, 7)}px`);
      particle.style.setProperty("--duration", `${randomBetween(8, 20)}s`);
      particle.style.setProperty("--delay", `${randomBetween(-20, 0)}s`);
      particle.style.setProperty("--x-mid", `${randomBetween(-130, 130)}px`);
      particle.style.setProperty("--y-mid", `${randomBetween(-100, -20)}px`);
      particle.style.setProperty("--x-end", `${randomBetween(-170, 170)}px`);
      particle.style.setProperty("--y-end", `${randomBetween(-260, 140)}px`);
      particle.style.setProperty("--start-scale", randomBetween(0.45, 0.95).toFixed(2));
      particle.style.setProperty("--mid-scale", randomBetween(0.85, 1.35).toFixed(2));
      particle.style.setProperty("--end-scale", randomBetween(0.45, 1.1).toFixed(2));
      particle.style.setProperty("--peak-opacity", randomBetween(0.22, 0.7).toFixed(2));
      eventParticleField.appendChild(particle);
    }

    finalParticlesSeeded = true;
  };

  setTimeout(() => {
    body.classList.add("revealed");
  }, 250);

  setTimeout(() => {
    wrapper.classList.add("floating");
    body.classList.add("ready");
  }, 4700);

  const openEnvelope = () => {
    if (wrapper.classList.contains("open") || wrapper.classList.contains("cracked")) {
      return;
    }

    wrapper.classList.remove("floating");
    wrapper.classList.add("cracked");
    body.classList.add("opened");

    window.setTimeout(() => {
      wrapper.classList.add("open");

      window.setTimeout(() => {
        wrapper.classList.add("drop");
      }, 1500);

      window.setTimeout(() => {
        wrapper.classList.add("envelope-gone");
      }, 2400);
    }, 850);
  };

  tapOpen.addEventListener("click", () => {
    tryStartMusic();
    openEnvelope();
  });

  scene.addEventListener("click", () => {
    tryStartMusic();
    openEnvelope();
  });

  const spillHints = () => {
    if (hintWords.classList.contains("hidden")) {
      return;
    }

    hintWords.classList.remove("armed");
    hintWords.classList.remove("spill");
    void hintWords.offsetWidth;
    hintWords.classList.add("spill");
  };

  hintBottle.addEventListener("click", () => {
    tryStartMusic();
    spillHints();
  });

  hintBottle.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    tryStartMusic();
    spillHints();
  });

  hintPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      tryStartMusic();
      answerInput.value = pill.textContent.trim();
      form.requestSubmit();
    });
  });

  const playQuote = async ({ text, className, duration }) => {
    quoteEl.className = "cinematic-quote";
    quoteEl.textContent = text;
    quoteEl.classList.add(...className.split(" "));
    void quoteEl.offsetWidth;
    quoteEl.classList.add("play");
    await wait(duration);
  };

  const revealIdentityPanel = async () => {
    quoteLayer.classList.add("hidden");
    identityPanel.classList.remove("hidden");
    identityPanel.classList.add("visible");
    await wait(300);
  };

  const playNarrativeSequence = async () => {
    seedQuoteParticles();
    if (quoteParticleField) {
      quoteParticleField.classList.remove("hidden");
      quoteParticleField.classList.add("active");
    }

    for (const quote of quotes) {
      await playQuote(quote);
    }

    await revealIdentityPanel();
  };

  const activateKeySequence = async () => {
    if (gateUnlocked) {
      return;
    }

    gateUnlocked = true;
    lockButton.disabled = true;
    keyPanel.classList.remove("hidden");
    keyPanel.classList.add("visible");

    await wait(2400);

    keyStatus.classList.remove("hidden");
    keyStatus.classList.add("visible");

    await wait(500);

    enterButton.classList.remove("hidden");
    enterButton.classList.add("visible");
  };

  const showEventCard = () => {
    identityPanel.classList.add("hidden");
    identityPanel.classList.remove("visible");
    quoteLayer.classList.add("hidden");
    if (quoteParticleField) {
      quoteParticleField.classList.add("hidden");
      quoteParticleField.classList.remove("active");
    }
    keyPanel.classList.add("hidden");
    eventStage.classList.remove("hidden");
    eventStage.classList.add("visible");
    eventStage.classList.remove("scroll-unroll");
    void eventStage.offsetWidth;
    eventStage.classList.add("scroll-unroll");
    eventStage.setAttribute("aria-hidden", "false");
    window.requestAnimationFrame(() => {
      seedFinalStageParticles();
    });
  };

  lockButton.addEventListener("click", () => {
    tryStartMusic();
    activateKeySequence();
  });

  enterButton.addEventListener("click", () => {
    tryStartMusic();
    showEventCard();
  });

  if (rsvpButton && rsvpPanel) {
    rsvpButton.addEventListener("click", () => {
      tryStartMusic();
      rsvpPanel.classList.toggle("hidden");
      const isHidden = rsvpPanel.classList.contains("hidden");
      rsvpPanel.setAttribute("aria-hidden", isHidden ? "true" : "false");
      if (!isHidden) {
        rsvpPanel.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!rsvpForm.reportValidity()) {
        return;
      }

      if (rsvpError) {
        rsvpError.classList.add("hidden");
        rsvpError.textContent = "";
      }

      const submitButton = rsvpForm.querySelector(".rsvp-submit");
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
      }

      const payload = {
        full_name: rsvpName.value.trim(),
        phone_number: rsvpPhone.value.trim(),
        email: rsvpEmail.value.trim(),
        guests: rsvpGuests?.value?.trim() || "0",
        attendance: rsvpAttend.value,
        message: rsvpMessage?.value?.trim() || ""
      };

      fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(async (response) => {
          if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            const errorMessage = data?.error || "Unable to submit RSVP. Please try again.";
            throw new Error(errorMessage);
          }
          return response.json();
        })
        .then(() => {
          rsvpForm.classList.add("hidden");
          if (rsvpSuccess) {
            rsvpSuccess.classList.remove("hidden");
          }
        })
        .catch((error) => {
          if (rsvpError) {
            rsvpError.textContent = error.message;
            rsvpError.classList.remove("hidden");
          }
        })
        .finally(() => {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Submit RSVP";
          }
        });
    });
  }

  const runSuccessJourney = () => {
    if (narrativeStarted) {
      return;
    }

    narrativeStarted = true;
    wrapper.classList.remove("floating");
    wrapper.classList.add("success-burning");
    body.classList.add("card-burning");

    window.setTimeout(() => {
      endScreen.setAttribute("aria-hidden", "false");
      body.classList.add("end-active");
    }, 3200);

    window.setTimeout(() => {
      playNarrativeSequence();
    }, 5300);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    tryStartMusic();
    const answer = answerInput.value.trim().toLowerCase();

    if (answer === "health") {
      result.textContent = "";
      result.style.color = "#1f7a3d";
      hintWords.classList.remove("armed");
      hintWords.classList.remove("spill");
      hintWords.classList.add("hidden");
      answerInput.disabled = true;
      submitButton.disabled = true;
      hintBottle.setAttribute("tabindex", "-1");
      letter.setAttribute("aria-hidden", "true");
      runSuccessJourney();
      return;
    }

    hintWords.classList.remove("hidden");
    hintWords.classList.remove("spill");
    hintWords.classList.add("armed");
    result.textContent = "Wrong answer. Tap the bottle for hints.";
    result.style.color = "#b42318";
  });
});
