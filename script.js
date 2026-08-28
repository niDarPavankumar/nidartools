document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;

  const currentTheme = localStorage.getItem("theme") || "light";
  if (currentTheme === "dark") {
    html.setAttribute("data-theme", "dark");
    if(themeToggle) themeToggle.textContent = "☀️";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      let theme = html.getAttribute("data-theme");
      if (theme === "dark") {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌓";
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";
      }
    });
  }

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll(".tool-card");
      cards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const desc = card.querySelector("p").textContent.toLowerCase();
        if (title.includes(query) || desc.includes(query)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // Load saved comments
  loadComments();
});

// Tool Sharing Function
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
    alert(`Link for ${toolName} copied to clipboard!`);
  }
}

// Handle User Comments
function handleComment(event) {
  event.preventDefault();
  const name = document.getElementById("commenterName").value;
  const text = document.getElementById("commentText").value;

  const commentObj = { name, text, date: new Date().toLocaleDateString() };
  let comments = JSON.parse(localStorage.getItem("niDarComments") || "[]");
  comments.unshift(commentObj);
  localStorage.setItem("niDarComments", JSON.stringify(comments));

  document.getElementById("commentForm").reset();
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

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
