(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const uploadZone = $("uploadZone");
  const imageInput = $("imageInput");
  const selectImagesBtn = $("selectImagesBtn");
  const addMoreBtn = $("addMoreBtn");
  const clearImagesBtn = $("clearImagesBtn");

  const imageListSection = $("imageListSection");
  const imageGrid = $("imageGrid");

  const pdfSettings = $("pdfSettings");
  const pageSize = $("pageSize");
  const orientation = $("orientation");
  const margin = $("margin");
  const imageQuality = $("imageQuality");
  const qualityValue = $("qualityValue");
  const pdfFileName = $("pdfFileName");
  const oneImagePerPage = $("oneImagePerPage");

  const generatePdfBtn = $("generatePdfBtn");
  const resetBtn = $("resetBtn");

  const resultSection = $("resultSection");
  const resultSummary = $("resultSummary");
  const downloadBtn = $("downloadBtn");

  const MAX_FILES = 30;
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  let images = [];
  let pdfUrl = null;

  /*
   * Each image object:
   * {
   *   id,
   *   file,
   *   url,
   *   image
   * }
   */

  function createId() {
    return (
      Date.now().toString(36) +
      Math.random().toString(36).slice(2)
    );
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return "0 Bytes";
    }

    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(
      index === 0 ? 0 : 2
    )} ${units[index]}`;
  }

  function revokePdfUrl() {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      pdfUrl = null;
    }
  }

  function readImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        resolve({
          id: createId(),
          file,
          url,
          image: img
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Unable to read "${file.name}".`));
      };

      img.src = url;
    });
  }

  async function addFiles(fileList) {
    const files = Array.from(fileList || []);

    if (!files.length) {
      return;
    }

    const remaining = MAX_FILES - images.length;

    if (remaining <= 0) {
      alert(`You can add up to ${MAX_FILES} images.`);
      return;
    }

    const selected = files.slice(0, remaining);

    for (const file of selected) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not a supported image.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert(
          `${file.name} is larger than ${formatBytes(MAX_FILE_SIZE)}.`
        );
        continue;
      }

      try {
        const item = await readImage(file);
        images.push(item);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }

    renderImages();

    if (images.length) {
      imageListSection.hidden = false;
      pdfSettings.hidden = false;

      imageListSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  function renderImages() {
    imageGrid.innerHTML = "";

    images.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "image-item";
      card.dataset.id = item.id;

      const order = document.createElement("span");
      order.className = "image-order";
      order.textContent = index + 1;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-image-btn";
      removeBtn.setAttribute("aria-label", `Remove ${item.file.name}`);
      removeBtn.textContent = "×";

      removeBtn.addEventListener("click", () => {
        removeImage(item.id);
      });

      const preview = document.createElement("div");
      preview.className = "image-item-preview";

      const img = document.createElement("img");
      img.src = item.url;
      img.alt = item.file.name;

      preview.appendChild(img);

      const info = document.createElement("div");
      info.className = "image-item-info";

      const name = document.createElement("span");
      name.className = "image-item-name";
      name.textContent = item.file.name;

      const size = document.createElement("span");
      size.className = "image-item-size";
      size.textContent =
        `${formatBytes(item.file.size)} • ` +
        `${item.image.naturalWidth}×${item.image.naturalHeight}px`;

      info.appendChild(name);
      info.appendChild(size);

      card.appendChild(order);
      card.appendChild(removeBtn);
      card.appendChild(preview);
      card.appendChild(info);

      imageGrid.appendChild(card);
    });
  }

  function removeImage(id) {
    const index = images.findIndex((item) => item.id === id);

    if (index === -1) {
      return;
    }

    URL.revokeObjectURL(images[index].url);
    images.splice(index, 1);

    renderImages();

    if (!images.length) {
      imageListSection.hidden = true;
      pdfSettings.hidden = true;
      resultSection.hidden = true;
    }
  }

  function clearImages() {
    images.forEach((item) => {
      URL.revokeObjectURL(item.url);
    });

    images = [];

    imageGrid.innerHTML = "";
    imageListSection.hidden = true;
    pdfSettings.hidden = true;
    resultSection.hidden = true;
  }

  function updateQualityLabel() {
    qualityValue.textContent = `${imageQuality.value}%`;
  }

  /*
   * jsPDF is loaded by the original production architecture
   * when available. This function checks it safely.
   */
  function getJsPDF() {
    if (
      window.jspdf &&
      typeof window.jspdf.jsPDF === "function"
    ) {
      return window.jspdf.jsPDF;
    }

    if (typeof window.jsPDF === "function") {
      return window.jsPDF;
    }

    return null;
  }

  function getPageSize(size) {
    const sizes = {
      a4: {
        width: 210,
        height: 297
      },

      a3: {
        width: 297,
        height: 420
      },

      letter: {
        width: 215.9,
        height: 279.4
      },

      legal: {
        width: 215.9,
        height: 355.6
      }
    };

    return sizes[size] || sizes.a4;
  }

  function getOrientationForImage(item) {
    if (orientation.value === "portrait") {
      return "portrait";
    }

    if (orientation.value === "landscape") {
      return "landscape";
    }

    return item.image.naturalWidth >= item.image.naturalHeight
      ? "landscape"
      : "portrait";
  }

  function getCanvasForImage(item) {
    const quality = Number(imageQuality.value) / 100;

    const maxDimension = 3000;

    const originalWidth = item.image.naturalWidth;
    const originalHeight = item.image.naturalHeight;

    const scale = Math.min(
      1,
      maxDimension / Math.max(originalWidth, originalHeight)
    );

    const canvas = document.createElement("canvas");

    canvas.width = Math.max(
      1,
      Math.round(originalWidth * scale)
    );

    canvas.height = Math.max(
      1,
      Math.round(originalHeight * scale)
    );

    const ctx = canvas.getContext("2d", {
      alpha: true
    });

    if (!ctx) {
      throw new Error("Canvas is not supported.");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    /*
     * JPEG does not support transparency.
     * A white background keeps transparent images readable.
     */
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.drawImage(
      item.image,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return {
      canvas,
      quality
    };
  }

  function canvasToDataUrl(canvas, quality) {
    return canvas.toDataURL(
      "image/jpeg",
      Math.max(0.4, Math.min(1, quality))
    );
  }

  function calculateImagePlacement(
    imageWidth,
    imageHeight,
    pageWidth,
    pageHeight,
    marginValue
  ) {
    const availableWidth =
      Math.max(1, pageWidth - marginValue * 2);

    const availableHeight =
      Math.max(1, pageHeight - marginValue * 2);

    const ratio = Math.min(
      availableWidth / imageWidth,
      availableHeight / imageHeight
    );

    const width = imageWidth * ratio;
    const height = imageHeight * ratio;

    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;

    return {
      x,
      y,
      width,
      height
    };
  }

  function addImageToPdf(doc, item, addNewPage) {
    const selectedSize = pageSize.value;

    /*
     * Fit to Image creates a page matching the image ratio.
     */
    if (selectedSize === "fit") {
      const maxWidth = 210;
      const maxHeight = 297;

      const imageRatio =
        item.image.naturalWidth /
        item.image.naturalHeight;

      let pageWidth = maxWidth;
      let pageHeight = pageWidth / imageRatio;

      if (pageHeight > maxHeight) {
        pageHeight = maxHeight;
        pageWidth = pageHeight * imageRatio;
      }

      if (addNewPage) {
        doc.addPage(
          [pageWidth, pageHeight],
          pageWidth > pageHeight
            ? "landscape"
            : "portrait"
        );
      }

      const { canvas, quality } =
        getCanvasForImage(item);

      const dataUrl =
        canvasToDataUrl(canvas, quality);

      doc.addImage(
        dataUrl,
        "JPEG",
        0,
        0,
        pageWidth,
        pageHeight
      );

      return;
    }

    const size = getPageSize(selectedSize);
    const pageOrientation =
      getOrientationForImage(item);

    let pageWidth = size.width;
    let pageHeight = size.height;

    if (pageOrientation === "landscape") {
      [pageWidth, pageHeight] =
        [pageHeight, pageWidth];
    }

    if (addNewPage) {
      doc.addPage(
        [pageWidth, pageHeight],
        pageOrientation
      );
    }

    const marginValue =
      Math.max(0, Number(margin.value));

    const { canvas, quality } =
      getCanvasForImage(item);

    const dataUrl =
      canvasToDataUrl(canvas, quality);

    const placement =
      calculateImagePlacement(
        canvas.width,
        canvas.height,
        pageWidth,
        pageHeight,
        marginValue
      );

    doc.addImage(
      dataUrl,
      "JPEG",
      placement.x,
      placement.y,
      placement.width,
      placement.height,
      undefined,
      "FAST"
    );
  }

  async function generatePdf() {
    if (!images.length) {
      alert("Please add at least one image.");
      return;
    }

    const JsPDF = getJsPDF();

    if (!JsPDF) {
      alert(
        "PDF engine is not available. Please check your internet connection and reload the page."
      );
      return;
    }

    generatePdfBtn.disabled = true;
    generatePdfBtn.textContent = "Creating PDF...";

    revokePdfUrl();

    try {
      const firstImage = images[0];

      let doc;

      if (pageSize.value === "fit") {
        const ratio =
          firstImage.image.naturalWidth /
          firstImage.image.naturalHeight;

        let width = 210;
        let height = width / ratio;

        if (height > 297) {
          height = 297;
          width = height * ratio;
        }

        doc = new JsPDF({
          orientation:
            width > height
              ? "landscape"
              : "portrait",
          unit: "mm",
          format: [width, height],
          compress: true
        });
      } else {
        const size =
          getPageSize(pageSize.value);

        const firstOrientation =
          getOrientationForImage(firstImage);

        doc = new JsPDF({
          orientation: firstOrientation,
          unit: "mm",
          format: [size.width, size.height],
          compress: true
        });
      }

      /*
       * Add the first image to the first page.
       */
      addImageToPdf(
        doc,
        images[0],
        false
      );

      /*
       * Add remaining images.
       */
      for (let i = 1; i < images.length; i++) {
        addImageToPdf(
          doc,
          images[i],
          true
        );

        /*
         * Give the browser a small chance to remain responsive
         * when many images are being processed.
         */
        await new Promise((resolve) =>
          setTimeout(resolve, 0)
        );
      }

      const pdfBlob = doc.output("blob");

      pdfUrl = URL.createObjectURL(pdfBlob);

      let fileName =
        pdfFileName.value.trim() ||
        "nidar-images";

      fileName = fileName
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (!fileName) {
        fileName = "nidar-images";
      }

      if (!fileName.toLowerCase().endsWith(".pdf")) {
        fileName += ".pdf";
      }

      downloadBtn.href = pdfUrl;
      downloadBtn.download = fileName;

      const pageCount = images.length;

      resultSummary.textContent =
        `${pageCount} image${pageCount === 1 ? "" : "s"} ` +
        `converted into a PDF • ` +
        `${formatBytes(pdfBlob.size)}`;

      resultSection.hidden = false;

      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
        "Something went wrong while creating the PDF."
      );
    } finally {
      generatePdfBtn.disabled = false;
      generatePdfBtn.textContent = "Create PDF";
    }
  }

  function resetTool() {
    clearImages();

    revokePdfUrl();

    imageInput.value = "";
    pdfFileName.value = "nidar-images";

    pageSize.value = "a4";
    orientation.value = "auto";
    margin.value = "10";
    imageQuality.value = "90";
    oneImagePerPage.checked = true;

    updateQualityLabel();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* FILE SELECT */

  selectImagesBtn.addEventListener(
    "click",
    (event) => {
      event.stopPropagation();
      imageInput.click();
    }
  );

  addMoreBtn.addEventListener(
    "click",
    () => {
      imageInput.click();
    }
  );

  uploadZone.addEventListener(
    "click",
    () => {
      imageInput.click();
    }
  );

  imageInput.addEventListener(
    "change",
    () => {
      addFiles(imageInput.files);
      imageInput.value = "";
    }
  );

  /* DRAG & DROP */

  ["dragenter", "dragover"].forEach(
    (eventName) => {
      uploadZone.addEventListener(
        eventName,
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          uploadZone.classList.add(
            "drag-over"
          );
        }
      );
    }
  );

  ["dragleave", "drop"].forEach(
    (eventName) => {
      uploadZone.addEventListener(
        eventName,
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          uploadZone.classList.remove(
            "drag-over"
          );
        }
      );
    }
  );

  uploadZone.addEventListener(
    "drop",
    (event) => {
      addFiles(
        event.dataTransfer?.files
      );
    }
  );

  /* SETTINGS */

  imageQuality.addEventListener(
    "input",
    updateQualityLabel
  );

  /* ACTIONS */

  clearImagesBtn.addEventListener(
    "click",
    clearImages
  );

  generatePdfBtn.addEventListener(
    "click",
    generatePdf
  );

  resetBtn.addEventListener(
    "click",
    resetTool
  );

  window.addEventListener(
    "beforeunload",
    () => {
      images.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });

      revokePdfUrl();
    }
  );

  updateQualityLabel();

  console.log(
    "niDar Tools — Image to PDF initialized."
  );
})();
