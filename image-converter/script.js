(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const imageInput = $("imageInput");
  const uploadZone = $("uploadZone");
  const selectImageBtn = $("selectImageBtn");
  const converterEditor = $("converterEditor");
  const imagePreview = $("imagePreview");
  const imageName = $("imageName");
  const imageDimensions = $("imageDimensions");
  const imageSize = $("imageSize");

  const outputFormat = $("outputFormat");
  const quality = $("quality");
  const qualityValue = $("qualityValue");
  const keepTransparency = $("keepTransparency");

  const convertBtn = $("convertBtn");
  const resetBtn = $("resetBtn");

  const resultSection = $("resultSection");
  const resultSummary = $("resultSummary");
  const downloadBtn = $("downloadBtn");

  let currentFile = null;
  let currentImage = null;
  let resultUrl = null;

  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
  }

  function formatFormat(mime) {
    const formats = {
      "image/jpeg": "JPG",
      "image/png": "PNG",
      "image/webp": "WEBP",
      "image/gif": "GIF",
      "image/bmp": "BMP"
    };

    return formats[mime] || "IMAGE";
  }

  function showError(message) {
    alert(message);
  }

  function revokeResultUrl() {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      resultUrl = null;
    }
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => resolve(img);

        img.onerror = () => {
          reject(new Error("The selected file is not a valid image."));
        };

        img.src = reader.result;
      };

      reader.onerror = () => {
        reject(new Error("Unable to read the selected image."));
      };

      reader.readAsDataURL(file);
    });
  }

  async function handleFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please select a valid image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showError("Image size must be 50 MB or smaller.");
      return;
    }

    try {
      convertBtn.disabled = true;
      resultSection.hidden = true;

      const img = await loadImage(file);

      currentFile = file;
      currentImage = img;

      imagePreview.src = img.src;
      imageName.textContent = file.name;
      imageDimensions.textContent = `${img.naturalWidth} × ${img.naturalHeight}px`;
      imageSize.textContent = formatBytes(file.size);

      converterEditor.hidden = false;
      convertBtn.disabled = false;

      converterEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } catch (error) {
      console.error(error);
      showError(error.message || "Unable to load the image.");
    }
  }

  function canvasToBlob(canvas, type, qualityValueNumber) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Your browser could not create the converted image."));
          }
        },
        type,
        qualityValueNumber
      );
    });
  }

  function createCanvas() {
    if (!currentImage) {
      throw new Error("No image selected.");
    }

    const width = currentImage.naturalWidth;
    const height = currentImage.naturalHeight;

    if (!width || !height) {
      throw new Error("Unable to determine image dimensions.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", {
      alpha: true
    });

    if (!ctx) {
      throw new Error("Canvas is not supported by this browser.");
    }

    return { canvas, ctx };
  }

  function drawImage(canvas, ctx, type) {
    const width = canvas.width;
    const height = canvas.height;

    /*
     * JPEG does not support transparency.
     * A white background prevents transparent pixels
     * from becoming black when exporting to JPEG.
     */
    if (
      type === "image/jpeg" ||
      (type === "image/bmp" && !keepTransparency.checked)
    ) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(currentImage, 0, 0, width, height);
  }

  async function convertImage() {
    if (!currentFile || !currentImage) {
      showError("Please select an image first.");
      return;
    }

    const type = outputFormat.value;
    const qualityNumber = Math.max(
      0.1,
      Math.min(1, Number(quality.value) / 100)
    );

    convertBtn.disabled = true;
    convertBtn.textContent = "Converting...";

    revokeResultUrl();

    try {
      const { canvas, ctx } = createCanvas();

      drawImage(canvas, ctx, type);

      let blob;

      if (type === "image/png") {
        blob = await canvasToBlob(canvas, type);
      } else {
        blob = await canvasToBlob(canvas, type, qualityNumber);
      }

      const extensionMap = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/bmp": "bmp"
      };

      const extension = extensionMap[type] || "jpg";

      const originalName = currentFile.name.replace(
        /\.[^/.]+$/,
        ""
      );

      const fileName = `${originalName}-converted.${extension}`;

      resultUrl = URL.createObjectURL(blob);

      downloadBtn.href = resultUrl;
      downloadBtn.download = fileName;

      const originalSize = currentFile.size;
      const convertedSize = blob.size;

      const difference = originalSize - convertedSize;

      let summary;

      if (difference > 0) {
        const savedPercent = (
          (difference / originalSize) *
          100
        ).toFixed(1);

        summary =
          `${formatFormat(type)} image ready • ` +
          `${formatBytes(convertedSize)} • ` +
          `${savedPercent}% smaller than the original`;
      } else if (difference < 0) {
        const increasePercent = (
          (Math.abs(difference) / originalSize) *
          100
        ).toFixed(1);

        summary =
          `${formatFormat(type)} image ready • ` +
          `${formatBytes(convertedSize)} • ` +
          `${increasePercent}% larger than the original`;
      } else {
        summary =
          `${formatFormat(type)} image ready • ` +
          `${formatBytes(convertedSize)}`;
      }

      resultSummary.textContent = summary;
      resultSection.hidden = false;

      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    } catch (error) {
      console.error(error);
      showError(
        error.message ||
        "Something went wrong while converting the image."
      );
    } finally {
      convertBtn.disabled = false;
      convertBtn.textContent = "Convert Image";
    }
  }

  function updateQualityLabel() {
    qualityValue.textContent = `${quality.value}%`;

    /*
     * PNG is lossless, so the quality slider has no effect.
     * Keep it visible because JPG/WEBP use it.
     */
    if (outputFormat.value === "image/png") {
      qualityValue.textContent = "Lossless";
    }
  }

  function updateTransparencyState() {
    const type = outputFormat.value;

    /*
     * JPEG cannot preserve transparency.
     */
    if (type === "image/jpeg") {
      keepTransparency.checked = false;
      keepTransparency.disabled = true;
    } else {
      keepTransparency.disabled = false;
    }

    updateQualityLabel();
  }

  function resetTool() {
    revokeResultUrl();

    currentFile = null;
    currentImage = null;

    imageInput.value = "";
    imagePreview.removeAttribute("src");

    imageName.textContent = "Image";
    imageDimensions.textContent = "—";
    imageSize.textContent = "—";

    converterEditor.hidden = true;
    resultSection.hidden = true;

    convertBtn.disabled = true;
    convertBtn.textContent = "Convert Image";

    quality.value = "90";
    outputFormat.value = "image/jpeg";
    keepTransparency.checked = false;

    updateTransparencyState();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* SELECT IMAGE */

  selectImageBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    imageInput.click();
  });

  uploadZone.addEventListener("click", () => {
    imageInput.click();
  });

  imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];

    if (file) {
      handleFile(file);
    }
  });

  /* DRAG & DROP */

  ["dragenter", "dragover"].forEach((eventName) => {
    uploadZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.stopPropagation();
      uploadZone.classList.add("drag-over");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.stopPropagation();
      uploadZone.classList.remove("drag-over");
    });
  });

  uploadZone.addEventListener("drop", (event) => {
    const file = event.dataTransfer?.files?.[0];

    if (file) {
      handleFile(file);
    }
  });

  /* SETTINGS */

  quality.addEventListener("input", updateQualityLabel);

  outputFormat.addEventListener(
    "change",
    updateTransparencyState
  );

  /* ACTIONS */

  convertBtn.addEventListener("click", convertImage);

  resetBtn.addEventListener("click", resetTool);

  /* CLEANUP */

  window.addEventListener("beforeunload", revokeResultUrl);

  /* INITIAL STATE */

  updateTransparencyState();

  console.log("niDar Tools — Image Format Converter initialized.");
})();
