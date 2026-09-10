/*
=========================================================
niDar Tools — Contact Us
Client-Side Contact Utilities
=========================================================
*/

(function () {
  "use strict";

  const SUPPORT_EMAIL = "support@nidartools.com";

  function setCurrentYear() {
    const year = new Date().getFullYear();

    document.querySelectorAll(".contact-footer").forEach((footer) => {
      footer.querySelectorAll("p").forEach((paragraph) => {
        if (paragraph.textContent.includes("niDar Tools")) {
          paragraph.innerHTML = "© " + year + " niDar Tools";
        }
      });
    });
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(textarea);

    return copied;
  }

  function initCopyEmail() {
    const button = document.getElementById("copyEmailBtn");
    const emailElement = document.getElementById("emailText");
    const status = document.getElementById("copyStatus");

    if (!button || !emailElement) {
      return;
    }

    button.addEventListener("click", async function () {
      const email = emailElement.textContent.trim() || SUPPORT_EMAIL;

      try {
        const copied = await copyText(email);

        if (copied) {
          button.textContent = "Copied!";
          button.setAttribute("aria-label", "Email copied");

          if (status) {
            status.textContent = "Email address copied to clipboard.";
          }

          window.setTimeout(function () {
            button.textContent = "Copy";
            button.setAttribute("aria-label", "Copy support email");

            if (status) {
              status.textContent = "";
            }
          }, 2200);
        } else {
          throw new Error("Copy command failed.");
        }
      } catch (error) {
        if (status) {
          status.textContent =
            "Unable to copy automatically. Please select the email address manually.";
        }
      }
    });
  }

  function initMailLinks() {
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      const href = link.getAttribute("href") || "";

      if (href === "mailto:support@nidartools.com") {
        link.setAttribute("href", "mailto:" + SUPPORT_EMAIL);
      }
    });
  }

  function initExternalWebsite() {
    document.querySelectorAll('a[href="https://nidartools.com"]').forEach(function (link) {
      link.setAttribute("href", "/");
    });
  }

  function initPage() {
    setCurrentYear();
    initCopyEmail();
    initMailLinks();
    initExternalWebsite();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }

})();
