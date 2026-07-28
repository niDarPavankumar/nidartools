// =====================================================
// niDar Tools v3 Professional JavaScript
// Part 1 - Theme, Navigation & Service Worker
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
     Mobile Navigation
  ========================== */

  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  /* ==========================
     Dark / Light Theme
  ========================== */

  const themeToggle = document.getElementById("themeToggle");

  function setTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    setTheme(savedTheme);
  }

  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      if (document.body.classList.contains("dark")) {
        setTheme("light");
      } else {
        setTheme("dark");
      }

    });

  }

  /* ==========================
     Smooth Scroll
  ========================== */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const target = document.querySelector(
        link.getAttribute("href")
      );

      if (target) {

        event.preventDefault();

        target.scrollIntoView({

          behavior: "smooth"

        });

      }

    });

  });

  /* ==========================
     Service Worker
  ========================== */

  if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

//      navigator.serviceWorker
//        .register("/sw.js")
//
//        .then(() => {
//
//          console.log("Service Worker Registered");
//
//        })
//
//        .catch(error => {
//
//          console.error(error);
//
//        });

    });

  }

  console.log("niDar Tools v3 Loaded");

});

/* =====================================================
   Part 2 - Search, Scroll Top, Reveal & Utilities
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
     Live Tool Search
  ========================== */

  const searchInput = document.getElementById("searchInput");

  if (searchInput) {

    searchInput.addEventListener("input", () => {

      const keyword = searchInput.value.toLowerCase();

      document.querySelectorAll(".card").forEach(card => {

        const text = card.innerText.toLowerCase();

        card.style.display =
          text.includes(keyword) ? "" : "none";

      });

    });

  }

  /* ==========================
     Scroll To Top Button
  ========================== */

  const scrollBtn = document.getElementById("scrollTopBtn");

  if (scrollBtn) {

    window.addEventListener("scroll", () => {

      if (window.scrollY > 300) {

        scrollBtn.style.display = "block";

      } else {

        scrollBtn.style.display = "none";

      }

    });

    scrollBtn.addEventListener("click", () => {

      window.scrollTo({

        top: 0,
        behavior: "smooth"

      });

    });

  }

  /* ==========================
     Scroll Reveal Animation
  ========================== */

  const revealItems = document.querySelectorAll(".card,.hero,.section");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("fade-in");

          observer.unobserve(entry.target);

        }

      });

    }, {
      threshold: 0.15
    });

    revealItems.forEach(item => observer.observe(item));

  }

  /* ==========================
     Lazy Loading Images
  ========================== */

  document.querySelectorAll("img").forEach(img => {

    img.loading = "lazy";

  });

  /* ==========================
     Toast Notification
  ========================== */

  window.showToast = function(message) {

    const toast = document.createElement("div");

    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.padding = "12px 18px";
    toast.style.background = "#0d6efd";
    toast.style.color = "#fff";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);

    setTimeout(() => {

      toast.remove();

    }, 3000);

  };

  console.log("Professional Utilities Loaded");

});

