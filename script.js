window.addEventListener("load", () => {
  const body = document.body;
  const scene = document.querySelector(".scene");
  const wrapper = document.querySelector(".wrapper");
  const tapOpen = document.querySelector("#tap-open");
  const form = document.querySelector("#answer-form");
  const answerInput = document.querySelector("#riddle-answer");
  const result = document.querySelector("#result");
  const hintWords = document.querySelector("#hint-words");
  const hintBottle = document.querySelector("#hint-bottle");
  const hintPills = document.querySelectorAll(".hint-pill");
  const endScreen = document.querySelector("#end-screen");
  const narrativeBlocks = document.querySelectorAll(".narrative-block");
  const quoteMinMs = 4000;
  let narrativeStarted = false;

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

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
    openEnvelope();
  });

  scene.addEventListener("click", () => {
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
    spillHints();
  });

  hintBottle.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    spillHints();
  });

  hintPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      answerInput.value = pill.textContent.trim();
      form.requestSubmit();
    });
  });

  const playNarrativeSequence = () => {
    if (!narrativeBlocks.length) {
      body.classList.add("reveal-active");
      return;
    }

    const run = async () => {
      for (const block of narrativeBlocks) {
        block.classList.remove("play");
        void block.offsetWidth;
        block.classList.add("play");

        await wait(quoteMinMs);
      }

      body.classList.add("reveal-active");
    };

    run();
  };

  const runSuccessJourney = () => {
    if (narrativeStarted) {
      return;
    }

    narrativeStarted = true;

    window.setTimeout(() => {
      endScreen.setAttribute("aria-hidden", "false");
      body.classList.add("end-active");
    }, 900);

    window.setTimeout(() => {
      body.classList.add("narrative-active");
      playNarrativeSequence();
    }, 2500);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = answerInput.value.trim().toLowerCase();

    if (answer === "health") {
      result.textContent = "Correct. Welcome in.";
      result.style.color = "#1f7a3d";
      hintWords.classList.remove("armed");
      hintWords.classList.remove("spill");
      hintWords.classList.add("hidden");
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
