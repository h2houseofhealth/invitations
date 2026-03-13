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

  // Quill writing elements
  const quillStage = document.querySelector("#quill-stage");
  const quillEl = document.querySelector("#quill");
  const quillInk = document.querySelector("#quill-ink-line");
  const writtenTextEl = document.querySelector("#written-text");
  const quillParticleField = document.querySelector("#quill-particle-field");

  const narrativeLines = [
    "You have been selected.",
    "In a world obsessed with disease,\na few choose prevention.",
    "In a system built for speed,\na few demand precision.",
    "In an era of reactive medicine...",
    "A new circle is forming.",
    "WELCOME TO THE FUTURE OF HEALTH"
  ];

  let narrativeStarted = false;
  let gateUnlocked = false;
  let finalParticlesSeeded = false;
  let lightDotsSeeded = false;
  let quillParticlesSeeded = false;
  let hasActivatedMusic = false;

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const tryStartMusic = () => {
    if (!bgMusic) return;
    bgMusic.volume = 0.55;
    bgMusic.loop = true;
    const playPromise = bgMusic.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const activateMusic = () => {
    if (hasActivatedMusic) return;
    hasActivatedMusic = true;
    tryStartMusic();
  };

  ["click", "touchstart", "keydown"].forEach((eventName) => {
    window.addEventListener(eventName, activateMusic, { once: true, passive: true });
  });

  // ── Light dots ──────────────────────────────────────────────────
  const seedLightDots = (count = 420) => {
    if (lightDotsSeeded || !light) return;
    for (let i = 0; i < count; i++) {
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

  // ── Quill particles ─────────────────────────────────────────────
  const seedQuillParticles = (count = 180) => {
    if (quillParticlesSeeded || !quillParticleField) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "quill-particle";
      p.style.setProperty("--left", `${randomBetween(0, 100)}%`);
      p.style.setProperty("--top", `${randomBetween(0, 100)}%`);
      p.style.setProperty("--size", `${randomBetween(1.5, 5)}px`);
      p.style.setProperty("--duration", `${randomBetween(8, 20)}s`);
      p.style.setProperty("--delay", `${randomBetween(-20, 0)}s`);
      p.style.setProperty("--x-mid", `${randomBetween(-100, 100)}px`);
      p.style.setProperty("--y-mid", `${randomBetween(-100, -20)}px`);
      p.style.setProperty("--x-end", `${randomBetween(-140, 140)}px`);
      p.style.setProperty("--y-end", `${randomBetween(-240, 100)}px`);
      p.style.setProperty("--start-scale", randomBetween(0.4, 0.9).toFixed(2));
      p.style.setProperty("--mid-scale", randomBetween(0.8, 1.3).toFixed(2));
      p.style.setProperty("--end-scale", randomBetween(0.4, 1.0).toFixed(2));
      p.style.setProperty("--peak-opacity", randomBetween(0.15, 0.55).toFixed(2));
      quillParticleField.appendChild(p);
    }
    quillParticlesSeeded = true;
  };

  // ── Final stage particles ────────────────────────────────────────
  const seedFinalStageParticles = (count = 220) => {
    if (finalParticlesSeeded || !eventParticleField) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "quote-particle final-particle";
      p.style.setProperty("--left", `${randomBetween(0, 100)}%`);
      p.style.setProperty("--top", `${randomBetween(0, 100)}%`);
      p.style.setProperty("--size", `${randomBetween(2, 7)}px`);
      p.style.setProperty("--duration", `${randomBetween(8, 20)}s`);
      p.style.setProperty("--delay", `${randomBetween(-20, 0)}s`);
      p.style.setProperty("--x-mid", `${randomBetween(-130, 130)}px`);
      p.style.setProperty("--y-mid", `${randomBetween(-100, -20)}px`);
      p.style.setProperty("--x-end", `${randomBetween(-170, 170)}px`);
      p.style.setProperty("--y-end", `${randomBetween(-260, 140)}px`);
      p.style.setProperty("--start-scale", randomBetween(0.45, 0.95).toFixed(2));
      p.style.setProperty("--mid-scale", randomBetween(0.85, 1.35).toFixed(2));
      p.style.setProperty("--end-scale", randomBetween(0.45, 1.1).toFixed(2));
      p.style.setProperty("--peak-opacity", randomBetween(0.22, 0.7).toFixed(2));
      eventParticleField.appendChild(p);
    }
    finalParticlesSeeded = true;
  };

  // ── Init ─────────────────────────────────────────────────────────
  setTimeout(() => { body.classList.add("revealed"); }, 250);
  setTimeout(() => {
    wrapper.classList.add("floating");
    body.classList.add("ready");
  }, 4700);

  // ── Envelope open ────────────────────────────────────────────────
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

  // ── Hints ────────────────────────────────────────────────────────
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

  // ── Quill writing engine ─────────────────────────────────────────
  /**
   * Measures where each character ends up in the rendered text block,
   * so the quill tip can track from char to char.
   */
  const getCharPositions = (containerEl, text) => {
    // We'll lay out the text char-by-char in a hidden clone to measure positions
    const positions = [];
    const clone = containerEl.cloneNode(false);
    clone.style.visibility = "hidden";
    clone.style.position = "absolute";
    clone.style.pointerEvents = "none";
    clone.style.width = window.getComputedStyle(containerEl).width;
    clone.style.whiteSpace = "pre-wrap";
    clone.style.opacity = "0";
    document.body.appendChild(clone);

    for (let i = 0; i < text.length; i++) {
      clone.textContent = text.slice(0, i + 1);
      // Use a range to find where the last character is
      const range = document.createRange();
      const textNode = clone.firstChild;
      if (!textNode) { positions.push({ x: 0, y: 0 }); continue; }
      const safeEnd = Math.min(i + 1, textNode.length);
      const safeStart = Math.max(0, safeEnd - 1);
      range.setStart(textNode, safeStart);
      range.setEnd(textNode, safeEnd);
      const rect = range.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      positions.push({
        x: rect.right - containerRect.left,
        y: rect.top - containerRect.top + rect.height * 0.5
      });
    }

    document.body.removeChild(clone);
    return positions;
  };

  const CHAR_SPEED = 52; // ms per character
  const PAUSE_AFTER = 1400; // ms to hold completed sentence
  const FADE_OUT_TIME = 700; // ms for text fade out

  const writeOneSentence = async (rawText) => {
    // Replace \n with actual newline for display
    const displayText = rawText.replace(/\\n/g, "\n");
    const isGlowLine = rawText.includes("WELCOME");

    // Prepare text element
    writtenTextEl.textContent = "";
    writtenTextEl.className = "written-text" + (isGlowLine ? " glow" : "");
    writtenTextEl.style.opacity = "1";

    // Position the quill at start
    const stageRect = quillStage.getBoundingClientRect();
    const textRect = writtenTextEl.getBoundingClientRect();

    // Start quill at left of text block
    let quillX = textRect.left - stageRect.left - 10;
    let quillY = textRect.top - stageRect.top + 14;

    setQuillPos(quillX, quillY);
    quillEl.classList.add("visible");
    quillInk.style.opacity = "1";

    // Pre-measure positions using a temp element
    const measureEl = document.createElement("div");
    measureEl.className = "written-text" + (isGlowLine ? " glow" : "");
    measureEl.style.cssText = window.getComputedStyle(writtenTextEl).cssText;
    measureEl.style.visibility = "hidden";
    measureEl.style.position = "absolute";
    measureEl.style.top = writtenTextEl.getBoundingClientRect().top - stageRect.top + "px";
    measureEl.style.left = writtenTextEl.getBoundingClientRect().left - stageRect.left + "px";
    measureEl.style.width = window.getComputedStyle(writtenTextEl).width;
    measureEl.style.whiteSpace = "pre-wrap";
    measureEl.style.pointerEvents = "none";
    quillStage.appendChild(measureEl);

    // Write characters
    for (let i = 0; i < displayText.length; i++) {
      writtenTextEl.textContent = displayText.slice(0, i + 1);

      // Measure last char position
      const range = document.createRange();
      const textNode = writtenTextEl.firstChild;
      if (textNode && textNode.length > 0) {
        const safeEnd = Math.min(i + 1, textNode.length);
        const safeStart = Math.max(0, safeEnd - 1);
        try {
          range.setStart(textNode, safeStart);
          range.setEnd(textNode, safeEnd);
          const charRect = range.getBoundingClientRect();
          quillX = charRect.right - stageRect.left -48;
          quillY = charRect.top - stageRect.top + charRect.height -200;
          setQuillPos(quillX, quillY);
        } catch (e) { /* skip */ }
      }

      // Newline character: quill moves down
      if (displayText[i] === "\n") {
        await wait(CHAR_SPEED * 3);
      } else {
        await wait(CHAR_SPEED + (Math.random() * 18 - 9));
      }
    }

    quillStage.removeChild(measureEl);

    // Hold the sentence
    await wait(PAUSE_AFTER);

    // Fade out text
    writtenTextEl.style.transition = `opacity ${FADE_OUT_TIME}ms ease`;
    writtenTextEl.style.opacity = "0";
    quillInk.style.opacity = "0";

    await wait(FADE_OUT_TIME + 200);

    // Reset
    writtenTextEl.textContent = "";
    writtenTextEl.style.transition = "";
    writtenTextEl.style.opacity = "1";
    quillEl.classList.remove("visible");

    // Brief pause before next line
    await wait(500);
  };

  const setQuillPos = (x, y) => {
    quillEl.style.transform = `translate(${x}px, ${y}px) rotate(145deg)`;
  };

  // ── Narrative sequence ───────────────────────────────────────────
  const playNarrativeSequence = async () => {
    seedQuillParticles();
    quillParticleField.classList.remove("hidden");
    quillParticleField.classList.add("active");
    quillStage.classList.remove("hidden");
    quillStage.classList.add("visible");

    // Start quill off-screen
    setQuillPos(-120, 200);

    // Brief intro pause
    await wait(800);

    for (const line of narrativeLines) {
      await writeOneSentence(line);
    }

    // All lines done → reveal identity panel
    await wait(400);
    quillStage.classList.add("hidden");
    quillStage.classList.remove("visible");
    quillParticleField.classList.add("hidden");
    quillParticleField.classList.remove("active");

    identityPanel.classList.remove("hidden");
    identityPanel.classList.add("visible");
  };

  // ── Lock / Key / Enter ───────────────────────────────────────────
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

  // ── Success journey ──────────────────────────────────────────────
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

  // ── Form submit ──────────────────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    tryStartMusic();
    const answer = answerInput.value.trim().toLowerCase();

    if (answer === "health") {
      result.textContent = "";
      result.style.color = "#1f7a3d";
      hintWords.classList.remove("armed", "spill");
      hintWords.classList.add("hidden");
      answerInput.disabled = true;
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
