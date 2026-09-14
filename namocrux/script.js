const WORKER_URL = "https://nidar-api.nidarmarketingandservices.workers.dev";

const ideaInput = document.getElementById("ideaInput");
const generateBtn = document.getElementById("generateBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const loadingBox = document.getElementById("loadingBox");
const resultsBox = document.getElementById("resultsBox");
const resultsList = document.getElementById("resultsList");
const errorBox = document.getElementById("errorBox");

function buildPrompt(idea) {
  return "You are a creative naming expert. Based on this idea: \"" + idea + "\", suggest 8 short, unique, catchy, brandable names. Rules: no explanations, no numbering, no punctuation, just one name per line, nothing else.";
}

async function generateNames() {
  const idea = ideaInput.value.trim();

  if (!idea) {
    alert("Please describe your idea first.");
    return;
  }

  resultsBox.classList.add("hidden");
  errorBox.classList.add("hidden");
  loadingBox.classList.remove("hidden");
  generateBtn.disabled = true;

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: buildPrompt(idea) }),
    });

    const data = await res.json();

    const text = data.candidates[0].content.parts[0].text;

    const names = text
      .split("\n")
      .map(function (line) { return line.trim(); })
      .filter(function (line) { return line.length > 0; });

    resultsList.innerHTML = "";
    names.forEach(function (name) {
      const li = document.createElement("li");
      li.textContent = name;
      resultsList.appendChild(li);
    });

    loadingBox.classList.add("hidden");
    resultsBox.classList.remove("hidden");
  } catch (err) {
    loadingBox.classList.add("hidden");
    errorBox.classList.remove("hidden");
  } finally {
    generateBtn.disabled = false;
  }
}

generateBtn.addEventListener("click", generateNames);
regenerateBtn.addEventListener("click", generateNames);
