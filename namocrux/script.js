const WORKER_URL = "https://nidar-api.nidarmarketingandservices.workers.dev";

const ideaInput = document.getElementById("ideaInput");
const styleSelect = document.getElementById("styleSelect");
const generateBtn = document.getElementById("generateBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const loadingBox = document.getElementById("loadingBox");
const resultsBox = document.getElementById("resultsBox");
const resultsList = document.getElementById("resultsList");
const errorBox = document.getElementById("errorBox");

const styleDescriptions = {
  modern: "modern, trendy, catchy, easy to pronounce globally",
  traditional: "traditional, Sanskrit or Indian-rooted, culturally meaningful",
  short: "very short, 1-2 syllables, simple and clean",
  meaningful: "deeply meaningful, symbolic, emotionally significant, tied closely to the details given"
};

function buildPrompt(idea, style) {
  const styleDesc = styleDescriptions[style] || styleDescriptions.modern;
  return "You are a creative naming expert. Based on this idea and details: \"" + idea + "\", suggest 8 unique names that are " + styleDesc + ". " +
    "For each name, give a short one-line reason explaining why it fits (connect it to specific details mentioned like people's names, dates, or purpose, where relevant). " +
    "Respond ONLY with valid JSON, no markdown, no code fences, in this exact format: " +
    "[{\"name\": \"NameHere\", \"meaning\": \"short reason here\"}]";
}

function extractJson(text) {
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  const jsonSlice = cleaned.substring(start, end + 1);
  return JSON.parse(jsonSlice);
}

async function generateNames() {
  const idea = ideaInput.value.trim();
  const style = styleSelect.value;

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
      body: JSON.stringify({ prompt: buildPrompt(idea, style) }),
    });

    const data = await res.json();
    const text = data.candidates[0].content.parts[0].text;
    const names = extractJson(text);

    resultsList.innerHTML = "";
    names.forEach(function (item) {
      const li = document.createElement("li");

      const nameSpan = document.createElement("span");
      nameSpan.className = "name-text";
      nameSpan.textContent = item.name;

      const meaningSpan = document.createElement("span");
      meaningSpan.className = "name-meaning";
      meaningSpan.textContent = item.meaning;

      li.appendChild(nameSpan);
      li.appendChild(meaningSpan);
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
