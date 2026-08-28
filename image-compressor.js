"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  const quality = document.getElementById("quality");
  const qualityValue = document.getElementById("qualityValue");
  const compressBtn = document.getElementById("compressBtn");
  const result = document.getElementById("result");

  if (!imageInput || !preview || !quality || !qualityValue || !compressBtn || !result) {
    return;
  }

  let selectedFile = null;

  // क्वालिटी व्हॅल्यू दाखवणे
  qualityValue.textContent = quality.value + "%";

  quality.addEventListener("input", () => {
    qualityValue.textContent = quality.value + "%";
  });

  // इमेज सिलेक्ट झाल्यावर प्रीव्ह्यू दाखवणे
  imageInput.addEventListener("change", (event) => {
    result.innerHTML = "";
    preview.innerHTML = "";
    selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      result.innerHTML = '<div class="alert alert-danger">Please select a valid image file.</div>';
      selectedFile = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const image = document.createElement("img");
      image.src = ev.target.result;
      image.style.maxWidth = "100%";
      image.style.borderRadius = "12px";
      image.style.marginTop = "15px";
      image.style.boxShadow = "var(--shadow)";
      preview.appendChild(image);
    };
    reader.readAsDataURL(selectedFile);
  });

  // कंप्रेशन बटण क्लिक लॉजिक
  compressBtn.addEventListener("click", () => {
    if (!selectedFile) {
      result.innerHTML = '<div class="alert alert-warning">Please select an image first.</div>';
      return;
    }

    // लोडर दाखवणे
    result.innerHTML = '<div class="loader"></div><p class="text-center mt-20">Compressing image...</p>';

    const image = new Image();
    const reader = new FileReader();

    reader.onload = (ev) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const q = Number(quality.value) / 100;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              result.innerHTML = '<div class="alert alert-danger">Compression failed. Try again.</div>';
              return;
            }

            const url = URL.createObjectURL(blob);
            const originalKB = (selectedFile.size / 1024).toFixed(1);
            const compressedKB = (blob.size / 1024).toFixed(1);
            let savedPercent = (100 - (blob.size / selectedFile.size) * 100).toFixed(1);
            
            if (savedPercent < 0) savedPercent = 0; // जर साईझ वाढली तर 0% दाखवेल

            result.innerHTML = `
              <div class="alert alert-success slide-up">
                <h3>🎉 Compression Complete</h3>
                <p>Original Size: <strong>${originalKB} KB</strong></p>
                <p>Compressed Size: <strong>${compressedKB} KB</strong></p>
                <p>Saved Space: <strong>${savedPercent}%</strong></p>
                <div class="mt-20">
                  <a class="btn btn-primary" href="${url}" download="compressed_${selectedFile.name}">
                    ⬇️ Download Compressed Image
                  </a>
                </div>
              </div>
            `;
          },
          "image/jpeg",
          q
        );
      };

      image.src = ev.target.result;
    };

    reader.readAsDataURL(selectedFile);
  });
});
