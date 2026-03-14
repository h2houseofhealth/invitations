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
  const identityPanel = document.querySelector("#identity-panel");
  const lockButton = document.querySelector("#lock-button");
  const keyPanel = document.querySelector("#key-panel");
  const keyStatus = document.querySelector("#key-status");
  const enterButton = document.querySelector("#enter-button");
  const eventStage = document.querySelector("#event-stage");
  const eventParticleField = document.querySelector("#event-particle-field");

  // Quill elements
  const quillStage = document.querySelector("#quill-stage");
  const quillEl = document.querySelector("#quill");
  const quillInk = document.querySelector("#quill-ink-line");
  const writtenTextEl = document.querySelector("#written-text");
  const quillParticleField = document.querySelector("#quill-particle-field");

  // Cinematic quote elements
  const quoteLayer = document.querySelector("#quote-layer");
  const quoteEl = document.querySelector("#cinematic-quote");
  const quoteParticleField = document.querySelector("#quote-particle-field");

  const remainingQuotes = [
    { text: "In a world obsessed with disease, a few choose prevention.", className: "from-top-left",    duration: 5000 },
    { text: "In a system built for speed, a few demand precision.",       className: "from-bottom-right", duration: 5000 },
    { text: "In an era of reactive medicine...",                          className: "from-bottom",       duration: 4700 },
    { text: "A new circle is forming.",                                   className: "from-top",          duration: 4700 },
    { text: "WELCOME TO THE FUTURE OF HEALTH",                           className: "from-center glow",  duration: 5200 },
  ];

  let narrativeStarted = false;
  let gateUnlocked = false;
  let finalParticlesSeeded = false;
  let lightDotsSeeded = false;
  let quillParticlesSeeded = false;
  let quoteParticlesSeeded = false;
  let hasActivatedMusic = false;

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  // ── Music ─────────────────────────────────────────────────────────
  const tryStartMusic = () => {
    if (!bgMusic) return;
    bgMusic.volume = 0.55;
    bgMusic.loop = true;
    const p = bgMusic.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  const activateMusic = () => {
    if (hasActivatedMusic) return;
    hasActivatedMusic = true;
    tryStartMusic();
  };

  ["click", "touchstart", "keydown"].forEach((ev) => {
    window.addEventListener(ev, activateMusic, { once: true, passive: true });
  });

  // ── Light dots ────────────────────────────────────────────────────
  const seedLightDots = (count = 420) => {
    if (lightDotsSeeded || !light) return;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = "light-dot";
      dot.style.setProperty("--left",         `${randomBetween(0, 100)}%`);
      dot.style.setProperty("--top",          `${randomBetween(0, 100)}%`);
      dot.style.setProperty("--size",         `${randomBetween(1.4, 4.4)}px`);
      dot.style.setProperty("--duration",     `${randomBetween(7, 18)}s`);
      dot.style.setProperty("--delay",        `${randomBetween(-18, 0)}s`);
      dot.style.setProperty("--x-mid",        `${randomBetween(-120, 120)}px`);
      dot.style.setProperty("--y-mid",        `${randomBetween(-120, 120)}px`);
      dot.style.setProperty("--x-end",        `${randomBetween(-180, 180)}px`);
      dot.style.setProperty("--y-end",        `${randomBetween(-180, 180)}px`);
      dot.style.setProperty("--start-scale",  randomBetween(0.45, 0.95).toFixed(2));
      dot.style.setProperty("--mid-scale",    randomBetween(0.8, 1.3).toFixed(2));
      dot.style.setProperty("--end-scale",    randomBetween(0.5, 1.05).toFixed(2));
      dot.style.setProperty("--peak-opacity", randomBetween(0.22, 0.58).toFixed(2));
      light.appendChild(dot);
    }
    lightDotsSeeded = true;
  };
  seedLightDots();

  // ── Quill particles ───────────────────────────────────────────────
  const seedQuillParticles = (count = 180) => {
    if (quillParticlesSeeded || !quillParticleField) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "quill-particle";
      p.style.setProperty("--left",         `${randomBetween(0, 100)}%`);
      p.style.setProperty("--top",          `${randomBetween(0, 100)}%`);
      p.style.setProperty("--size",         `${randomBetween(1.5, 5)}px`);
      p.style.setProperty("--duration",     `${randomBetween(8, 20)}s`);
      p.style.setProperty("--delay",        `${randomBetween(-20, 0)}s`);
      p.style.setProperty("--x-mid",        `${randomBetween(-100, 100)}px`);
      p.style.setProperty("--y-mid",        `${randomBetween(-100, -20)}px`);
      p.style.setProperty("--x-end",        `${randomBetween(-140, 140)}px`);
      p.style.setProperty("--y-end",        `${randomBetween(-240, 100)}px`);
      p.style.setProperty("--start-scale",  randomBetween(0.4, 0.9).toFixed(2));
      p.style.setProperty("--mid-scale",    randomBetween(0.8, 1.3).toFixed(2));
      p.style.setProperty("--end-scale",    randomBetween(0.4, 1.0).toFixed(2));
      p.style.setProperty("--peak-opacity", randomBetween(0.15, 0.55).toFixed(2));
      quillParticleField.appendChild(p);
    }
    quillParticlesSeeded = true;
  };

  // ── Quote particles ───────────────────────────────────────────────
  const seedQuoteParticles = (count = 220) => {
    if (quoteParticlesSeeded || !quoteParticleField) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "quote-particle";
      p.style.setProperty("--left",         `${randomBetween(0, 100)}%`);
      p.style.setProperty("--top",          `${randomBetween(0, 100)}%`);
      p.style.setProperty("--size",         `${randomBetween(2, 7)}px`);
      p.style.setProperty("--duration",     `${randomBetween(8, 20)}s`);
      p.style.setProperty("--delay",        `${randomBetween(-20, 0)}s`);
      p.style.setProperty("--x-mid",        `${randomBetween(-130, 130)}px`);
      p.style.setProperty("--y-mid",        `${randomBetween(-100, -20)}px`);
      p.style.setProperty("--x-end",        `${randomBetween(-170, 170)}px`);
      p.style.setProperty("--y-end",        `${randomBetween(-260, 140)}px`);
      p.style.setProperty("--start-scale",  randomBetween(0.45, 0.95).toFixed(2));
      p.style.setProperty("--mid-scale",    randomBetween(0.85, 1.35).toFixed(2));
      p.style.setProperty("--end-scale",    randomBetween(0.45, 1.1).toFixed(2));
      p.style.setProperty("--peak-opacity", randomBetween(0.22, 0.7).toFixed(2));
      quoteParticleField.appendChild(p);
    }
    quoteParticlesSeeded = true;
  };

  // ── Final stage particles ─────────────────────────────────────────
  const seedFinalStageParticles = (count = 220) => {
    if (finalParticlesSeeded || !eventParticleField) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "quote-particle final-particle";
      p.style.setProperty("--left",         `${randomBetween(0, 100)}%`);
      p.style.setProperty("--top",          `${randomBetween(0, 100)}%`);
      p.style.setProperty("--size",         `${randomBetween(2, 7)}px`);
      p.style.setProperty("--duration",     `${randomBetween(8, 20)}s`);
      p.style.setProperty("--delay",        `${randomBetween(-20, 0)}s`);
      p.style.setProperty("--x-mid",        `${randomBetween(-130, 130)}px`);
      p.style.setProperty("--y-mid",        `${randomBetween(-100, -20)}px`);
      p.style.setProperty("--x-end",        `${randomBetween(-170, 170)}px`);
      p.style.setProperty("--y-end",        `${randomBetween(-260, 140)}px`);
      p.style.setProperty("--start-scale",  randomBetween(0.45, 0.95).toFixed(2));
      p.style.setProperty("--mid-scale",    randomBetween(0.85, 1.35).toFixed(2));
      p.style.setProperty("--end-scale",    randomBetween(0.45, 1.1).toFixed(2));
      p.style.setProperty("--peak-opacity", randomBetween(0.22, 0.7).toFixed(2));
      eventParticleField.appendChild(p);
    }
    finalParticlesSeeded = true;
  };

  // ── Init ──────────────────────────────────────────────────────────
  setTimeout(() => { body.classList.add("revealed"); }, 250);
  setTimeout(() => {
    wrapper.classList.add("floating");
    body.classList.add("ready");
  }, 4700);

  // ── Envelope open ─────────────────────────────────────────────────
  const openEnvelope = () => {
    if (wrapper.classList.contains("open") || wrapper.classList.contains("cracked")) return;
    wrapper.classList.remove("floating");
    wrapper.classList.add("cracked");
    body.classList.add("opened");
    window.setTimeout(() => {
      wrapper.classList.add("open");
      window.setTimeout(() => { wrapper.classList.add("drop"); }, 1500);
      window.setTimeout(() => { wrapper.classList.add("envelope-gone"); }, 2400);
    }, 850);
  };

  tapOpen.addEventListener("click", () => { tryStartMusic(); openEnvelope(); });
  scene.addEventListener("click", () => { tryStartMusic(); openEnvelope(); });

  // ── Hints ─────────────────────────────────────────────────────────
  const spillHints = () => {
    if (hintWords.classList.contains("hidden")) return;
    hintWords.classList.remove("armed", "spill");
    void hintWords.offsetWidth;
    hintWords.classList.add("spill");
  };

  hintBottle.addEventListener("click", () => { tryStartMusic(); spillHints(); });
  hintBottle.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault(); tryStartMusic(); spillHints();
  });

  hintPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      tryStartMusic();
      answerInput.value = pill.textContent.trim();
      form.requestSubmit();
    });
  });

  // ── Quill nib positioning ─────────────────────────────────────────
  // Uses getBoundingClientRect on the #ink-drop SVG element directly —
  // this is 100% accurate regardless of SVG rotation/flip transforms.
  // setQuillPos moves the quill div so the ink-drop lands at (nibX, nibY).
  const setQuillPos = (nibX, nibY) => {
    const stageR = quillStage.getBoundingClientRect();
    const inkDot = quillEl.querySelector("#ink-drop");
    if (!inkDot) return;

    // Current ink-drop centre in stage-relative coords
    const dotR    = inkDot.getBoundingClientRect();
    const curDotX = (dotR.left + dotR.right)  / 2 - stageR.left;
    const curDotY = (dotR.top  + dotR.bottom) / 2 - stageR.top;

    // Delta needed to reach target
    const dx = nibX - curDotX;
    const dy = nibY - curDotY;

    quillEl.style.left = `${parseFloat(quillEl.style.left || 0) + dx}px`;
    quillEl.style.top  = `${parseFloat(quillEl.style.top  || 0) + dy}px`;
  };

  // ── Quill writing engine ──────────────────────────────────────────
  const CHAR_SPEED    = 52;
  const PAUSE_AFTER   = 1400;
  const FADE_OUT_TIME = 700;

  const writeOneSentence = async (rawText) => {
    const displayText = rawText.replace(/\\n/g, "\n");
    const isGlowLine  = rawText.includes("WELCOME");

    writtenTextEl.textContent = "";
    writtenTextEl.className = "written-text" + (isGlowLine ? " glow" : "");
    writtenTextEl.style.opacity = "1";

    // Wait one frame so browser lays out writtenTextEl before querying rect
    await wait(16);

    const stageRect = quillStage.getBoundingClientRect();

    // Park quill at centre of stage so first getBoundingClientRect on ink-drop is valid
    quillEl.style.left = `${stageRect.width  / 2}px`;
    quillEl.style.top  = `${stageRect.height / 2}px`;
    quillEl.classList.add("visible");
    quillInk.style.opacity = "1";
    await wait(32); // let browser paint rotated element so ink-drop rect is valid

    for (let i = 0; i < displayText.length; i++) {
      writtenTextEl.textContent = displayText.slice(0, i + 1);

      const textNode = writtenTextEl.firstChild;
      if (textNode && textNode.nodeType === Node.TEXT_NODE && textNode.length > 0) {
        const safeEnd   = Math.min(i + 1, textNode.length);
        const safeStart = Math.max(0, safeEnd - 1);
        try {
          const range = document.createRange();
          range.setStart(textNode, safeStart);
          range.setEnd(textNode, safeEnd);
          const charRect = range.getBoundingClientRect();

          if (charRect.width > 0 || charRect.height > 0) {
            // Nib tip tracks right edge of last char, at the baseline
            const nibTargetX = charRect.right  - stageRect.left;
            const nibTargetY = charRect.bottom - stageRect.top;
            setQuillPos(nibTargetX, nibTargetY);
          }
        } catch (e) { /* skip on layout errors */ }
      }

      if (displayText[i] === "\n") {
        await wait(CHAR_SPEED * 3);
      } else {
        await wait(CHAR_SPEED + (Math.random() * 18 - 9));
      }
    }

    await wait(PAUSE_AFTER);

    writtenTextEl.style.transition = `opacity ${FADE_OUT_TIME}ms ease`;
    writtenTextEl.style.opacity    = "0";
    quillInk.style.opacity         = "0";
    await wait(FADE_OUT_TIME + 200);

    writtenTextEl.textContent      = "";
    writtenTextEl.style.transition = "";
    writtenTextEl.style.opacity    = "1";
    quillEl.classList.remove("visible");
    await wait(500);
  };

  // ── Cinematic quote player ────────────────────────────────────────
  const playQuote = async ({ text, className, duration }) => {
    quoteEl.className = "cinematic-quote";
    quoteEl.textContent = text;
    quoteEl.classList.add(...className.split(" "));
    void quoteEl.offsetWidth;
    quoteEl.classList.add("play");
    await wait(duration);
  };

  // ── Full narrative sequence ───────────────────────────────────────
  const playNarrativeSequence = async () => {

    // PHASE 1: Quill writes first line
    seedQuillParticles();
    quillParticleField.classList.remove("hidden");
    quillParticleField.classList.add("active");
    quillStage.classList.remove("hidden");
    quillStage.classList.add("visible");

    await wait(600);
    await writeOneSentence("You have been selected.");

    // PHASE 2: Cinematic quotes
    quillStage.classList.add("hidden");
    quillStage.classList.remove("visible");
    quillParticleField.classList.add("hidden");
    quillParticleField.classList.remove("active");

    seedQuoteParticles();
    quoteParticleField.classList.remove("hidden");
    quoteParticleField.classList.add("active");
    quoteLayer.classList.remove("hidden");

    for (const quote of remainingQuotes) {
      await playQuote(quote);
    }

    // PHASE 3: Identity panel
    await wait(400);
    quoteLayer.classList.add("hidden");
    quoteParticleField.classList.add("hidden");
    quoteParticleField.classList.remove("active");

    identityPanel.classList.remove("hidden");
    identityPanel.classList.add("visible");
  };

  // ── Lock / Key / Enter ────────────────────────────────────────────
  const activateKeySequence = async () => {
    if (gateUnlocked) return;
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
    keyPanel.classList.add("hidden");
    eventStage.classList.remove("hidden");
    eventStage.classList.add("visible");
    eventStage.setAttribute("aria-hidden", "false");
    window.requestAnimationFrame(() => { seedFinalStageParticles(); });
  };

  lockButton.addEventListener("click", () => { tryStartMusic(); activateKeySequence(); });
  enterButton.addEventListener("click", () => { tryStartMusic(); showEventCard(); });

  // ── Success journey ───────────────────────────────────────────────
  const runSuccessJourney = () => {
    if (narrativeStarted) return;
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

  // ── Form submit ───────────────────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    tryStartMusic();
    const answer = answerInput.value.trim().toLowerCase();

    if (answer === "health") {
      result.textContent = "";
      result.style.color = "#1f7a3d";
      hintWords.classList.remove("armed", "spill");
      hintWords.classList.add("hidden");
      answerInput.disabled  = true;
      submitButton.disabled = true;
      hintBottle.setAttribute("tabindex", "-1");
      letter.setAttribute("aria-hidden", "true");
      runSuccessJourney();
      return;
    }

    hintWords.classList.remove("hidden", "spill");
    hintWords.classList.add("armed");
    result.textContent = "Wrong answer. Tap the bottle for hints.";
    result.style.color = "#b42318";
  });
});