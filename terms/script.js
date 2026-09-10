/*
=========================================================
niDar Tools — Terms & Conditions JavaScript
Navigation / Accessibility / Page Utilities
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
     SMOOTH ANCHOR NAVIGATION
  ===================================================== */

  const anchorLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  anchorLinks.forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      /*
       * Keep the URL hash without causing a jump.
       */
      history.replaceState(
        null,
        "",
        targetId
      );
    });
  });


  /* =====================================================
     HASH TARGET SUPPORT
  ===================================================== */

  function openHashTarget() {
    const hash = window.location.hash;

    if (!hash) return;

    const target = document.querySelector(hash);

    if (!target) return;

    setTimeout(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      target.classList.add("terms-highlight");

      setTimeout(() => {
        target.classList.remove("terms-highlight");
      }, 1800);
    }, 100);
  }

  openHashTarget();

  window.addEventListener(
    "hashchange",
    openHashTarget
  );


  /* =====================================================
     ACTIVE SECTION HIGHLIGHT
  ===================================================== */

  const termsSections = Array.from(
    document.querySelectorAll(".terms-card[id]")
  );

  if ("IntersectionObserver" in window && termsSections.length) {

    const observer = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            termsSections.forEach(section => {
              section.classList.remove(
                "terms-current-section"
              );
            });

            entry.target.classList.add(
              "terms-current-section"
            );
          }

        });

      },
      {
        root: null,
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0
      }
    );

    termsSections.forEach(section => {
      observer.observe(section);
    });
  }


  /* =====================================================
     BACK TO TOP BUTTON
  ===================================================== */

  const backToTop = document.createElement("button");

  backToTop.type = "button";
  backToTop.className = "terms-back-to-top";
  backToTop.setAttribute(
    "aria-label",
    "Back to top"
  );
  backToTop.setAttribute(
    "title",
    "Back to top"
  );

  backToTop.innerHTML = "↑";

  document.body.appendChild(backToTop);


  function updateBackToTop() {

    if (window.scrollY > 500) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }

  }

  window.addEventListener(
    "scroll",
    updateBackToTop,
    { passive: true }
  );

  updateBackToTop();


  backToTop.addEventListener(
    "click",
    () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );


  /* =====================================================
     EXTERNAL LINKS
  ===================================================== */

  const links = document.querySelectorAll(
    'a[href^="http://"], a[href^="https://"]'
  );

  links.forEach(link => {

    const currentHost =
      window.location.hostname;

    try {

      const linkUrl =
        new URL(link.href);

      if (
        linkUrl.hostname &&
        linkUrl.hostname !== currentHost
      ) {

        link.setAttribute(
          "target",
          "_blank"
        );

        link.setAttribute(
          "rel",
          "noopener noreferrer"
        );

      }

    } catch (error) {
      /*
       * Ignore invalid URLs.
       */
    }

  });


  /* =====================================================
     CURRENT YEAR
  ===================================================== */

  const currentYear =
    new Date().getFullYear();

  const yearElements =
    document.querySelectorAll(
      "[data-current-year]"
    );

  yearElements.forEach(element => {
    element.textContent = currentYear;
  });


  /* =====================================================
     REDUCED MOTION
  ===================================================== */

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (prefersReducedMotion) {

    document.documentElement.style.scrollBehavior =
      "auto";

  }


  /* =====================================================
     PRINT SUPPORT
  ===================================================== */

  window.addEventListener(
    "beforeprint",
    () => {
      document.body.classList.add(
        "terms-print-mode"
      );
    }
  );

  window.addEventListener(
    "afterprint",
    () => {
      document.body.classList.remove(
        "terms-print-mode"
      );
    }
  );


  /* =====================================================
     PAGE READY
  ===================================================== */

  document.documentElement.classList.add(
    "terms-js-ready"
  );

  console.info(
    "niDar Tools — Terms & Conditions initialized."
  );
});
