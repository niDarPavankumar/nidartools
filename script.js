// niDar Tools - Main JavaScript

// Theme Switcher Functionality
function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nidar_theme', theme);
}

// Load saved theme on startup
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('nidar_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) {
        themeSelector.value = savedTheme;
    }
});

// Search Filter for Tools
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const toolCards = document.querySelectorAll('.tools-grid .tool-card');
        
        toolCards.forEach(card => {
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

// Share Tool Function
function shareTool(toolName, toolUrl) {
    const fullUrl = window.location.origin + toolUrl;
    if (navigator.share) {
        navigator.share({
            title: toolName + ' - niDar Tools',
            text: 'Check out this free tool on niDar Tools:',
            url: fullUrl,
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(fullUrl);
        alert('Tool link copied to clipboard!');
    }
}

// Back to Top Button Logic
window.onscroll = function() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Comment Form Handler
function handleComment(event) {
    event.preventDefault();
    const name = document.getElementById('commenterName').value;
    const text = document.getElementById('commentText').value;
    
    const commentsList = document.getElementById('commentsList');
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    commentDiv.innerHTML = `<strong>${name}</strong><p>${text}</p><small>Just now</small>`;
    
    commentsList.prepend(commentDiv);
    document.getElementById('commentForm').reset();
}
