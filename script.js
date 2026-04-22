window.addEventListener("load", () => {
  const body = document.body;
  const bgMusic = document.querySelector("#bg-music");

  const eventSlot = {
    date: "8 April 2026",
    time: "10:00 AM"
  };

  /* keep the invitation locked to one event slot */
  const _calEl  = document.querySelector("#rsvp-add-calendar");
  if (_calEl)  _calEl.href = "#";
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
  const lockPanel = document.querySelector("#lock-panel");
  const lockButton = document.querySelector("#lock-button");
  const keyPanel = document.querySelector("#key-panel");
  const keyStatus = document.querySelector("#key-status");
  const enterButton = document.querySelector("#enter-button");
  const eventStage = document.querySelector("#event-stage");
  const eventParticleField = document.querySelector("#event-particle-field");
  const rsvpButton = document.querySelector("#rsvp-button");
  const rsvpRow = document.querySelector("#rsvp-row");
  const rsvpPanel = document.querySelector("#rsvp-panel");
  const rsvpClose = document.querySelector("#rsvp-close");
  const eventImageCard = document.querySelector(".event-image-card");
  const rsvpForm = document.querySelector("#rsvp-form");
  const rsvpName = document.querySelector("#rsvp-name");
  const rsvpAttend = document.querySelector("#rsvp-attend");
  const rsvpGuestsField = document.querySelector("#rsvp-guests-field");
  const rsvpGuests = document.querySelector("#rsvp-guests");
  const rsvpDateField = document.querySelector("#rsvp-date-field");
  const rsvpDay = document.querySelector("#rsvp-day");
  const rsvpMonth = document.querySelector("#rsvp-month");
  const rsvpYear = document.querySelector("#rsvp-year");
  const rsvpTimeField = document.querySelector("#rsvp-time-field");
  const rsvpHour = document.querySelector("#rsvp-hour");
  const rsvpMinute = document.querySelector("#rsvp-minute");
  const rsvpPeriod = document.querySelector("#rsvp-period");
  const rsvpSuccess = document.querySelector("#rsvp-success");
  const rsvpSuccessTitle = document.querySelector("#rsvp-success-title");
  const rsvpSuccessCopy = document.querySelector("#rsvp-success-copy");
  const rsvpAddCalendar = document.querySelector("#rsvp-add-calendar");
  const rsvpError = document.querySelector("#rsvp-error");
  const rsvpWhatsAppNumber = "919000141936";
  const rsvpWindowStart = new Date(2026, 3, 22);
  const rsvpWindowEnd = new Date(2026, 4, 15, 23, 59, 59, 999);

  const buildDateValue = (dayValue, monthValue, yearValue) => {
    if (!dayValue || !monthValue || !yearValue) {
      return "";
    }

    return `${yearValue}-${monthValue}-${String(dayValue).padStart(2, "0")}`;
  };

  const isAllowedDate = (dayValue, monthValue, yearValue) => {
    const value = buildDateValue(dayValue, monthValue, yearValue);
    if (!value) {
      return false;
    }

    const [year, month, day] = value.split("-");
    const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
    return selectedDate >= rsvpWindowStart && selectedDate <= rsvpWindowEnd;
  };

  const formatRsvpDate = (dayValue, monthValue, yearValue) => {
    const value = buildDateValue(dayValue, monthValue, yearValue);
    if (!value) {
      return "";
    }

    const [year, month, day] = value.split("-");

    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const buildTime24Hour = (hourValue, minuteValue, periodValue) => {
    if (!hourValue || !minuteValue || !periodValue) {
      return "";
    }

    const hour = Number(hourValue);
    if (!Number.isFinite(hour) || hour < 1 || hour > 12) {
      return "";
    }

    let hours24 = hour % 12;
    if (periodValue === "PM") {
      hours24 += 12;
    }

    const totalMinutes = (hours24 * 60) + Number(minuteValue);
    const minAllowedMinutes = 11 * 60;
    const maxAllowedMinutes = 19 * 60;
    if (totalMinutes < minAllowedMinutes || totalMinutes > maxAllowedMinutes) {
      return "";
    }

    return `${String(hours24).padStart(2, "0")}:${minuteValue}`;
  };

  const formatRsvpTime = (hourValue, minuteValue, periodValue) => {
    const value = buildTime24Hour(hourValue, minuteValue, periodValue);
    if (!value) {
      return "";
    }

    const [hours, minutes] = value.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const buildCalendarLink = (dateValue, timeValue) => {
    if (!dateValue || !timeValue) {
      return "#";
    }

    const startDate = new Date(`${dateValue}T${timeValue}:00`);
    if (Number.isNaN(startDate.getTime())) {
      return "#";
    }

    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const toCalendarStamp = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: "Grand Opening",
      dates: `${toCalendarStamp(startDate)}/${toCalendarStamp(endDate)}`,
      details: "H2 House of Health Grand Opening",
      location: "Jubilee Hills",
      ctz: "Asia/Kolkata"
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const syncRsvpDays = () => {
    if (!rsvpDay || !rsvpMonth || !rsvpYear) {
      return;
    }

    const currentValue = rsvpDay.value;
    const month = Number(rsvpMonth.value);
    const year = Number(rsvpYear.value);
    let firstDay = 1;
    let lastDay = month && year ? new Date(year, month, 0).getDate() : 31;

    if (year === 2026 && month === 4) {
      firstDay = 22;
    }

    if (year === 2026 && month === 5) {
      lastDay = 15;
    }

    rsvpDay.innerHTML = '<option value="" disabled selected>Date</option>';
    for (let day = firstDay; day <= lastDay; day += 1) {
      const option = document.createElement("option");
      option.value = String(day).padStart(2, "0");
      option.textContent = String(day);
      rsvpDay.append(option);
    }

    if (currentValue && Number(currentValue) >= firstDay && Number(currentValue) <= lastDay) {
      rsvpDay.value = currentValue.padStart(2, "0");
    }
  };

  const syncRsvpPeriods = () => {
    if (!rsvpHour || !rsvpPeriod) {
      return;
    }

    const currentValue = rsvpPeriod.value;
    const hour = Number(rsvpHour.value);
    const allowedPeriods = !hour ? ["AM", "PM"] : hour === 11 ? ["AM"] : ["PM"];

    rsvpPeriod.innerHTML = '<option value="" disabled selected>AM/PM</option>';
    allowedPeriods.forEach((period) => {
      const option = document.createElement("option");
      option.value = period;
      option.textContent = period;
      rsvpPeriod.append(option);
    });

    if (allowedPeriods.includes(currentValue)) {
      rsvpPeriod.value = currentValue;
    }
  };

  const syncRsvpMinutes = () => {
    if (!rsvpHour || !rsvpMinute || !rsvpPeriod) {
      return;
    }

    const currentValue = rsvpMinute.value;
    const hour = Number(rsvpHour.value);
    const period = rsvpPeriod.value;
    const minuteOptions = hour === 7
      ? ["00"]
      : ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

    rsvpMinute.innerHTML = '<option value="" disabled selected>Min</option>';
    minuteOptions.forEach((minute) => {
      const option = document.createElement("option");
      option.value = minute;
      option.textContent = minute;
      rsvpMinute.append(option);
    });

    if (minuteOptions.includes(currentValue)) {
      rsvpMinute.value = currentValue;
    }
  };

  const quotes = [
    { text: "you are the chosen one!", className: "from-center quill-feather", duration: 7200 },
    {
      text: "In a world obsessed with disease,\na few choose prevention.",
      className: "from-top-left windsong typewriter",
      duration: 6400,
      voiceSrc: "/voicesai-dumbledore-1.mp3",
      typeSpeedMultiplier: 0.7,
      gapAfterMs: 660
    },
    {
      text: "In a system built for speed,\na few demand precision.",
      className: "from-bottom-right windsong typewriter",
      duration: 5900,
      voiceSrc: "/voicesai-dumbledore-2.mp3",
      typeSpeedMultiplier: 0.7,
      gapAfterMs: 20
    },
    {
      text: "In an era of reactive medicine...",
      className: "from-bottom windsong typewriter",
      duration: 4700,
      voiceSrc: "/voicesai-dumbledore-3.mp3",
      gapAfterMs: 10
    },
    {
      text: "A new circle is forming",
      className: "from-top windsong typewriter",
      duration: 4700,
      voiceSrc: "/voicesai-dumbledore-4.mp3"
    },
    {
      text: "Welcome to the\nFuture of Health",
      className: "from-center glow windsong typewriter",
      duration: 5200,
      voiceSrc: "/voicesai-dumbledore-5.mp3"
    }
  ];

  let narrativeStarted = false;
  let gateUnlocked = false;
  let quoteParticlesSeeded = false;
  let finalParticlesSeeded = false;
  let lightDotsSeeded = false;
  let hasActivatedMusic = false;
  let hasUnlockedQuoteVoices = false;
  let isNarrativeSequenceRunning = false;
  let musicFadeFrame = null;
  let musicFadeTimer = null;
  let musicFadeToken = 0;
  const quoteVoicePlayer = new Audio();
  let quoteVoiceLoadedSrc = "";
  const IOS_AUDIO_UNLOCK_SRC = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAABCxAgAEABAAZGF0YQAAAAA=";

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const randomBetween = (min, max) => Math.random() * (max - min) + min;
  const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  const isSlowNetwork =
    Boolean(connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || "")));
  const isLowPowerDevice =
    Number(navigator.deviceMemory || 0) > 0 && Number(navigator.deviceMemory) <= 4;

  const lockZoomInteractions = () => {
    if (!isTouchDevice) {
      return;
    }

    // Prevent Safari gesture zoom and desktop-style ctrl+wheel zoom on touch devices.
    ["gesturestart", "gesturechange", "gestureend"].forEach((eventName) => {
      document.addEventListener(eventName, (event) => {
        event.preventDefault();
      }, { passive: false });
    });

    let lastTouchEnd = 0;
    document.addEventListener("touchend", (event) => {
      const now = Date.now();
      if (now - lastTouchEnd < 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });

    window.addEventListener("wheel", (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    }, { passive: false });
  };

  const PARTICLE_COUNTS = (() => {
    if (prefersReducedMotion) {
      return { light: 36, quote: 18, final: 20 };
    }

    if (isSlowNetwork) {
      return { light: 44, quote: 24, final: 30 };
    }

    if (isMobileViewport || isLowPowerDevice) {
      return { light: 72, quote: 40, final: 46 };
    }

    return { light: 140, quote: 72, final: 78 };
  })();

  lockZoomInteractions();

  /* ── Asset preloader ─────────────────────────────────────────────
     Fetch every image and audio file into the browser cache so
     nothing stalls mid-experience on slow mobile connections.     */
  const preloadAssets = () => {
    const images = [
      "/seal.png",
      "/seal-broken.png",
      "/quill_transparent2.png",
      "/h2-bg-removed.png",
      "/h2-black-logo-removebg-preview.png",
      "/end-scroll-card-removebg-preview2.png",
      "/castle.png",
      "/logo-h2.svg"
    ];

    const audioFiles = [
      "/Hedwigs_HP_music.mp3",
      "/voicesai-dumbledore-1.mp3",
      "/voicesai-dumbledore-2.mp3",
      "/voicesai-dumbledore-3.mp3",
      "/voicesai-dumbledore-4.mp3",
      "/voicesai-dumbledore-5.mp3"
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    audioFiles.forEach((src) => {
      try {
        const req = new XMLHttpRequest();
        req.open("GET", src, true);
        req.responseType = "blob";
        req.send();
      } catch (_) { /* silent — best effort */ }
    });
  };

  preloadAssets();

  const tryStartMusic = () => {
    if (!bgMusic) {
      return;
    }

    musicFadeToken += 1;
    if (musicFadeFrame) {
      window.cancelAnimationFrame(musicFadeFrame);
      musicFadeFrame = null;
    }
    if (musicFadeTimer) {
      window.clearInterval(musicFadeTimer);
      musicFadeTimer = null;
    }

    bgMusic.volume = 0.55;
    bgMusic.loop = true;

    const playPromise = bgMusic.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const stopMusic = (fadeDurationMs = 900) => {
    if (!bgMusic) {
      return Promise.resolve();
    }

    musicFadeToken += 1;
    const currentToken = musicFadeToken;
    if (musicFadeFrame) {
      window.cancelAnimationFrame(musicFadeFrame);
      musicFadeFrame = null;
    }
    if (musicFadeTimer) {
      window.clearInterval(musicFadeTimer);
      musicFadeTimer = null;
    }

    const startVolume = Math.max(0, Math.min(1, bgMusic.volume));
    if (startVolume <= 0.01) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      bgMusic.volume = 0.55;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const fadeStart = performance.now();
      const stepMs = 40;

      musicFadeTimer = window.setInterval(() => {
        if (currentToken !== musicFadeToken || !bgMusic) {
          window.clearInterval(musicFadeTimer);
          musicFadeTimer = null;
          resolve();
          return;
        }

        const elapsed = performance.now() - fadeStart;
        const progress = Math.min(1, elapsed / fadeDurationMs);
        bgMusic.volume = startVolume * (1 - progress);

        if (progress < 1) {
          return;
        }

        window.clearInterval(musicFadeTimer);
        musicFadeTimer = null;
        bgMusic.pause();
        bgMusic.currentTime = 0;
        bgMusic.volume = 0.55;
        resolve();
      }, stepMs);
    });
  };

  quoteVoicePlayer.preload = "metadata";
  quoteVoicePlayer.playsInline = true;
  quoteVoicePlayer.setAttribute("playsinline", "");
  quoteVoicePlayer.setAttribute("webkit-playsinline", "");
  quoteVoicePlayer.volume = 1;

  const prepareQuoteVoiceSource = (src) => {
    if (!src) {
      return false;
    }

    if (quoteVoiceLoadedSrc !== src) {
      quoteVoicePlayer.src = src;
      quoteVoiceLoadedSrc = src;
      quoteVoicePlayer.load();
    }

    return true;
  };

  const unlockQuoteVoices = () => {
    if (hasUnlockedQuoteVoices) {
      return;
    }

    hasUnlockedQuoteVoices = true;
    quoteVoicePlayer.src = IOS_AUDIO_UNLOCK_SRC;
    quoteVoiceLoadedSrc = "";
    quoteVoicePlayer.currentTime = 0;
    quoteVoicePlayer.volume = 0;
    const playPromise = quoteVoicePlayer.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => {
          quoteVoicePlayer.pause();
          quoteVoicePlayer.currentTime = 0;
          quoteVoicePlayer.removeAttribute("src");
          quoteVoicePlayer.load();
          quoteVoicePlayer.volume = 1;
        })
        .catch(() => {
          quoteVoicePlayer.removeAttribute("src");
          quoteVoicePlayer.load();
          quoteVoicePlayer.volume = 1;
        });
    } else {
      quoteVoicePlayer.removeAttribute("src");
      quoteVoicePlayer.load();
      quoteVoicePlayer.volume = 1;
    }
  };

  const startQuoteVoiceForQuote = ({ voiceSrc }) => {
    if (!prepareQuoteVoiceSource(voiceSrc)) {
      return;
    }

    quoteVoicePlayer.pause();
    quoteVoicePlayer.currentTime = 0;
    const playPromise = quoteVoicePlayer.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const stopQuoteVoice = () => {
    quoteVoicePlayer.pause();
    quoteVoicePlayer.currentTime = 0;
  };

  const stopActiveQuoteVoice = () => {
    stopQuoteVoice();
  };

  const activateMusic = () => {
    if (hasActivatedMusic) {
      return;
    }

    hasActivatedMusic = true;
    tryStartMusic();
    unlockQuoteVoices();
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
      { x: 0.52, y: 0.32 },
      { x: 0.36, y: 0.34 },
      { x: 0.22, y: 0.44 },
      { x: 0.18, y: 0.58 },
      { x: 0.22, y: 0.72 },
      { x: 0.36, y: 0.80 },
      { x: 0.54, y: 0.80 },
      { x: 0.68, y: 0.72 },
      { x: 0.72, y: 0.58 },
      { x: 0.68, y: 0.44 },
      { x: 0.54, y: 0.36 },
      { x: 0.72, y: 0.42 },
      { x: 0.76, y: 0.58 },
      { x: 0.76, y: 0.78 },
      { x: 0.80, y: 0.88 }
    ],
    b: [
      { x: 0.22, y: 0.18 },
      { x: 0.22, y: 0.36 },
      { x: 0.22, y: 0.56 },
      { x: 0.22, y: 0.76 },
      { x: 0.22, y: 0.88 },
      { x: 0.36, y: 0.82 },
      { x: 0.54, y: 0.76 },
      { x: 0.68, y: 0.66 },
      { x: 0.72, y: 0.56 },
      { x: 0.64, y: 0.46 },
      { x: 0.48, y: 0.42 },
      { x: 0.28, y: 0.46 }
    ],
    c: [
      { x: 0.76, y: 0.38 },
      { x: 0.64, y: 0.30 },
      { x: 0.48, y: 0.28 },
      { x: 0.34, y: 0.34 },
      { x: 0.22, y: 0.46 },
      { x: 0.20, y: 0.58 },
      { x: 0.24, y: 0.72 },
      { x: 0.36, y: 0.80 },
      { x: 0.52, y: 0.82 },
      { x: 0.68, y: 0.78 },
      { x: 0.78, y: 0.72 }
    ],
    d: [
      { x: 0.74, y: 0.18 },
      { x: 0.74, y: 0.36 },
      { x: 0.74, y: 0.56 },
      { x: 0.74, y: 0.76 },
      { x: 0.74, y: 0.88 },
      { x: 0.60, y: 0.82 },
      { x: 0.44, y: 0.78 },
      { x: 0.30, y: 0.68 },
      { x: 0.24, y: 0.56 },
      { x: 0.28, y: 0.42 },
      { x: 0.40, y: 0.34 },
      { x: 0.56, y: 0.32 },
      { x: 0.72, y: 0.38 }
    ],
    e: [
      { x: 0.22, y: 0.56 },
      { x: 0.36, y: 0.52 },
      { x: 0.54, y: 0.48 },
      { x: 0.72, y: 0.48 },
      { x: 0.76, y: 0.42 },
      { x: 0.68, y: 0.34 },
      { x: 0.50, y: 0.30 },
      { x: 0.34, y: 0.36 },
      { x: 0.22, y: 0.48 },
      { x: 0.20, y: 0.62 },
      { x: 0.26, y: 0.74 },
      { x: 0.40, y: 0.82 },
      { x: 0.58, y: 0.82 },
      { x: 0.74, y: 0.76 }
    ],
    f: [
      { x: 0.68, y: 0.22 },
      { x: 0.56, y: 0.18 },
      { x: 0.44, y: 0.24 },
      { x: 0.40, y: 0.38 },
      { x: 0.40, y: 0.56 },
      { x: 0.40, y: 0.76 },
      { x: 0.40, y: 0.88 },
      { x: 0.26, y: 0.44 },
      { x: 0.40, y: 0.44 },
      { x: 0.58, y: 0.44 }
    ],
    g: [
      { x: 0.72, y: 0.38 },
      { x: 0.58, y: 0.30 },
      { x: 0.42, y: 0.30 },
      { x: 0.28, y: 0.40 },
      { x: 0.24, y: 0.54 },
      { x: 0.30, y: 0.68 },
      { x: 0.46, y: 0.76 },
      { x: 0.62, y: 0.74 },
      { x: 0.74, y: 0.64 },
      { x: 0.76, y: 0.42 },
      { x: 0.76, y: 0.62 },
      { x: 0.76, y: 0.82 },
      { x: 0.72, y: 0.96 },
      { x: 0.58, y: 1.04 },
      { x: 0.40, y: 1.02 }
    ],
    h: [
      { x: 0.22, y: 0.18 },
      { x: 0.22, y: 0.36 },
      { x: 0.22, y: 0.56 },
      { x: 0.22, y: 0.76 },
      { x: 0.22, y: 0.88 },
      { x: 0.28, y: 0.56 },
      { x: 0.40, y: 0.44 },
      { x: 0.54, y: 0.40 },
      { x: 0.66, y: 0.46 },
      { x: 0.74, y: 0.58 },
      { x: 0.76, y: 0.72 },
      { x: 0.76, y: 0.88 }
    ],
    i: [
      { x: 0.48, y: 0.24 },
      { x: 0.48, y: 0.28 },
      { x: 0.48, y: 0.42 },
      { x: 0.48, y: 0.56 },
      { x: 0.48, y: 0.72 },
      { x: 0.48, y: 0.88 }
    ],
    j: [
      { x: 0.56, y: 0.24 },
      { x: 0.56, y: 0.28 },
      { x: 0.56, y: 0.44 },
      { x: 0.56, y: 0.62 },
      { x: 0.56, y: 0.78 },
      { x: 0.52, y: 0.92 },
      { x: 0.42, y: 1.00 },
      { x: 0.30, y: 0.96 }
    ],
    k: [
      { x: 0.24, y: 0.18 },
      { x: 0.24, y: 0.36 },
      { x: 0.24, y: 0.56 },
      { x: 0.24, y: 0.76 },
      { x: 0.24, y: 0.88 },
      { x: 0.60, y: 0.32 },
      { x: 0.46, y: 0.46 },
      { x: 0.32, y: 0.56 },
      { x: 0.46, y: 0.68 },
      { x: 0.64, y: 0.82 },
      { x: 0.76, y: 0.88 }
    ],
    l: [
      { x: 0.40, y: 0.18 },
      { x: 0.40, y: 0.36 },
      { x: 0.40, y: 0.56 },
      { x: 0.40, y: 0.76 },
      { x: 0.40, y: 0.88 },
      { x: 0.54, y: 0.88 }
    ],
    m: [
      { x: 0.12, y: 0.88 },
      { x: 0.12, y: 0.68 },
      { x: 0.12, y: 0.48 },
      { x: 0.18, y: 0.38 },
      { x: 0.28, y: 0.44 },
      { x: 0.36, y: 0.56 },
      { x: 0.42, y: 0.68 },
      { x: 0.48, y: 0.56 },
      { x: 0.56, y: 0.44 },
      { x: 0.66, y: 0.38 },
      { x: 0.74, y: 0.44 },
      { x: 0.80, y: 0.58 },
      { x: 0.84, y: 0.74 },
      { x: 0.86, y: 0.88 }
    ],
    n: [
      { x: 0.22, y: 0.88 },
      { x: 0.22, y: 0.68 },
      { x: 0.22, y: 0.48 },
      { x: 0.28, y: 0.38 },
      { x: 0.42, y: 0.36 },
      { x: 0.56, y: 0.42 },
      { x: 0.66, y: 0.54 },
      { x: 0.74, y: 0.68 },
      { x: 0.76, y: 0.88 }
    ],
    o: [
      { x: 0.50, y: 0.30 },
      { x: 0.36, y: 0.32 },
      { x: 0.24, y: 0.42 },
      { x: 0.20, y: 0.56 },
      { x: 0.22, y: 0.70 },
      { x: 0.34, y: 0.80 },
      { x: 0.50, y: 0.84 },
      { x: 0.66, y: 0.80 },
      { x: 0.78, y: 0.70 },
      { x: 0.80, y: 0.56 },
      { x: 0.76, y: 0.42 },
      { x: 0.64, y: 0.32 },
      { x: 0.50, y: 0.30 }
    ],
    p: [
      { x: 0.24, y: 0.38 },
      { x: 0.24, y: 0.56 },
      { x: 0.24, y: 0.76 },
      { x: 0.24, y: 0.92 },
      { x: 0.24, y: 1.06 },
      { x: 0.30, y: 0.42 },
      { x: 0.46, y: 0.34 },
      { x: 0.62, y: 0.36 },
      { x: 0.72, y: 0.46 },
      { x: 0.74, y: 0.58 },
      { x: 0.66, y: 0.70 },
      { x: 0.50, y: 0.76 },
      { x: 0.32, y: 0.74 }
    ],
    q: [
      { x: 0.68, y: 0.38 },
      { x: 0.54, y: 0.30 },
      { x: 0.38, y: 0.32 },
      { x: 0.26, y: 0.44 },
      { x: 0.22, y: 0.58 },
      { x: 0.28, y: 0.72 },
      { x: 0.44, y: 0.80 },
      { x: 0.60, y: 0.76 },
      { x: 0.72, y: 0.64 },
      { x: 0.74, y: 0.48 },
      { x: 0.74, y: 0.68 },
      { x: 0.74, y: 0.88 },
      { x: 0.74, y: 1.04 }
    ],
    r: [
      { x: 0.24, y: 0.88 },
      { x: 0.24, y: 0.72 },
      { x: 0.24, y: 0.56 },
      { x: 0.24, y: 0.42 },
      { x: 0.32, y: 0.38 },
      { x: 0.44, y: 0.34 },
      { x: 0.58, y: 0.32 },
      { x: 0.70, y: 0.36 },
      { x: 0.78, y: 0.42 }
    ],
    s: [
      { x: 0.72, y: 0.34 },
      { x: 0.58, y: 0.28 },
      { x: 0.42, y: 0.28 },
      { x: 0.28, y: 0.34 },
      { x: 0.24, y: 0.44 },
      { x: 0.32, y: 0.52 },
      { x: 0.48, y: 0.56 },
      { x: 0.64, y: 0.62 },
      { x: 0.74, y: 0.72 },
      { x: 0.68, y: 0.82 },
      { x: 0.52, y: 0.86 },
      { x: 0.36, y: 0.84 },
      { x: 0.24, y: 0.78 }
    ],
    t: [
      { x: 0.46, y: 0.18 },
      { x: 0.46, y: 0.36 },
      { x: 0.46, y: 0.56 },
      { x: 0.46, y: 0.72 },
      { x: 0.48, y: 0.84 },
      { x: 0.56, y: 0.88 },
      { x: 0.28, y: 0.40 },
      { x: 0.40, y: 0.40 },
      { x: 0.56, y: 0.40 },
      { x: 0.68, y: 0.40 }
    ],
    u: [
      { x: 0.22, y: 0.38 },
      { x: 0.22, y: 0.52 },
      { x: 0.24, y: 0.66 },
      { x: 0.30, y: 0.76 },
      { x: 0.42, y: 0.82 },
      { x: 0.56, y: 0.82 },
      { x: 0.68, y: 0.76 },
      { x: 0.74, y: 0.66 },
      { x: 0.76, y: 0.52 },
      { x: 0.76, y: 0.38 }
    ],
    v: [
      { x: 0.18, y: 0.36 },
      { x: 0.26, y: 0.52 },
      { x: 0.36, y: 0.68 },
      { x: 0.48, y: 0.84 },
      { x: 0.60, y: 0.68 },
      { x: 0.72, y: 0.52 },
      { x: 0.80, y: 0.36 }
    ],
    w: [
      { x: 0.10, y: 0.36 },
      { x: 0.18, y: 0.56 },
      { x: 0.26, y: 0.76 },
      { x: 0.34, y: 0.88 },
      { x: 0.42, y: 0.72 },
      { x: 0.48, y: 0.56 },
      { x: 0.54, y: 0.72 },
      { x: 0.62, y: 0.88 },
      { x: 0.70, y: 0.76 },
      { x: 0.78, y: 0.56 },
      { x: 0.86, y: 0.36 }
    ],
    x: [
      { x: 0.20, y: 0.34 },
      { x: 0.34, y: 0.48 },
      { x: 0.48, y: 0.58 },
      { x: 0.64, y: 0.72 },
      { x: 0.78, y: 0.86 },
      { x: 0.78, y: 0.34 },
      { x: 0.64, y: 0.48 },
      { x: 0.48, y: 0.58 },
      { x: 0.34, y: 0.72 },
      { x: 0.20, y: 0.86 }
    ],
    y: [
      { x: 0.18, y: 0.36 },
      { x: 0.28, y: 0.48 },
      { x: 0.38, y: 0.60 },
      { x: 0.48, y: 0.72 },
      { x: 0.58, y: 0.60 },
      { x: 0.68, y: 0.48 },
      { x: 0.78, y: 0.36 },
      { x: 0.52, y: 0.80 },
      { x: 0.48, y: 0.92 },
      { x: 0.42, y: 1.02 },
      { x: 0.34, y: 1.08 }
    ],
    z: [
      { x: 0.22, y: 0.36 },
      { x: 0.40, y: 0.36 },
      { x: 0.60, y: 0.36 },
      { x: 0.76, y: 0.36 },
      { x: 0.60, y: 0.52 },
      { x: 0.46, y: 0.66 },
      { x: 0.30, y: 0.80 },
      { x: 0.22, y: 0.86 },
      { x: 0.40, y: 0.86 },
      { x: 0.60, y: 0.86 },
      { x: 0.76, y: 0.86 }
    ],
    "!": [
      { x: 0.48, y: 0.20 },
      { x: 0.48, y: 0.36 },
      { x: 0.48, y: 0.52 },
      { x: 0.48, y: 0.68 },
      { x: 0.48, y: 0.88 },
      { x: 0.48, y: 0.92 }
    ]
  };

  const DEFAULT_QUILL_STROKE = [
    { x: 0.20, y: 0.68 },
    { x: 0.34, y: 0.52 },
    { x: 0.50, y: 0.44 },
    { x: 0.66, y: 0.52 },
    { x: 0.80, y: 0.68 }
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

    /* ── quill travels to the first stroke point of this letter ── */
    const travelMs = Math.min(120, Math.max(40, letterBudgetMs * 0.22));
    positionQuillTipAtStrokePoint(letterEl, stroke[0], sweepTilt);
    await wait(travelMs);

    const remainingBudget = Math.max(30, letterBudgetMs - travelMs);

    if (stroke.length > 1) {
      /* use 88% of remaining budget for tracing so the quill really follows each curve */
      const traceBudgetMs = Math.max(30, remainingBudget * 0.88);
      const segmentMs = Math.max(18, traceBudgetMs / (stroke.length - 1));

      for (let pointIndex = 1; pointIndex < stroke.length; pointIndex += 1) {
        const currentPoint = stroke[pointIndex];
        const previousPoint = stroke[pointIndex - 1];
        positionQuillTipAtStrokePoint(letterEl, currentPoint, sweepTilt, previousPoint);
        await wait(segmentMs);
      }

      letterEl.classList.add("revealed");
      await wait(Math.max(6, remainingBudget - traceBudgetMs));
      return;
    }

    /* single-point stroke */
    letterEl.classList.add("revealed");
    await wait(Math.max(8, remainingBudget));
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
    const writeDuration = Math.max(2400, Math.min(duration - 600, letterCount * 320));
    const stepMs = Math.max(160, writeDuration / letterCount);
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
    const lingerMs = 900;                       // keep the finished quote visible briefly
    await wait(lingerMs);

    /* fade the whole quote out smoothly, then hide the quill */
    quoteEl.style.transition = "opacity 500ms ease, transform 500ms ease";
    quoteEl.style.opacity = "0";
    quoteEl.style.transform = "translateY(-14px) scale(1.01)";
    await wait(520);
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

    /* Use rAF-driven loop so letters stay in sync with the display
       even when setTimeout drifts on slow mobile devices.          */
    await new Promise((resolve) => {
      let revealed = 0;
      const tick = () => {
        const elapsed = performance.now() - quoteStart;
        const target = Math.min(letterCount, Math.floor(elapsed / stepMs) + 1);
        while (revealed < target) {
          writingLetters[revealed].classList.add("revealed");
          revealed += 1;
        }
        if (revealed < letterCount) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });

    const elapsed = performance.now() - quoteStart;
    const remainingDuration = Math.max(0, duration - elapsed);
    await wait(remainingDuration);
  };

  const playQuote = async ({ text, className, duration, voiceSrc, typeSpeedMultiplier }) => {
    stopQuoteVoice();
    quoteEl.className = "cinematic-quote";
    quoteEl.textContent = "";
    void quoteEl.offsetWidth;

    startQuoteVoiceForQuote({ text, voiceSrc });
    hideQuillWriter();
    quoteEl.style.setProperty("--quote-play-ms", `${duration}ms`);

    if (className.includes("quill-feather")) {
      await playQuillQuote({ text, className, duration });
      stopActiveQuoteVoice();
      return;
    }

    if (className.includes("typewriter")) {
      await playTypewriterQuote({ text, className, duration, typeSpeedMultiplier });
      stopActiveQuoteVoice();
      return;
    }

    quoteEl.className = "cinematic-quote";
    quoteEl.textContent = text;
    quoteEl.classList.add(...className.split(" "));
    void quoteEl.offsetWidth;
    quoteEl.classList.add("play");
    await wait(duration);
    stopActiveQuoteVoice();
  };

  const revealIdentityPanel = async () => {
    quoteLayer.classList.add("hidden");
    identityPanel.classList.remove("hidden");
    identityPanel.classList.add("visible");
    await wait(300);
  };

  const playNarrativeSequence = async () => {
    if (isNarrativeSequenceRunning) {
      return;
    }

    isNarrativeSequenceRunning = true;
    const interQuoteGapMs = 360;

    seedQuoteParticles();
    if (quoteParticleField) {
      quoteParticleField.classList.remove("hidden");
      quoteParticleField.classList.add("active");
    }

    try {
      for (let index = 0; index < quotes.length; index += 1) {
        await playQuote(quotes[index]);
        if (index < quotes.length - 1) {
          await wait(quotes[index].gapAfterMs ?? interQuoteGapMs);
        }
      }

      await revealIdentityPanel();
    } finally {
      isNarrativeSequenceRunning = false;
    }
  };

  const activateKeySequence = async () => {
    if (gateUnlocked) {
      return;
    }

    gateUnlocked = true;
    lockButton.disabled = true;
    if (lockPanel) {
      lockPanel.classList.add("hidden");
    }
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

  const setRsvpPanelState = (isOpen) => {
    if (!rsvpPanel || !eventImageCard || !rsvpButton) {
      return;
    }

    rsvpPanel.classList.toggle("hidden", !isOpen);
    rsvpPanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
    rsvpButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    eventImageCard.classList.toggle("show-rsvp", isOpen);
    if (rsvpRow) {
      rsvpRow.classList.toggle("hidden", isOpen);
    }
  };

  if (rsvpButton && rsvpPanel && eventImageCard) {
    rsvpButton.addEventListener("click", async () => {
      await stopMusic(450);
      setRsvpPanelState(rsvpPanel.classList.contains("hidden"));
    });
  }

  if (rsvpClose) {
    rsvpClose.addEventListener("click", () => {
      setRsvpPanelState(false);
    });
  }

  const syncRsvpGuestsField = () => {
    if (!rsvpAttend || !rsvpGuestsField || !rsvpGuests || !rsvpDateField || !rsvpDay || !rsvpMonth || !rsvpYear || !rsvpTimeField || !rsvpHour || !rsvpMinute || !rsvpPeriod) {
      return;
    }

    const isAttending = rsvpAttend.value.toLowerCase() === "yes";
    rsvpGuestsField.classList.toggle("hidden", !isAttending);
    rsvpDateField.classList.toggle("hidden", !isAttending);
    rsvpTimeField.classList.toggle("hidden", !isAttending);
    rsvpGuests.required = isAttending;
    rsvpDay.required = isAttending;
    rsvpMonth.required = isAttending;
    rsvpYear.required = isAttending;
    rsvpHour.required = isAttending;
    rsvpMinute.required = isAttending;
    rsvpPeriod.required = isAttending;

    if (!isAttending) {
      rsvpGuests.value = "";
      rsvpDay.value = "";
      rsvpMonth.value = "";
      rsvpYear.value = "";
      rsvpHour.value = "";
      rsvpMinute.value = "";
      rsvpPeriod.value = "";
      syncRsvpPeriods();
      syncRsvpMinutes();
    }
  };

  if (rsvpAttend) {
    rsvpAttend.addEventListener("change", syncRsvpGuestsField);
    syncRsvpGuestsField();
  }

  if (rsvpMonth) {
    rsvpMonth.addEventListener("change", syncRsvpDays);
  }

  if (rsvpYear) {
    rsvpYear.addEventListener("change", syncRsvpDays);
  }

  syncRsvpDays();

  if (rsvpHour) {
    rsvpHour.addEventListener("change", () => {
      syncRsvpPeriods();
      syncRsvpMinutes();
    });
  }

  if (rsvpPeriod) {
    rsvpPeriod.addEventListener("change", syncRsvpMinutes);
  }

  syncRsvpPeriods();
  syncRsvpMinutes();

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", async (event) => {
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
        submitButton.textContent = "Opening WhatsApp...";
      }

      const isAttending = rsvpAttend.value.toLowerCase() === "yes";
      const guestCount = isAttending ? rsvpGuests?.value?.trim() || "1" : "0";
      const selectedDate = isAttending ? formatRsvpDate(rsvpDay?.value, rsvpMonth?.value, rsvpYear?.value) : "";
      const selectedDateValue = isAttending ? buildDateValue(rsvpDay?.value, rsvpMonth?.value, rsvpYear?.value) : "";
      const selectedTime = isAttending ? formatRsvpTime(rsvpHour?.value, rsvpMinute?.value, rsvpPeriod?.value) : "";
      const selectedTime24 = isAttending ? buildTime24Hour(rsvpHour?.value, rsvpMinute?.value, rsvpPeriod?.value) : "";

      const parsedGuestCount = Number.parseInt(guestCount, 10);
      const hasMultipleGuests = Number.isFinite(parsedGuestCount) && parsedGuestCount > 1;
      const attendingLine = hasMultipleGuests
        ? "Yes! We're honored to be the chosen ones and excited to grace the occasion with our presence."
        : "Yes! I'm honored to be the chosen one and excited to grace the occasion with my presence.";

      const messageLines = isAttending
        ? [
            "Hello H2 House of Health Team,",
            "",
            attendingLine,
            "",
            `Name: ${rsvpName.value.trim()}`,
            `Number of Guests: ${guestCount}`,
            `Date: ${selectedDate}`,
            `Time: ${selectedTime}`
          ]
        : [
            "Hello H2 House of Health Team,",
            "",
            "With sincere regrets, I am unable to attend the Grand Opening.",
            `Name: ${rsvpName.value.trim()}`,
            "Attending: No",
            `Event Slot: ${eventSlot.date} at ${eventSlot.time}`,
            "",
            "Sending warm wishes for a wonderful celebration and continued success."
          ];

      const url = `https://wa.me/${rsvpWhatsAppNumber}?text=${encodeURIComponent(messageLines.join("\n"))}`;
      await stopMusic(1100);
      const opened = window.open(url, "_blank");
      if (!opened) {
        window.location.href = url;
      }

      rsvpForm.classList.add("hidden");
      if (rsvpSuccess) {
        rsvpSuccess.classList.remove("hidden");
      }
      if (rsvpSuccessTitle) {
        rsvpSuccessTitle.textContent = isAttending ? "H2 Experience Summoned ✅" : "Response Noted ✅";
      }
      if (rsvpSuccessCopy) {
        rsvpSuccessCopy.textContent = isAttending
          ? "Your WhatsApp experience message is ready. Please review and tap send."
          : "Your WhatsApp response is ready. Please review and tap send.";
      }
      if (rsvpAddCalendar) {
        rsvpAddCalendar.classList.toggle("hidden", !isAttending);
        if (isAttending) {
          rsvpAddCalendar.href = buildCalendarLink(selectedDateValue, selectedTime24);
        }
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Summon My Experience";
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
    }, 900);
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
      letter.inert = true;
      runSuccessJourney();
      return;
    }

    hintWords.classList.remove("hidden");
    hintWords.classList.remove("spill");
    hintWords.classList.add("armed");
    result.textContent = "Tap on Hints";
    result.style.color = "#b42318";
  });
});
