/*
=========================================================
niDar Tools — FAQ JavaScript
Interactive FAQ / Search / Accessibility
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  const searchInput = document.getElementById("faqSearch");
  const clearSearchBtn = document.querySelector(".clear-search");
  const searchStatus = document.querySelector(".search-status");

  const expandAllBtn =
    document.getElementById("expandAllBtn") ||
    document.querySelector('[data-action="expand-all"]');

  const collapseAllBtn =
    document.getElementById("collapseAllBtn") ||
    document.querySelector('[data-action="collapse-all"]');

  /* =====================================================
     FAQ ACCORDION
  ===================================================== */

  function getQuestionButton(item) {
    return item.querySelector(".faq-question");
  }

  function getAnswer(item) {
    return item.querySelector(".faq-answer");
  }

  function setItemState(item, open) {
    const button = getQuestionButton(item);
    const answer = getAnswer(item);

    if (!button || !answer) return;

    item.classList.toggle("is-open", open);

    button.setAttribute("aria-expanded", String(open));

    if (open) {
      answer.hidden = false;
      answer.setAttribute("aria-hidden", "false");
    } else {
      answer.hidden = true;
      answer.setAttribute("aria-hidden", "true");
    }
  }

  function toggleItem(item) {
    const isOpen = item.classList.contains("is-open");
    setItemState(item, !isOpen);
  }

  faqItems.forEach((item, index) => {
    const button = getQuestionButton(item);
    const answer = getAnswer(item);

    if (!button || !answer) return;

    /* Accessibility IDs */
    const answerId =
      answer.id || `faq-answer-${index + 1}`;

    answer.id = answerId;

    button.setAttribute("aria-controls", answerId);

    /* Default state */
    const initiallyOpen =
      item.classList.contains("is-open") ||
      button.getAttribute("aria-expanded") === "true";

    setItemState(item, initiallyOpen);

    button.addEventListener("click", () => {
      toggleItem(item);
    });
  });

  /* =====================================================
     EXPAND ALL
  ===================================================== */

  function expandAll() {
    faqItems.forEach(item => {
      setItemState(item, true);
    });
  }

  /* =====================================================
     COLLAPSE ALL
  ===================================================== */

  function collapseAll() {
    faqItems.forEach(item => {
      setItemState(item, false);
    });
  }

  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", expandAll);
  }

  if (collapseAllBtn) {
    collapseAllBtn.addEventListener("click", collapseAll);
  }

  /* =====================================================
     FAQ SEARCH
  ===================================================== */

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function updateSearchStatus(visibleCount, totalCount, query) {
    if (!searchStatus) return;

    if (!query) {
      searchStatus.textContent = `${totalCount} questions available`;
      return;
    }

    if (visibleCount === 0) {
      searchStatus.textContent =
        `No questions found for "${query}".`;
      return;
    }

    searchStatus.textContent =
      `${visibleCount} of ${totalCount} questions found`;
  }

  function performSearch() {
    if (!searchInput) return;

    const query = normalizeText(searchInput.value);

    let visibleCount = 0;

    faqItems.forEach(item => {
      const question =
        item.querySelector(".question-text") ||
        item.querySelector(".faq-question");

      const answer =
        item.querySelector(".faq-answer");

      const searchableText = normalizeText(
        `${question ? question.textContent : ""} ${
          answer ? answer.textContent : ""
        }`
      );

      const matched =
        !query || searchableText.includes(query);

      item.hidden = !matched;

      if (matched) {
        visibleCount++;

        /*
         * Automatically open matching questions
         * when a search term is entered.
         */
        if (query) {
          setItemState(item, true);
        }
      } else {
        setItemState(item, false);
      }
    });

    updateSearchStatus(
      visibleCount,
      faqItems.length,
      query
    );
  }

  if (searchInput) {
    searchInput.addEventListener("input", performSearch);

    searchInput.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        searchInput.value = "";
        performSearch();
        searchInput.blur();
      }
    });
  }

  /* =====================================================
     CLEAR SEARCH
  ===================================================== */

  function clearSearch() {
    if (!searchInput) return;

    searchInput.value = "";

    faqItems.forEach(item => {
      item.hidden = false;
    });

    updateSearchStatus(
      faqItems.length,
      faqItems.length,
      ""
    );

    searchInput.focus();
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", clearSearch);
  }

  /* =====================================================
     NO RESULTS MESSAGE
  ===================================================== */

  const noResults = document.querySelector(".no-results");

  function updateNoResults() {
    if (!noResults) return;

    const visibleItems =
      faqItems.filter(item => !item.hidden).length;

    noResults.hidden = visibleItems !== 0;
  }

  if (searchInput) {
    searchInput.addEventListener("input", updateNoResults);
  }

  /* =====================================================
     SEARCH STATUS INITIALIZATION
  ===================================================== */

  updateSearchStatus(
    faqItems.length,
    faqItems.length,
    ""
  );

  updateNoResults();

  /* =====================================================
     ENTER / SPACE ACCESSIBILITY
  ===================================================== */

  faqItems.forEach(item => {
    const button = getQuestionButton(item);

    if (!button) return;

    button.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleItem(item);
      }
    });
  });

  /* =====================================================
     OPTIONAL OLD FAQ CARD SUPPORT

     If an older FAQ structure using .card is still
     present, keep it functional without interfering
     with the new FAQ system.
  ===================================================== */

  const oldCards = Array.from(
    document.querySelectorAll(
      ".faq-page > .card, main.container > .card"
    )
  );

  oldCards.forEach(card => {
    const heading = card.querySelector("h2");

    if (!heading) return;

    card.classList.add("faq-legacy-card");
  });

  /* =====================================================
     SMOOTH FAQ HASH SUPPORT

     Example:
     /faq/#faq-3
  ===================================================== */

  function openHashFAQ() {
    const hash = window.location.hash;

    if (!hash) return;

    const target = document.querySelector(hash);

    if (!target) return;

    const faqItem = target.classList.contains("faq-item")
      ? target
      : target.closest(".faq-item");

    if (faqItem) {
      setItemState(faqItem, true);

      setTimeout(() => {
        faqItem.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 100);
    }
  }

  window.addEventListener("hashchange", openHashFAQ);

  openHashFAQ();

  /* =====================================================
     CONSOLE INFO
  ===================================================== */

  console.info(
    `niDar Tools FAQ initialized — ${faqItems.length} questions`
  );
});
