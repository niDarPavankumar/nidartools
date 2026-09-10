/*
=========================================================
niDar Tools — Support Center
Support Page JavaScript
=========================================================
*/

(function () {
  "use strict";

  /* -----------------------------------------------------
     1. THEME DETECTION
     ----------------------------------------------------- */

  function applySavedTheme() {
    const savedTheme =
      localStorage.getItem("nidar_theme") ||
      localStorage.getItem("theme");

    if (
      savedTheme === "dark" ||
      savedTheme === "light" ||
      savedTheme === "senior"
    ) {
      document.documentElement.setAttribute(
        "data-theme",
        savedTheme
      );
    }
  }

  /* -----------------------------------------------------
     2. SMOOTH INTERNAL NAVIGATION
     ----------------------------------------------------- */

  function setupSmoothLinks() {
    const links = document.querySelectorAll(
      'a[href^="#"]'
    );

    links.forEach(function (link) {
      link.addEventListener("click", function (event) {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  }

  /* -----------------------------------------------------
     3. EXTERNAL / EMAIL LINK ACCESSIBILITY
     ----------------------------------------------------- */

  function setupEmailLinks() {
    const emailLinks = document.querySelectorAll(
      'a[href^="mailto:"]'
    );

    emailLinks.forEach(function (link) {
      link.setAttribute(
        "aria-label",
        "Email niDar Tools Support"
      );
    });
  }

  /* -----------------------------------------------------
     4. PAGE READY
     ----------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    applySavedTheme();
    setupSmoothLinks();
    setupEmailLinks();
  });

})();
