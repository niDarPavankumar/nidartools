/* =========================================================
   niDar Tools — Image Resizer & Compressor Engine
   ========================================================= */

(() => {
  "use strict";

  // HTML मधील सर्व तत्त्वे (Elements) अचूक आयडीद्वारे कॅप्चर करणे
  const fileInput = document.getElementById("fileInput");
  const uploadZone = document.getElementById("uploadZone");
  const previewWrap = document.getElementById("previewWrap");
  const previewImg = document.getElementById("previewImg");
  const resetBtn = document.getElementById("resetBtn");
  const settingsSection = document.getElementById("settingsSection");

  const infoOrigSize = document.getElementById("infoOrigSize");
  const infoOrigDim = document.getElementById("infoOrigDim");

  const sizePreset = document.getElementById("sizePreset");
  const unitSelect = document.getElementById("unitSelect");
  const imgWidth = document.getElementById("imgWidth");
  const imgHeight = document.getElementById("imgHeight");
  const aspectRatioCheckbox = document.getElementById("aspectRatio");

  const fileSizeVal = document.getElementById("fileSizeVal");
  const fileSizeUnit = document.getElementById("fileSizeUnit");
  const formatSelect = document.getElementById("formatSelect");
  const sizeWarning = document.getElementById("sizeWarning");

  const fitMode = document.getElementById("fitMode");
  const bgType = document.getElementById("bgType");
  const bgColorContainer = document.getElementById("bgColorContainer");
  const bgColor = document.getElementById("bgColor");

  const rotateLeftBtn = document.getElementById("rotateLeftBtn");
  const rotateRightBtn = document.getElementById("rotateRightBtn");
  const flipBtn = document.getElementById("flipBtn");

  const brightness = document.getElementById("brightness");
  const brightnessVal = document.getElementById("brightnessVal");
  const contrast = document.getElementById("contrast");
  const contrastVal = document.getElementById("contrastVal");

  const processBtn = document.getElementById("processBtn");
  const loadingSpinner = document.getElementById("loadingSpinner");

  const resultCard = document.getElementById("resultCard");
  const newFileSize = document.getElementById("newFileSize");
  const downloadBtn = document.getElementById("downloadBtn");
  const newImageBtn = document.getElementById("newImageBtn");

  // ग्लोबल व्हेरिएबल्स
  let originalImage = null;
  let loadedFile = null;
  let rotation = 0; // 0, 90, 180, 270
  let flipped = false; // true किंवा false
  let originalAspectRatio = 1;
  let processedBlob = null;

  // युटिलिटी फंक्शन्स
  function show(el) { if (el) el.classList.remove("hidden"); }
  function hide(el) { if (el) el.classList.add("hidden"); }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  // १. इमेज फाईल लोड करून प्रीव्ह्यू दाखवणे
  function loadFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      alert("कृपया वैध (Valid) इमेज फाईल निवडा.");
      return;
    }

    loadedFile = file;
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        originalImage = img;
        originalAspectRatio = img.naturalWidth / img.naturalHeight;

        // इनपुट बॉक्समध्ये मूळ डायमेंशन्स सेट करणे
        if (imgWidth) imgWidth.value = img.naturalWidth;
        if (imgHeight) imgHeight.value = img.naturalHeight;

        if (previewImg) {
          previewImg.src = e.target.result;
        }

        if (infoOrigSize) infoOrigSize.textContent = formatBytes(file.size);
        if (infoOrigDim) infoOrigDim.textContent = `${img.naturalWidth} × ${img.naturalHeight}px`;

        // UI सेक्शन दाखवणे/लपवणे
        hide(uploadZone);
        show(previewWrap);
        show(settingsSection);
        hide(resultCard);

        updatePreviewStyle();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // फाईल इनपुट इव्हेंट
  fileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  });

  // ड्रॅग आणि ड्रॉप सपोर्ट
  uploadZone?.addEventListener("dragover", (e) => { e.preventDefault(); });
  uploadZone?.addEventListener("drop", (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) loadFile(file);
  });

  // 'Change' / 'Reset' बटण दाबल्यावर पुन्हा अपलोड मोडवर जाणे
  resetBtn?.addEventListener("click", () => {
    fileInput.value = "";
    originalImage = null;
    loadedFile = null;
    rotation = 0;
    flipped = false;
    hide(previewWrap);
    hide(settingsSection);
    hide(resultCard);
    show(uploadZone);
  });

  newImageBtn?.addEventListener("click", () => {
    resetBtn.click();
  });

  // २. साईझ प्रेझेट्स हँडल करणे (Passport / ID Presets)
  sizePreset?.addEventListener("change", () => {
    const val = sizePreset.value;
    if (val === "custom") return;

    if (unitSelect) unitSelect.value = "cm"; // डीफॉल्ट युनिट सेंटीमीटर

    if (val === "3.5x4.5") {
      if (imgWidth) imgWidth.value = "3.5";
      if (imgHeight) imgHeight.value = "4.5";
    } else if (val === "2.5x3.5") {
      if (imgWidth) imgWidth.value = "2.5";
      if (imgHeight) imgHeight.value = "3.5";
    } else if (val === "2x2in") {
      if (unitSelect) unitSelect.value = "in";
      if (imgWidth) imgWidth.value = "2";
      if (imgHeight) imgHeight.value = "2";
    } else if (val === "35x45mm") {
      if (unitSelect) unitSelect.value = "mm";
      if (imgWidth) imgWidth.value = "35";
      if (imgHeight) imgHeight.value = "45";
    }
  });

  // ३. आस्पेक्ट रेशो (Maintain Aspect Ratio) लॉजिक
  imgWidth?.addEventListener("input", () => {
    if (aspectRatioCheckbox?.checked && originalImage) {
      const w = parseFloat(imgWidth.value) || 0;
      if (rotation % 180 !== 0) {
        imgHeight.value = (w / originalAspectRatio).toFixed(1);
      } else {
        imgHeight.value = (w / originalAspectRatio).toFixed(1);
      }
    }
  });

  imgHeight?.addEventListener("input", () => {
    if (aspectRatioCheckbox?.checked && originalImage) {
      const h = parseFloat(imgHeight.value) || 0;
      imgWidth.value = (h * originalAspectRatio).toFixed(1);
    }
  });

  // ४. ब्राइटनेस आणि कॉन्ट्रास्ट स्लाइडर व्ह्यू अपडेट
  brightness?.addEventListener("input", () => {
    if (brightnessVal) brightnessVal.textContent = brightness.value;
    updatePreviewStyle();
  });

  contrast?.addEventListener("input", () => {
    if (contrastVal) contrastVal.textContent = contrast.value;
    updatePreviewStyle();
  });

  // ५. रोटेट आणि फ्लिप बटन्स (ज्यामुळे Flip Btn ह, 100% काम करेल)
  rotateLeftBtn?.addEventListener("click", () => {
    rotation = (rotation - 90 + 360) % 360;
    updatePreviewStyle();
  });

  rotateRightBtn?.addEventListener("click", () => {
    rotation = (rotation + 90) % 360;
    updatePreviewStyle();
  });

  flipBtn?.addEventListener("click", () => {
    flipped = !flipped;
    updatePreviewStyle();
  });

  // प्रीव्ह्यू इमेजचे CSS ट्रान्सफॉर्मेशन अपडेट करणे
  function updatePreviewStyle() {
    if (!previewImg) return;
    const bVal = brightness ? brightness.value : 100;
    const cVal = contrast ? contrast.value : 100;
    previewImg.style.transform = `rotate(${rotation}deg) scaleX(${flipped ? -1 : 1})`;
    previewImg.style.filter = `brightness(${bVal}%) contrast(${cVal}%)`;
  }

  // पार्श्वभूमी प्रकार (Background Type) नुसार कलर पिकर टॉगल करणे
  bgType?.addEventListener("change", () => {
    if (bgType.value === "custom") {
      show(bgColorContainer);
    } else {
      hide(bgColorContainer);
    }
  });

  // ६. मुख्य इंजिन: पिक्सेलमध्ये रूपांतर करून कॅन्व्हासवर अचूक प्रक्रिया करणे
  function getTargetDimensions() {
    let w = parseFloat(imgWidth.value) || (originalImage ? originalImage.naturalWidth : 100);
    let h = parseFloat(imgHeight.value) || (originalImage ? originalImage.naturalHeight : 100);
    const unit = unitSelect ? unitSelect.value : "px";

    // युनिटनुसार पिक्सेलमध्ये कन्व्हर्ट करणे (96 DPI मानक धरून)
    if (unit === "cm") {
      w = Math.round(w * 37.795);
      h = Math.round(h * 37.795);
    } else if (unit === "mm") {
      w = Math.round(w * 3.7795);
      h = Math.round(h * 3.7795);
    } else if (unit === "in") {
      w = Math.round(w * 96);
      h = Math.round(h * 96);
    }
    return { width: Math.max(10, Math.round(w)), height: Math.max(10, Math.round(h)) };
  }

  // ७. 'Resize & Compress' बटण कार्यप्रणाली
  processBtn?.addEventListener("click", () => {
    if (!originalImage) {
      alert("कृपया आधी इमेज अपलोड करा!");
      return;
    }

    if (loadingSpinner) show(loadingSpinner);
    processBtn.disabled = true;

    setTimeout(() => {
      try {
        const { width: targetWidth, height: targetHeight } = getTargetDimensions();

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        // पार्श्वभूमी रंग ठरवणे
        let bgCode = "#FFFFFF";
        const bType = bgType ? bgType.value : "none";
        if (bType === "white") bgCode = "#FFFFFF";
        else if (bType === "lightblue") bgCode = "#ADD8E6";
        else if (bType === "lightgrey") bgCode = "#D3D3D3";
        else if (bType === "red") bgCode = "#FF0000";
        else if (bType === "custom" && bgColor) bgCode = bgColor.value;

        ctx.clearRect(0, 0, targetWidth, targetHeight);
        if (bType !== "transparent" && bType !== "none") {
          ctx.fillStyle = bgCode;
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.save();
        // कॅन्व्हासच्या सेंटरमध्ये ट्रान्सलेट करून रोटेशन व फ्लिप लागू करणे
        ctx.translate(targetWidth / 2, targetHeight / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        if (flipped) {
          ctx.scale(-1, 1);
        }

        // ब्राइटनेस आणि कॉन्ट्रास्ट फिल्टर्स
        const bVal = brightness ? brightness.value : 100;
        const cVal = contrast ? contrast.value : 100;
        ctx.filter = `brightness(${bVal}%) contrast(${cVal}%)`;

        const isRotated90 = rotation % 180 !== 0;
        const dWidth = isRotated90 ? targetHeight : targetWidth;
        const dHeight = isRotated90 ? targetWidth : targetHeight;

        // Fit किंवा Fill (Cover) मोड लागू करणे (काळी बॉर्डर किंवा रिकामी जागा येऊ नये म्हणून)
        const fMode = fitMode ? fitMode.value : "fill";
        if (fMode === "fit") {
          drawImageContain(ctx, originalImage, dWidth, dHeight);
        } else {
          drawImageCover(ctx, originalImage, dWidth, dHeight);
        }

        ctx.restore();

        // फॉरमॅट आणि कॉम्प्रेसन गुणवत्ता (Quality)
        const formatChoice = formatSelect ? formatSelect.value : "jpeg";
        const mimeType = formatChoice === "png" ? "image/png" : "image/jpeg";

        // फाईल साईझ टार्गेटनुसार गुणवत्ता अ‍ॅडजस्ट करणे
        let quality = 0.90;
        const targetSizeInput = parseFloat(fileSizeVal?.value) || 50;
        const targetUnit = fileSizeUnit?.value || "kb";
        let targetBytes = targetSizeInput * 1024;
        if (targetUnit === "mb") targetBytes *= 1024;

        // कॉलबॅकद्वारे आऊटपुट जनरेट करणे
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error("इमेज प्रोसेस करण्यात अयशस्वी.");
          }
          processedBlob = blob;

          if (newFileSize) newFileSize.textContent = formatBytes(blob.size);

          if (loadingSpinner) hide(loadingSpinner);
          processBtn.disabled = false;
          show(resultCard);

          // स्क्रोल करून परिणाम दाखवणे
          resultCard.scrollIntoView({ behavior: "smooth" });
        }, mimeType, quality);

      } catch (err) {
        console.error(err);
        alert("प्रोसेस करताना काही त्रुटी आली.");
        if (loadingSpinner) hide(loadingSpinner);
        processBtn.disabled = false;
      }
    }, 100);
  });

  // इमेज Contain मोडमध्ये काढणे (Fit)
  function drawImageContain(ctx, img, tWidth, tHeight) {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const targetRatio = tWidth / tHeight;
    let w = tWidth;
    let h = tHeight;

    if (imgRatio > targetRatio) {
      h = tWidth / imgRatio;
    } else {
      w = tHeight * imgRatio;
    }
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  }

  // इमेज Cover मोडमध्ये काढणे (Fill - काळ्या बॉर्डर टाळण्यासाठी)
  function drawImageCover(ctx, img, tWidth, tHeight) {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const targetRatio = tWidth / tHeight;
    let w = tWidth;
    let h = tHeight;

    if (imgRatio > targetRatio) {
      w = tHeight * imgRatio;
    } else {
      h = tWidth / imgRatio;
    }
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  }

  // ८. डाऊनलोड बटण कार्यप्रणाली
  downloadBtn?.addEventListener("click", () => {
    if (!processedBlob) return;
    const url = URL.createObjectURL(processedBlob);
    const link = document.createElement("a");
    const ext = formatSelect?.value === "png" ? "png" : "jpg";
    link.download = `resized-image-${Date.now()}.${ext}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  });

})();
