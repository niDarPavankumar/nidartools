// niDar Tools - script.js (v2 Starter)

document.addEventListener("DOMContentLoaded", () => {

  // Dark Mode Toggle
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
      );
    });
  }

  // Load saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

  // Scroll To Top Button
  const topBtn = document.createElement("button");
  topBtn.id = "scrollTopBtn";
  topBtn.innerHTML = "↑";

  topBtn.style.position = "fixed";
  topBtn.style.right = "20px";
  topBtn.style.bottom = "20px";
  topBtn.style.padding = "10px 15px";
  topBtn.style.fontSize = "18px";
  topBtn.style.cursor = "pointer";
  topBtn.style.display = "none";
  topBtn.style.zIndex = "999";

  document.body.appendChild(topBtn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      topBtn.style.display = "block";
    } else {
      topBtn.style.display = "none";
    }
  });

  topBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // Live Search
  const search = document.querySelector('input[type="text"]');

  if (search) {
    search.addEventListener("input", () => {

      const keyword = search.value.toLowerCase();

      document.querySelectorAll(".card").forEach(card => {

        if (card.textContent.toLowerCase().includes(keyword)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }

      });

    });
  }

  console.log("niDar Tools Loaded Successfully");

});
