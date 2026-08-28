/* =====================================================
   niDar Tools - Main Script Logic
   ===================================================== */

// 1. Theme Switcher Functionality
function changeTheme(themeName) {
  document.body.classList.remove('dark', 'senior-theme');
  
  if (themeName === 'dark') {
    document.body.classList.add('dark');
  } else if (themeName === 'senior') {
    document.body.classList.add('senior-theme');
  }
  
  localStorage.setItem('nidar_theme', themeName);
}

// Load saved theme on startup
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('nidar_theme') || 'light';
  const themeSelector = document.getElementById('themeSelector');
  if (themeSelector) {
    themeSelector.value = savedTheme;
  }
  changeTheme(savedTheme);
});

// 2. Search Functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.tool-card');

    cards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();

      if (title.includes(query) || desc.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// 3. Floating Back To Top Button Logic
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    if (backToTopBtn) backToTopBtn.style.display = 'flex';
  } else {
    if (backToTopBtn) backToTopBtn.style.display = 'none';
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// 4. Share Tool Function
function shareTool(title, url) {
  const fullUrl = window.location.origin + url;
  if (navigator.share) {
    navigator.share({
      title: title,
      text: `Check out this free tool: ${title}`,
      url: fullUrl
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(fullUrl);
    alert(`Link copied to clipboard: ${fullUrl}`);
  }
}

// 5. Comment Section Logic
function handleComment(event) {
  event.preventDefault();
  const nameInput = document.getElementById('commenterName');
  const textInput = document.getElementById('commentText');
  const commentsList = document.getElementById('commentsList');

  if (!nameInput.value || !textInput.value) return;

  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment-item';
  commentDiv.innerHTML = `<strong>${escapeHtml(nameInput.value)}</strong> <small>Just now</small><p>${escapeHtml(textInput.value)}</p>`;

  commentsList.prepend(commentDiv);

  nameInput.value = '';
  textInput.value = '';
  alert('Thank you for your feedback!');
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
