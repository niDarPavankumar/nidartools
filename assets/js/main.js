/* =====================================================
   niDar Tools v3 - Core JavaScript Framework
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Mobile Navigation ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  /* ---------- 2. Theme Management (Light / Dark / Senior) ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const themeSelector = document.getElementById("themeSelector");

  function setTheme(theme) {
    document.body.classList.remove("dark", "senior-theme");

    if (theme === "dark") {
      document.body.classList.add("dark");
    } else if (theme === "senior") {
      document.body.classList.add("senior-theme");
    }

    localStorage.setItem("nidar_theme", theme);
  }

  // Load saved theme
  const savedTheme = localStorage.getItem("nidar_theme") || "light";
  setTheme(savedTheme);
  if (themeSelector) themeSelector.value = savedTheme;

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark");
      setTheme(isDark ? "light" : "dark");
    });
  }

  if (themeSelector) {
    themeSelector.addEventListener("change", (e) => {
      setTheme(e.target.value);
    });
  }

  /* ---------- 3. Live Tool Search Filter ---------- */
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.toLowerCase().trim();
      const cards = document.querySelectorAll(".card, .tool-card");

      cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(keyword) ? "" : "none";
      });
    });
  }

  /* ---------- 4. Scroll To Top Button ---------- */
  const scrollBtn = document.getElementById("scrollTopBtn");

  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 5. Sticky Back to Home Button ---------- */
  const path = window.location.pathname;
  const isHome = path.endsWith("index.html") || path === "/" || path === "";

  if (!isHome) {
    let backBtn = document.getElementById("backHomeBtn");

    if (!backBtn) {
      backBtn = document.createElement("button");
      backBtn.id = "backHomeBtn";
      backBtn.title = "Back to Home";
      backBtn.innerHTML = "⌂";
      document.body.appendChild(backBtn);
    }

    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });

    window.addEventListener("scroll", () => {
      backBtn.style.display = window.scrollY > 150 ? "flex" : "none";
    });
  }

  /* ---------- 6. Smooth Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ---------- 7. Lazy Loading & Animations ---------- */
  document.querySelectorAll("img").forEach(img => img.loading = "lazy");

  const revealItems = document.querySelectorAll(".card, .tool-card, .hero, section");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach(item => observer.observe(item));
  }

  console.log("niDar Tools v3 Master Script Loaded");
});

/* ---------- 8. Global Utility: Toast Notification ---------- */
window.showToast = function(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 18px;
    background: var(--primary, #0d6efd);
    color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    font-size: 14px;
    font-weight: 600;
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

