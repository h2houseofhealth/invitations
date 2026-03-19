window.addEventListener("load", () => {
  const body = document.body;
  const bgMusic = document.querySelector("#bg-music");
  const scene = document.querySelector(".scene");
  const light = document.querySelector(".light");
  const wrapper = document.querySelector(".wrapper");
  const sealButton = document.querySelector("#seal-button");
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
  const quoteWriteStage = document.querySelector(".quote-write-stage");
  const quillWriter = document.querySelector("#quill-writer");
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
  const eventImageCard = document.querySelector(".event-image-card");
  const rsvpForm = document.querySelector("#rsvp-form");
  const rsvpName = document.querySelector("#rsvp-name");
  const rsvpPhone = document.querySelector("#rsvp-phone");
  const rsvpAttend = document.querySelector("#rsvp-attend");
  const rsvpGuests = document.querySelector("#rsvp-guests");
  const rsvpMessage = document.querySelector("#rsvp-message");
  const rsvpSuccess = document.querySelector("#rsvp-success");
  const rsvpError = document.querySelector("#rsvp-error");
  const rsvpWhatsAppNumber = "919000141936";

  const quotes = [
    { text: "you are the chosen one!", className: "from-center quill-feather", duration: 4800 },
    {
      text: "In a world obsessed with disease,\n a few choose prevention.",
      className: "from-top-left windsong typewriter",
      duration: 5600,
      voiceSrc: "voicesai-dumbledore-1.mp3",
      typeSpeedMultiplier: 0.7,
      gapAfterMs: 660
    },
    {
      text: "In a system built for speed,\n a few demand precision.",
      className: "from-bottom-right windsong typewriter",
      duration: 5000,
      voiceSrc: "voicesai-dumbledore-2.mp3",
      typeSpeedMultiplier: 0.7,
      gapAfterMs: 20
    },
    {
      text: "In an era of reactive medicine...",
      className: "from-bottom windsong typewriter",
      duration: 4700,
      voiceSrc: "voicesai-dumbledore-3.mp3",
      gapAfterMs: 10
    },
    {
      text: "A new circle is forming",
      className: "from-top windsong typewriter",
      duration: 4700,
      voiceSrc: "voicesai-dumbledore-4.mp3"
    },
    {
      text: "Welcome to the\nFuture of Health",
      className: "from-center glow windsong typewriter",
      duration: 5200,
      voiceSrc: "voicesai-dumbledore-5.mp3"
    }
  ];

  let narrativeStarted = false;
  let gateUnlocked = false;
  let quoteParticlesSeeded = false;
  let finalParticlesSeeded = false;
  let lightDotsSeeded = false;
  let hasActivatedMusic = false;
  const quoteVoiceSources = new Map([
    ["in a world", "In_a_world.mp3"],
    ["in a system", "in_a_system.mp3"],
    ["in an era", "In_an_era.mp3"],
    ["a new circle", "a_new_circle.mp3"],
    ["welcome", "welcome.mp3"]
  ]);
  const quoteVoiceTracks = new Map();
  let activeQuoteVoiceTrack = null;

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const randomBetween = (min, max) => Math.random() * (max - min) + min;
  const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isLowPowerDevice =
    Number(navigator.deviceMemory || 0) > 0 && Number(navigator.deviceMemory) <= 4;

  const PARTICLE_COUNTS = (() => {
    if (prefersReducedMotion) {
      return { light: 80, quote: 36, final: 40 };
    }

    if (isMobileViewport || isLowPowerDevice) {
      return { light: 140, quote: 70, final: 78 };
    }

    return { light: 260, quote: 120, final: 130 };
  })();

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

  const normalizeQuoteText = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");

  const resolveQuoteVoiceSource = (quoteText) => {
    const words = normalizeQuoteText(quoteText).split(" ").filter(Boolean);
    const maxWords = Math.min(4, words.length);

    for (let size = maxWords; size >= 1; size -= 1) {
      const key = words.slice(0, size).join(" ");
      if (quoteVoiceSources.has(key)) {
        return quoteVoiceSources.get(key);
      }
    }

    return null;
  };

  const getOrCreateQuoteVoiceTrack = (src) => {
    if (!src) {
      return null;
    }

    if (!quoteVoiceTracks.has(src)) {
      const track = new Audio(src);
      track.preload = "auto";
      track.volume = 1;
      quoteVoiceTracks.set(src, track);
    }

    return quoteVoiceTracks.get(src);
  };

  const startQuoteVoiceForQuote = ({ text: quoteText, voiceSrc }) => {
    const src = voiceSrc || resolveQuoteVoiceSource(quoteText);
    const track = getOrCreateQuoteVoiceTrack(src);
    if (!track) {
      return;
    }

    if (activeQuoteVoiceTrack && activeQuoteVoiceTrack !== track) {
      activeQuoteVoiceTrack.pause();
      activeQuoteVoiceTrack.currentTime = 0;
    }

    activeQuoteVoiceTrack = track;
    track.currentTime = 0;
    const playPromise = track.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const stopQuoteVoice = () => {
    quoteVoiceTracks.forEach((track) => {
      track.pause();
      track.currentTime = 0;
    });
    activeQuoteVoiceTrack = null;
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

  const seedLightDots = (count = PARTICLE_COUNTS.light) => {
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

  const seedQuoteParticles = (count = PARTICLE_COUNTS.quote) => {
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

  const seedFinalStageParticles = (count = PARTICLE_COUNTS.final) => {
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

  if (sealButton) {
    sealButton.addEventListener("click", (event) => {
      event.stopPropagation();
      tryStartMusic();
      openEnvelope();
    });

    sealButton.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      tryStartMusic();
      openEnvelope();
    });
  }

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

  const hideQuillWriter = () => {
    if (!quillWriter) {
      return;
    }

    quillWriter.classList.remove("active");
    quillWriter.classList.add("hidden");
    quillWriter.style.removeProperty("--quill-x");
    quillWriter.style.removeProperty("--quill-y");
    quillWriter.style.removeProperty("--quill-tilt");
  };

  const QUILL_GLYPH_STROKES = {
    a: [
      { x: 0.15, y: 0.62 },
      { x: 0.36, y: 0.42 },
      { x: 0.64, y: 0.42 },
      { x: 0.82, y: 0.62 },
      { x: 0.62, y: 0.76 },
      { x: 0.34, y: 0.76 },
      { x: 0.2, y: 0.6 }
    ],
    b: [
      { x: 0.18, y: 0.2 },
      { x: 0.18, y: 0.9 },
      { x: 0.45, y: 0.72 },
      { x: 0.75, y: 0.62 },
      { x: 0.46, y: 0.46 },
      { x: 0.2, y: 0.54 }
    ],
    c: [
      { x: 0.8, y: 0.4 },
      { x: 0.58, y: 0.3 },
      { x: 0.26, y: 0.5 },
      { x: 0.34, y: 0.78 },
      { x: 0.72, y: 0.72 }
    ],
    d: [
      { x: 0.72, y: 0.18 },
      { x: 0.72, y: 0.92 },
      { x: 0.46, y: 0.76 },
      { x: 0.2, y: 0.56 },
      { x: 0.36, y: 0.32 },
      { x: 0.7, y: 0.44 }
    ],
    e: [
      { x: 0.78, y: 0.48 },
      { x: 0.52, y: 0.38 },
      { x: 0.27, y: 0.52 },
      { x: 0.45, y: 0.7 },
      { x: 0.77, y: 0.62 }
    ],
    h: [
      { x: 0.17, y: 0.2 },
      { x: 0.17, y: 0.88 },
      { x: 0.25, y: 0.64 },
      { x: 0.5, y: 0.5 },
      { x: 0.78, y: 0.68 },
      { x: 0.78, y: 0.88 }
    ],
    l: [
      { x: 0.35, y: 0.2 },
      { x: 0.35, y: 0.88 },
      { x: 0.56, y: 0.88 }
    ],
    n: [
      { x: 0.2, y: 0.7 },
      { x: 0.2, y: 0.42 },
      { x: 0.45, y: 0.52 },
      { x: 0.7, y: 0.7 },
      { x: 0.7, y: 0.42 }
    ],
    o: [
      { x: 0.22, y: 0.58 },
      { x: 0.4, y: 0.36 },
      { x: 0.68, y: 0.36 },
      { x: 0.84, y: 0.58 },
      { x: 0.67, y: 0.78 },
      { x: 0.38, y: 0.78 },
      { x: 0.22, y: 0.58 }
    ],
    s: [
      { x: 0.76, y: 0.36 },
      { x: 0.49, y: 0.28 },
      { x: 0.28, y: 0.45 },
      { x: 0.55, y: 0.56 },
      { x: 0.77, y: 0.72 },
      { x: 0.45, y: 0.82 },
      { x: 0.24, y: 0.74 }
    ],
    t: [
      { x: 0.46, y: 0.2 },
      { x: 0.46, y: 0.88 },
      { x: 0.28, y: 0.42 },
      { x: 0.68, y: 0.42 }
    ],
    u: [
      { x: 0.24, y: 0.42 },
      { x: 0.24, y: 0.74 },
      { x: 0.52, y: 0.82 },
      { x: 0.78, y: 0.72 },
      { x: 0.78, y: 0.42 }
    ],
    v: [
      { x: 0.2, y: 0.42 },
      { x: 0.46, y: 0.84 },
      { x: 0.8, y: 0.42 }
    ],
    y: [
      { x: 0.17, y: 0.38 },
      { x: 0.46, y: 0.74 },
      { x: 0.74, y: 0.4 },
      { x: 0.58, y: 0.74 },
      { x: 0.47, y: 1.02 },
      { x: 0.62, y: 1.3 }
    ],
    "!": [
      { x: 0.48, y: 0.2 },
      { x: 0.48, y: 0.72 },
      { x: 0.48, y: 0.9 }
    ]
  };

  const DEFAULT_QUILL_STROKE = [
    { x: 0.15, y: 0.7 },
    { x: 0.42, y: 0.45 },
    { x: 0.78, y: 0.7 }
  ];

  const getQuillStrokeForGlyph = (character) => {
    const token = (character || "").toLowerCase();
    return QUILL_GLYPH_STROKES[token] || DEFAULT_QUILL_STROKE;
  };

  const positionQuillTipAtStrokePoint = (letterEl, strokePoint, fallbackTilt, previousPoint) => {
    if (!quillWriter || !quoteWriteStage || !letterEl) {
      return;
    }

    const stageRect = quoteWriteStage.getBoundingClientRect();
    const letterRect = letterEl.getBoundingClientRect();
    const pointX = Math.max(0, Math.min(1.03, strokePoint.x));
    const pointY = Math.max(0.12, Math.min(1.34, strokePoint.y));
    const targetX = letterRect.left - stageRect.left + letterRect.width * pointX;
    const targetY = letterRect.top - stageRect.top + letterRect.height * pointY;
    let tilt = fallbackTilt;

    if (previousPoint) {
      const dx = strokePoint.x - previousPoint.x;
      const dy = strokePoint.y - previousPoint.y;
      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
        const segmentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        tilt = Math.max(-38, Math.min(16, segmentAngle - 34));
      }
    }

    quillWriter.style.setProperty("--quill-x", `${targetX.toFixed(2)}px`);
    quillWriter.style.setProperty("--quill-y", `${targetY.toFixed(2)}px`);
    quillWriter.style.setProperty("--quill-tilt", `${tilt.toFixed(2)}deg`);
  };

  const traceQuillGlyph = async (letterEl, index, letterCount, letterBudgetMs) => {
    const stroke = getQuillStrokeForGlyph(letterEl.textContent);
    const sweep = letterCount > 1 ? index / (letterCount - 1) : 0;
    const sweepTilt = -16 + Math.sin(sweep * Math.PI) * 4;

    if (stroke.length === 0) {
      letterEl.classList.add("revealed");
      await wait(letterBudgetMs);
      return;
    }

    positionQuillTipAtStrokePoint(letterEl, stroke[0], sweepTilt);

    if (stroke.length > 1) {
      const traceBudgetMs = Math.max(20, letterBudgetMs * 0.74);
      const segmentMs = Math.max(10, traceBudgetMs / (stroke.length - 1));

      for (let pointIndex = 1; pointIndex < stroke.length; pointIndex += 1) {
        const currentPoint = stroke[pointIndex];
        const previousPoint = stroke[pointIndex - 1];
        positionQuillTipAtStrokePoint(letterEl, currentPoint, sweepTilt, previousPoint);
        await wait(segmentMs);
      }

      letterEl.classList.add("revealed");
      await wait(Math.max(8, letterBudgetMs - segmentMs * (stroke.length - 1)));
      return;
    }

    const moveLeadMs = Math.min(70, Math.max(28, letterBudgetMs * 0.45));
    await wait(moveLeadMs);
    letterEl.classList.add("revealed");
    await wait(Math.max(8, letterBudgetMs - moveLeadMs));
  };

  const renderQuillLetters = (text) => {
    const writingLetters = [];
    quoteEl.innerHTML = "";

    const fragment = document.createDocumentFragment();
    for (const character of text) {
      const letter = document.createElement("span");
      const isWhitespace = character.trim() === "";
      letter.className = isWhitespace ? "quill-space" : "quill-char";
      if (!isWhitespace) {
        writingLetters.push(letter);
      }
      letter.textContent = isWhitespace ? "\u00A0" : character;
      fragment.appendChild(letter);
    }

    quoteEl.appendChild(fragment);
    return writingLetters;
  };

  const playQuillQuote = async ({ text, className, duration }) => {
    const classTokens = className.split(" ").filter(Boolean);
    quoteEl.className = "cinematic-quote";
    quoteEl.classList.add(...classTokens);

    const writingLetters = renderQuillLetters(text);
    const letterCount = Math.max(writingLetters.length, 1);
    const writeDuration = Math.max(1500, Math.min(duration - 900, letterCount * 95));
    const stepMs = Math.max(40, writeDuration / letterCount);
    const quoteStart = performance.now();

    if (quillWriter) {
      quillWriter.classList.remove("hidden");
      if (writingLetters[0]) {
        const firstStroke = getQuillStrokeForGlyph(writingLetters[0].textContent);
        positionQuillTipAtStrokePoint(writingLetters[0], firstStroke[0], -16);
      }
      void quillWriter.offsetWidth;
      quillWriter.classList.add("active");
    }

    void quoteEl.offsetWidth;
    quoteEl.classList.add("play");

    for (let index = 0; index < writingLetters.length; index += 1) {
      const activeLetter = writingLetters[index];
      await traceQuillGlyph(activeLetter, index, letterCount, stepMs);
    }

    const elapsed = performance.now() - quoteStart;
    const remainingDuration = Math.max(0, duration - elapsed);
    await wait(remainingDuration);
    hideQuillWriter();
  };

  const renderTypewriterLetters = (text) => {
    const writingLetters = [];
    quoteEl.innerHTML = "";

    const fragment = document.createDocumentFragment();
    for (const character of text) {
      if (character === "\n") {
        fragment.appendChild(document.createElement("br"));
        continue;
      }

      const letter = document.createElement("span");
      const isWhitespace = character.trim() === "";
      letter.className = isWhitespace ? "type-space" : "type-char";
      if (!isWhitespace) {
        writingLetters.push(letter);
      }
      letter.textContent = isWhitespace ? "\u00A0" : character;
      fragment.appendChild(letter);
    }

    quoteEl.appendChild(fragment);
    return writingLetters;
  };

  const playTypewriterQuote = async ({ text, className, duration, typeSpeedMultiplier = 1 }) => {
    const classTokens = className.split(" ").filter(Boolean);
    quoteEl.className = "cinematic-quote";
    quoteEl.classList.add(...classTokens);

    const writingLetters = renderTypewriterLetters(text);
    const letterCount = Math.max(writingLetters.length, 1);
    const writeDuration = Math.max(1000, Math.min(duration - 700, letterCount * 72));
    const stepMs = Math.max(26, (writeDuration / letterCount) * typeSpeedMultiplier);
    const quoteStart = performance.now();

    void quoteEl.offsetWidth;
    quoteEl.classList.add("play");

    for (let index = 0; index < writingLetters.length; index += 1) {
      writingLetters[index].classList.add("revealed");
      await wait(stepMs);
    }

    const elapsed = performance.now() - quoteStart;
    const remainingDuration = Math.max(0, duration - elapsed);
    await wait(remainingDuration);
  };

  const playQuote = async ({ text, className, duration, voiceSrc, typeSpeedMultiplier }) => {
    startQuoteVoiceForQuote({ text, voiceSrc });
    hideQuillWriter();
    quoteEl.style.setProperty("--quote-play-ms", `${duration}ms`);

    if (className.includes("quill-feather")) {
      await playQuillQuote({ text, className, duration });
      return;
    }

    if (className.includes("typewriter")) {
      await playTypewriterQuote({ text, className, duration, typeSpeedMultiplier });
      return;
    }

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
    const interQuoteGapMs = 360;

    seedQuoteParticles();
    if (quoteParticleField) {
      quoteParticleField.classList.remove("hidden");
      quoteParticleField.classList.add("active");
    }

    for (let index = 0; index < quotes.length; index += 1) {
      await playQuote(quotes[index]);
      if (index < quotes.length - 1) {
        await wait(quotes[index].gapAfterMs ?? interQuoteGapMs);
      }
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
    stopQuoteVoice();
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

  if (rsvpButton && rsvpPanel && eventImageCard) {
    rsvpButton.addEventListener("click", () => {
      tryStartMusic();
      rsvpPanel.classList.toggle("hidden");
      const isHidden = rsvpPanel.classList.contains("hidden");
      rsvpPanel.setAttribute("aria-hidden", isHidden ? "true" : "false");
      rsvpButton.setAttribute("aria-expanded", isHidden ? "false" : "true");
      eventImageCard.classList.toggle("show-rsvp", !isHidden);
    });
  }

  if (rsvpPhone) {
    rsvpPhone.addEventListener("input", () => {
      const numericValue = rsvpPhone.value.replace(/\D+/g, "").slice(0, 10);
      if (rsvpPhone.value !== numericValue) {
        rsvpPhone.value = numericValue;
      }
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (rsvpPhone) {
        rsvpPhone.value = rsvpPhone.value.replace(/\D+/g, "").slice(0, 10);
      }
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
        submitButton.textContent = "Opening WhatsApp...";
      }

      const guestsValue = rsvpGuests?.value?.trim() || "0";
      const messageLines = [
        "RSVP",
        `Name: ${rsvpName.value.trim()}`,
        `Phone: ${rsvpPhone.value.trim()}`,
        `Guests: ${guestsValue}`,
        `Will you be attending?: ${rsvpAttend.value}`
      ];

      const guestMessage = rsvpMessage?.value?.trim();
      if (guestMessage) {
        messageLines.push(`${guestMessage}`);
      }

      if (rsvpAttend.value.toLowerCase() === "attending") {
        messageLines.push(
          "Yes! I’m honored to be the chosen one and excited to grace the occasion with my presence."
        );
      }

      const url = `https://wa.me/${rsvpWhatsAppNumber}?text=${encodeURIComponent(messageLines.join("\n"))}`;
      const opened = window.open(url, "_blank");
      if (!opened) {
        window.location.href = url;
      }

      rsvpForm.classList.add("hidden");
      if (rsvpSuccess) {
        rsvpSuccess.classList.remove("hidden");
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit RSVP";
      }
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
    }, 120);

    window.setTimeout(() => {
      playNarrativeSequence();
    }, 350);
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
