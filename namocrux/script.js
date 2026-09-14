const WORKER_URL = "https://nidar-api.nidarmarketingandservices.workers.dev";
const HISTORY_KEY = "namocrux_history";

const ideaInput = document.getElementById("ideaInput");
const styleSelect = document.getElementById("styleSelect");
const generateBtn = document.getElementById("generateBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const loadingBox = document.getElementById("loadingBox");
const resultsBox = document.getElementById("resultsBox");
const resultsList = document.getElementById("resultsList");
const errorBox = document.getElementById("errorBox");
const historySection = document.getElementById("historySection");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

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

function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveToHistory(idea, names) {
  const history = getHistory();
  history.unshift({ idea: idea, names: names.map(function (n) { return n.name; }), time: Date.now() });
  const trimmed = history.slice(0, 10);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  renderHistory();
}

function renderHistory() {
  const history = getHistory();

  if (history.length === 0) {
    historySection.classList.add("hidden");
    return;
  }

  historySection.classList.remove("hidden");
  historyList.innerHTML = "";

  history.forEach(function (entry) {
    const div = document.createElement("div");
    div.className = "history-item";

    const ideaSpan = document.createElement("span");
    ideaSpan.className = "h-idea";
    ideaSpan.textContent = entry.idea.length > 80 ? entry.idea.substring(0, 80) + "..." : entry.idea;

    const namesSpan = document.createElement("span");
    namesSpan.className = "h-names";
    namesSpan.textContent = entry.names.join(", ");

    div.appendChild(ideaSpan);
    div.appendChild(namesSpan);
    historyList.appendChild(div);
  });
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(function () {
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(function () {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 1500);
  });
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

      const textWrap = document.createElement("div");
      const nameSpan = document.createElement("span");
      nameSpan.className = "name-text";
      nameSpan.textContent = item.name;

      const meaningSpan = document.createElement("span");
      meaningSpan.className = "name-meaning";
      meaningSpan.textContent = item.meaning;

      textWrap.appendChild(nameSpan);
      textWrap.appendChild(meaningSpan);

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.textContent = "Copy";
      copyBtn.addEventListener("click", function () {
        copyToClipboard(item.name, copyBtn);
      });

      li.appendChild(textWrap);
      li.appendChild(copyBtn);
      resultsList.appendChild(li);
    });

    loadingBox.classList.add("hidden");
    resultsBox.classList.remove("hidden");

    saveToHistory(idea, names);
  } catch (err) {
    loadingBox.classList.add("hidden");
    errorBox.classList.remove("hidden");
  } finally {
    generateBtn.disabled = false;
  }
}

clearHistoryBtn.addEventListener("click", function () {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

generateBtn.addEventListener("click", generateNames);
regenerateBtn.addEventListener("click", generateNames);

renderHistory();
