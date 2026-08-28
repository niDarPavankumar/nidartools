/* "use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Theme Management ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const themeSelector = document.getElementById("themeSelector");
  const html = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      html.setAttribute("data-theme", "dark");
      document.body.classList.add("dark");
      document.body.classList.remove("senior-theme");
      if (themeToggle) themeToggle.textContent = "☀️";
    } else if (theme === "senior") {
      html.removeAttribute("data-theme");
      document.body.classList.remove("dark");
      document.body.classList.add("senior-theme");
      if (themeToggle) themeToggle.textContent = "👓";
    } else {
      html.removeAttribute("data-theme");
      document.body.classList.remove("dark", "senior-theme");
      if (themeToggle) themeToggle.textContent = "🌓";
    }
    localStorage.setItem("theme", theme);
  }

  // Load Saved Theme
  const currentTheme = localStorage.getItem("theme") || "light";
  applyTheme(currentTheme);
  if (themeSelector) themeSelector.value = currentTheme;

  // Toggle Click Listener
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const activeTheme = localStorage.getItem("theme") || "light";
      const nextTheme = activeTheme === "light" ? "dark" : activeTheme === "dark" ? "senior" : "light";
      applyTheme(nextTheme);
      if (themeSelector) themeSelector.value = nextTheme;
    });
  }

  // Dropdown Change Listener (जर तुमच्या HTML मध्ये Dropdown असेल)
  if (themeSelector) {
    themeSelector.addEventListener("change", (e) => {
      applyTheme(e.target.value);
    });
  }

  /* ---------- Live Tool Search ---------- */
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll(".tool-card, .card");

      cards.forEach(card => {
        const titleEl = card.querySelector("h3");
        const descEl = card.querySelector("p");

        const title = titleEl ? titleEl.textContent.toLowerCase() : "";
        const desc = descEl ? descEl.textContent.toLowerCase() : "";

        if (title.includes(query) || desc.includes(query)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  /* ---------- Load Saved Comments ---------- */
  loadComments();
});

/* ---------- Tool Sharing Function ---------- */
function shareTool(toolName, path) {
  const url = window.location.origin + path;
  if (navigator.share) {
    navigator.share({
      title: toolName,
      text: `Check out ${toolName} on niDar Tools!`,
      url: url,
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url);
    if (window.showToast) {
      window.showToast(`Link for ${toolName} copied to clipboard!`);
    } else {
      alert(`Link for ${toolName} copied to clipboard!`);
    }
  }
}

/* ---------- User Comment Handling ---------- */
function handleComment(event) {
  event.preventDefault();
  const nameInput = document.getElementById("commenterName");
  const textInput = document.getElementById("commentText");

  if (!nameInput || !textInput || !nameInput.value.trim() || !textInput.value.trim()) return;

  const commentObj = {
    name: nameInput.value.trim(),
    text: textInput.value.trim(),
    date: new Date().toLocaleDateString()
  };

  let comments = JSON.parse(localStorage.getItem("niDarComments") || "[]");
  comments.unshift(commentObj);
  localStorage.setItem("niDarComments", JSON.stringify(comments));

  const form = document.getElementById("commentForm");
  if (form) form.reset();

  loadComments();
}

function loadComments() {
  const listDiv = document.getElementById("commentsList");
  if (!listDiv) return;

  let comments = JSON.parse(localStorage.getItem("niDarComments") || "[]");
  if (comments.length === 0) {
    listDiv.innerHTML = "<p style='color:var(--text-muted); font-size:0.9rem;'>No comments yet. Be the first to share your feedback!</p>";
    return;
  }

  listDiv.innerHTML = comments.map(c => `
    <div class="comment-item">
      <strong>${escapeHtml(c.name)}</strong> <span style="font-size:0.8rem; color:var(--text-muted); float:right;">${c.date}</span>
      <p style="margin-top:0.3rem; font-size:0.95rem;">${escapeHtml(c.text)}</p>
    </div>
  `).join("");
}

/* ---------- Utility: XSS Protection ---------- */
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
 */
