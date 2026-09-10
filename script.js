(function () {
  'use strict';

  const uploadZone = document.getElementById('uploadZone');
  const selectImageBtn = document.getElementById('selectImageBtn');
  const imageInput = document.getElementById('imageInput');

  const workspace = document.getElementById('workspace');
  const settingsSection = document.getElementById('settingsSection');
  const processSection = document.getElementById('processSection');
  const progressSection = document.getElementById('progressSection');
  const resultSection = document.getElementById('resultSection');

  const originalPreview = document.getElementById('originalPreview');
  const originalPlaceholder = document.getElementById('originalPlaceholder');
  const originalName = document.getElementById('originalName');
  const originalDimensions = document.getElementById('originalDimensions');

  const resultPreview = document.getElementById('resultPreview');
  const resultPlaceholder = document.getElementById('resultPlaceholder');
  const resultDimensions = document.getElementById('resultDimensions');
  const resultSize = document.getElementById('resultSize');

  const backgroundMode = document.getElementById('backgroundMode');
  const outputFormat = document.getElementById('outputFormat');
  const outputQuality = document.getElementById('outputQuality');

  const removeBackgroundBtn = document.getElementById('removeBackgroundBtn');
  const processAgainBtn = document.getElementById('processAgainBtn');
  const startOverBtn = document.getElementById('startOverBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  const progressPercent = document.getElementById('progressPercent');
  const progressBar = document.getElementById('progressBar');
  const progressMessage = document.getElementById('progressMessage');
  const processMessage = document.getElementById('processMessage');
  const resultSummary = document.getElementById('resultSummary');

  let originalFile = null;
  let originalImage = null;
  let resultBlob = null;
  let resultUrl = null;

  const MAX_FILE_SIZE = 20 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_PROCESS_DIMENSION = 2000; // कमाल रुंदी/उंची, यापेक्षा मोठे फोटो प्रोसेसिंगआधी छोटे होतील

  /* =========================================================
     HELPERS
     ========================================================= */

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function getScaledDimensions(width, height, maxDimension) {
    if (width <= maxDimension && height <= maxDimension) {
      return { width: width, height: height };
    }

    const scale = maxDimension / Math.max(width, height);

    return {
      width: Math.round(width * scale),
      height: Math.round(height * scale)
    };
  }

  function cleanupResultUrl() {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      resultUrl = null;
    }
  }

  function resetResultPreview() {
    cleanupResultUrl();
    resultBlob = null;

    resultPreview.removeAttribute('src');
    resultPreview.style.display = 'none';
    resultPlaceholder.style.display = 'block';

    resultDimensions.textContent = '—';
    resultSize.textContent = '—';

    resultSection.hidden = true;
  }

  function hideWorkspace() {
    workspace.hidden = true;
    settingsSection.hidden = true;
    processSection.hidden = true;
    progressSection.hidden = true;
    resultSection.hidden = true;
  }

  function showWorkspace() {
    workspace.hidden = false;
    settingsSection.hidden = false;
    processSection.hidden = false;
  }

  function updateProgress(percent, message) {
    const safePercent = Math.max(0, Math.min(100, percent));
    progressPercent.textContent = Math.round(safePercent) + '%';
    progressBar.style.width = safePercent + '%';
    if (message) progressMessage.textContent = message;
  }

  function resetAll() {
    originalFile = null;
    originalImage = null;

    cleanupResultUrl();
    resultBlob = null;

    imageInput.value = '';

    originalPreview.removeAttribute('src');
    originalPreview.style.display = 'none';
    originalPlaceholder.style.display = 'block';
    originalName.textContent = 'Image';
    originalDimensions.textContent = '0 × 0 px';

    resetResultPreview();
    hideWorkspace();

    backgroundMode.value = 'transparent';
    outputFormat.value = 'png';
    outputQuality.value = '0.9';

    uploadZone.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* =========================================================
     FILE READER / IMAGE LOADER
     ========================================================= */

  function readFileAsDataURL(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error('Unable to read the selected image.')); };
      reader.readAsDataURL(file);
    });
  }

  function loadImage(dataUrl) {
    return new Promise(function (resolve, reject) {
      const img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('Unable to load the image.')); };
      img.src = dataUrl;
    });
  }

  /* =========================================================
     FILE VALIDATION
     ========================================================= */

  function validateFile(file) {
    if (!file) return false;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Please select a JPG, JPEG, PNG or WEBP image.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('Image size must be 20 MB or less.');
      return false;
    }

    return true;
  }

  /* =========================================================
     HANDLE FILE
     ========================================================= */

  async function handleFile(file) {
    if (!validateFile(file)) return;

    try {
      originalFile = file;
      resetResultPreview();

      const dataUrl = await readFileAsDataURL(file);
      originalImage = await loadImage(dataUrl);

      originalPreview.src = dataUrl;
      originalPreview.style.display = 'block';
      originalPlaceholder.style.display = 'none';

      originalName.textContent = file.name;
      originalDimensions.textContent =
        originalImage.naturalWidth + ' × ' + originalImage.naturalHeight + ' px';

      processMessage.textContent = 'Your image is ready for background removal.';

      showWorkspace();
      workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error(error);
      alert('There was a problem loading the image. Please try another image.');
      resetAll();
    }
  }

  /* =========================================================
     SELECT / DRAG & DROP
     ========================================================= */

  selectImageBtn.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    imageInput.click();
  });

  uploadZone.addEventListener('click', function (event) {
    if (event.target === selectImageBtn) return;
    imageInput.click();
  });

  uploadZone.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      imageInput.click();
    }
  });

  imageInput.addEventListener('change', function (event) {
    const file = event.target.files && event.target.files[0];
    if (file) handleFile(file);
  });

  ['dragover', 'dragenter'].forEach(function (eventName) {
    uploadZone.addEventListener(eventName, function (event) {
      event.preventDefault();
      uploadZone.classList.add('drag-over');
    });
  });

  uploadZone.addEventListener('dragleave', function (event) {
    event.preventDefault();
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', function (event) {
    event.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  /* =========================================================
     AI SEGMENTATION (MediaPipe Selfie Segmentation)
     ========================================================= */

  let segmenterInstance = null;

  function getSegmenter() {
    if (segmenterInstance) return segmenterInstance;

    if (typeof SelfieSegmentation === 'undefined') {
      throw new Error(
        'AI background removal model failed to load. Please check your internet connection and try again.'
      );
    }

    segmenterInstance = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
    });

    segmenterInstance.setOptions({
      modelSelection: 1
    });

    return segmenterInstance;
  }

  function runSegmentation(image) {
    return new Promise((resolve, reject) => {
      try {
        const segmenter = getSegmenter();

        segmenter.onResults((results) => {
          resolve(results.segmentationMask);
        });

        segmenter.send({ image: image }).catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  /* =========================================================
     CANVAS PROCESSING (AI-based, resized + edge-smoothed)
     ========================================================= */

  async function createProcessedCanvas() {
    if (!originalImage) {
      throw new Error('No image loaded.');
    }

    const scaled = getScaledDimensions(
      originalImage.naturalWidth,
      originalImage.naturalHeight,
      MAX_PROCESS_DIMENSION
    );

    const width = scaled.width;
    const height = scaled.height;

    const mask = await runSegmentation(originalImage);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas is not supported by this browser.');
    }

    ctx.drawImage(originalImage, 0, 0, width, height);

    ctx.globalCompositeOperation = 'destination-in';
    ctx.filter = 'blur(1.5px)';
    ctx.drawImage(mask, 0, 0, width, height);
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'source-over';

    const mode = backgroundMode.value;

    if (mode === 'white' || mode === 'black') {
      const bgCanvas = document.createElement('canvas');
      bgCanvas.width = width;
      bgCanvas.height = height;

      const bgCtx = bgCanvas.getContext('2d');
      bgCtx.fillStyle = mode === 'white' ? '#ffffff' : '#000000';
      bgCtx.fillRect(0, 0, width, height);
      bgCtx.drawImage(canvas, 0, 0);

      return bgCanvas;
    }

    return canvas;
  }

  /* =========================================================
     EXPORT CANVAS
     ========================================================= */

  function canvasToBlob(canvas) {
    return new Promise(function (resolve, reject) {
      const format = outputFormat.value === 'webp' ? 'image/webp' : 'image/png';
      const quality = parseFloat(outputQuality.value);

      canvas.toBlob(function (blob) {
        if (!blob) {
          reject(new Error('Unable to create output image.'));
          return;
        }
        resolve(blob);
      }, format, quality);
    });
  }

  /* =========================================================
     PROCESS IMAGE
     ========================================================= */

  async function processImage() {
    if (!originalFile || !originalImage) {
      alert('Please select an image first.');
      return;
    }

    progressSection.hidden = false;
    resultSection.hidden = true;
    removeBackgroundBtn.disabled = true;

    updateProgress(5, 'Preparing image...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      updateProgress(25, 'Loading AI model...');

      await new Promise((resolve) => setTimeout(resolve, 100));
      updateProgress(50, 'Analyzing image...');

      const canvas = await createProcessedCanvas();

      updateProgress(85, 'Creating final image...');

      const blob = await canvasToBlob(canvas);

      updateProgress(100, 'Processing complete.');

      showResult(blob, canvas.width, canvas.height);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Unable to process this image. Please try again.');
    } finally {
      removeBackgroundBtn.disabled = false;
      setTimeout(function () {
        progressSection.hidden = true;
      }, 300);
    }
  }

  removeBackgroundBtn.addEventListener('click', processImage);

  /* =========================================================
     SHOW RESULT
     ========================================================= */

  function showResult(blob, width, height) {
    cleanupResultUrl();
    resultBlob = blob;
    resultUrl = URL.createObjectURL(blob);

    resultPreview.src = resultUrl;
    resultPreview.style.display = 'block';
    resultPlaceholder.style.display = 'none';

    resultDimensions.textContent = width + ' × ' + height + ' px';
    resultSize.textContent = formatBytes(blob.size);

    const extension = outputFormat.value === 'webp' ? 'webp' : 'png';
    const background = backgroundMode.value;

    downloadBtn.href = resultUrl;
    downloadBtn.download = 'nidar-background-removed-' + background + '.' + extension;

    resultSummary.textContent =
      'Your processed image is ready to download as a ' + extension.toUpperCase() + ' file.';

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* =========================================================
     RESULT ACTIONS
     ========================================================= */

  processAgainBtn.addEventListener('click', function () {
    processImage();
  });

  startOverBtn.addEventListener('click', function () {
    resetAll();
  });

})();
