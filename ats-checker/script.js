/* =========================================================
   niDar Tools — AI ATS Resume Checker
   Client-side UI + /api/analyze integration
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const resumeText =
    document.getElementById("resumeText");

  const jobDesc =
    document.getElementById("jobDesc");

  const userConsent =
    document.getElementById("userConsent");

  const analyzeBtn =
    document.getElementById("analyzeBtn");

  const reanalyzeBtn =
    document.getElementById("reanalyzeBtn");

  const resultBox =
    document.getElementById("resultBox");

  const analysisStatus =
    document.getElementById("analysisStatus");

  const resumeCounter =
    document.getElementById("resumeCounter");

  const jobCounter =
    document.getElementById("jobCounter");

  const scoreValue =
    document.getElementById("scoreValue");

  const scoreProgress =
    document.getElementById("scoreProgress");

  const scoreMessage =
    document.getElementById("scoreMessage");

  const missingKeywordsList =
    document.getElementById("missingKeywordsList");

  const matchingKeywordsList =
    document.getElementById("matchingKeywordsList");

  const formattingFeedbackList =
    document.getElementById("formattingFeedbackList");

  const suggestionsList =
    document.getElementById("suggestionsList");

  const missingCount =
    document.getElementById("missingCount");

  const matchingCount =
    document.getElementById("matchingCount");

  const missingEmpty =
    document.getElementById("missingEmpty");

  const matchingEmpty =
    document.getElementById("matchingEmpty");

  const formattingEmpty =
    document.getElementById("formattingEmpty");

  const suggestionsEmpty =
    document.getElementById("suggestionsEmpty");


  /* =======================================================
     STATE
     ======================================================= */

  let lastAnalysis = null;
  let isAnalyzing = false;


  /* =======================================================
     CHARACTER COUNTERS
     ======================================================= */

  function updateCounters() {

    const resumeLength =
      resumeText.value.length;

    const jobLength =
      jobDesc.value.length;

    resumeCounter.textContent =
      `${resumeLength.toLocaleString()} ${
        resumeLength === 1
          ? "character"
          : "characters"
      }`;

    jobCounter.textContent =
      `${jobLength.toLocaleString()} ${
        jobLength === 1
          ? "character"
          : "characters"
      }`;
  }


  /* =======================================================
     BUTTON STATE
     ======================================================= */

  function updateAnalyzeButton() {

    const hasResume =
      resumeText.value.trim().length > 0;

    const hasJob =
      jobDesc.value.trim().length > 0;

    const consentGiven =
      userConsent.checked;

    analyzeBtn.disabled =
      !hasResume ||
      !hasJob ||
      !consentGiven ||
      isAnalyzing;
  }


  /* =======================================================
     STATUS
     ======================================================= */

  function setStatus(message, type) {

    analysisStatus.textContent =
      message || "";

    analysisStatus.dataset.status =
      type || "";
  }


  /* =======================================================
     LIST RENDERER
     ======================================================= */

  function renderList(
    element,
    emptyElement,
    items
  ) {

    element.innerHTML = "";

    const safeItems =
      Array.isArray(items)
        ? items
        : [];

    safeItems.forEach(item => {

      if (
        item === null ||
        item === undefined
      ) {
        return;
      }

      const text =
        String(item).trim();

      if (!text) {
        return;
      }

      const li =
        document.createElement("li");

      li.textContent = text;

      element.appendChild(li);
    });

    const hasItems =
      element.children.length > 0;

    emptyElement.style.display =
      hasItems ? "none" : "block";

    return element.children.length;
  }


  /* =======================================================
     SCORE MESSAGE
     ======================================================= */

  function getScoreMessage(score) {

    if (score >= 85) {
      return "Excellent match. Your resume aligns strongly with this job description.";
    }

    if (score >= 70) {
      return "Good match. A few targeted improvements could make your resume stronger.";
    }

    if (score >= 50) {
      return "Moderate match. Review the missing keywords and recommendations carefully.";
    }

    if (score >= 30) {
      return "Low match. Consider tailoring your resume more closely to the target role.";
    }

    return "Very low match. Review the job requirements and improve your resume alignment.";
  }


  /* =======================================================
     SCORE COLOR STATE
     ======================================================= */

  function updateScoreState(score) {

    const safeScore =
      Math.max(
        0,
        Math.min(
          100,
          Number(score) || 0
        )
      );

    scoreValue.textContent =
      Math.round(safeScore);

    scoreProgress.style.width =
      `${safeScore}%`;

    scoreMessage.textContent =
      getScoreMessage(safeScore);

    scoreProgress.dataset.score =
      safeScore >= 85
        ? "excellent"
        : safeScore >= 70
          ? "good"
          : safeScore >= 50
            ? "moderate"
            : "low";
  }


  /* =======================================================
     DISPLAY RESULTS
     ======================================================= */

  function displayResults(data) {

    const score =
      Number(data.atsScore);

    updateScoreState(
      Number.isFinite(score)
        ? score
        : 0
    );

    const missing =
      Array.isArray(data.missingKeywords)
        ? data.missingKeywords
        : [];

    const matching =
      Array.isArray(data.matchingKeywords)
        ? data.matchingKeywords
        : [];

    const formatting =
      Array.isArray(data.formattingFeedback)
        ? data.formattingFeedback
        : [];

    const suggestions =
      Array.isArray(data.actionableSuggestions)
        ? data.actionableSuggestions
        : [];


    const missingTotal =
      renderList(
        missingKeywordsList,
        missingEmpty,
        missing
      );

    const matchingTotal =
      renderList(
        matchingKeywordsList,
        matchingEmpty,
        matching
      );

    renderList(
      formattingFeedbackList,
      formattingEmpty,
      formatting
    );

    renderList(
      suggestionsList,
      suggestionsEmpty,
      suggestions
    );


    missingCount.textContent =
      `${missingTotal} ${
        missingTotal === 1
          ? "item"
          : "items"
      }`;

    matchingCount.textContent =
      `${matchingTotal} ${
        matchingTotal === 1
          ? "item"
          : "items"
      }`;


    lastAnalysis = data;

    resultBox.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  /* =======================================================
     API RESPONSE PARSER
     ======================================================= */

  async function readResponse(response) {

    const rawText =
      await response.text();

    if (!rawText) {

      throw new Error(
        "The server returned an empty response."
      );
    }

    let data;

    try {

      data =
        JSON.parse(rawText);

    } catch (error) {

      console.error(
        "ATS server response:",
        rawText
      );

      throw new Error(
        "Server Response Error: " +
        rawText.substring(0, 160)
      );
    }

    if (!response.ok) {

      throw new Error(
        data.error ||
        data.message ||
        "Failed to analyze resume."
      );
    }

    return data;
  }


  /* =======================================================
     ANALYZE RESUME
     ======================================================= */

  async function analyzeResume() {

    if (isAnalyzing) {
      return;
    }

    const resume =
      resumeText.value.trim();

    const jobDescription =
      jobDesc.value.trim();


    if (!resume) {

      setStatus(
        "Please paste your resume text.",
        "error"
      );

      resumeText.focus();

      return;
    }


    if (!jobDescription) {

      setStatus(
        "Please paste the job description.",
        "error"
      );

      jobDesc.focus();

      return;
    }


    if (!userConsent.checked) {

      setStatus(
        "Please accept the Terms & Conditions and Privacy Policy.",
        "error"
      );

      return;
    }


    isAnalyzing = true;

    updateAnalyzeButton();

    analyzeBtn.innerHTML =
      "<span>⏳</span> Analyzing with AI...";

    setStatus(
      "Your resume is being analyzed. Please wait...",
      "loading"
    );


    try {

      const response =
        await fetch(
          "/api/analyze",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              resumeText: resume,
              jobDescription: jobDescription
            })
          }
        );


      const data =
        await readResponse(response);

      console.log(
        "ATS analysis completed:",
        data
      );

      displayResults(data);

      setStatus(
        "Analysis completed successfully.",
        "success"
      );

    } catch (error) {

      console.error(
        "ATS analysis error:",
        error
      );

      setStatus(
        "Unable to analyze the resume. " +
        error.message,
        "error"
      );

    } finally {

      isAnalyzing = false;

      analyzeBtn.innerHTML =
        "<span>✨</span> Analyze Resume";

      updateAnalyzeButton();
    }
  }


  /* =======================================================
     ANALYZE AGAIN
     ======================================================= */

  function analyzeAgain() {

    resultBox.hidden = true;

    setStatus(
      "",
      ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    setTimeout(() => {

      if (
        resumeText.value.trim() &&
        jobDesc.value.trim() &&
        userConsent.checked
      ) {
        analyzeResume();
      } else {

        updateAnalyzeButton();

        resumeText.focus();
      }

    }, 250);
  }


  /* =======================================================
     INPUT EVENTS
     ======================================================= */

  resumeText.addEventListener(
    "input",
    () => {

      updateCounters();
      updateAnalyzeButton();
    }
  );


  jobDesc.addEventListener(
    "input",
    () => {

      updateCounters();
      updateAnalyzeButton();
    }
  );


  userConsent.addEventListener(
    "change",
    () => {

      updateAnalyzeButton();

      if (userConsent.checked) {

        setStatus(
          "",
          ""
        );
      }
    }
  );


  /* =======================================================
     KEYBOARD SHORTCUT
     ======================================================= */

  function handleShortcut(event) {

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter"
    ) {

      event.preventDefault();

      if (!analyzeBtn.disabled) {
        analyzeResume();
      }
    }
  }


  resumeText.addEventListener(
    "keydown",
    handleShortcut
  );

  jobDesc.addEventListener(
    "keydown",
    handleShortcut
  );


  /* =======================================================
     BUTTON EVENTS
     ======================================================= */

  analyzeBtn.addEventListener(
    "click",
    analyzeResume
  );


  reanalyzeBtn.addEventListener(
    "click",
    analyzeAgain
  );


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  updateCounters();

  updateAnalyzeButton();

  resultBox.hidden = true;

  console.log(
    "niDar Tools — AI ATS Resume Checker loaded."
  );

})();
