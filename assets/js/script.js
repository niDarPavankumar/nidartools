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

      navigator.serviceWorker
        .register("/sw.js")

        .then(() => {

          console.log("Service Worker Registered");

        })

        .catch(error => {

          console.error(error);

        });

    });

  }

  console.log("niDar Tools v3 Loaded");

});
