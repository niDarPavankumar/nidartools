(function () {
  'use strict';

  // ---------- Elements ----------
  const uploadZone       = document.getElementById('uploadZone');
  const selectImageBtn   = document.getElementById('selectImageBtn');
  const imageInput       = document.getElementById('imageInput');
  const workspace         = document.getElementById('workspace');

  const originalPreview   = document.getElementById('originalPreview');
  const originalName      = document.getElementById('originalName');
  const originalSize      = document.getElementById('originalSize');
  const originalDimensions = document.getElementById('originalDimensions');

  const compressedPreview     = document.getElementById('compressedPreview');
  const compressedPlaceholder = document.getElementById('compressedPlaceholder');
  const compressedSize        = document.getElementById('compressedSize');
  const compressedDimensions  = document.getElementById('compressedDimensions');

  const quality       = document.getElementById('quality');
  const qualityValue  = document.getElementById('qualityValue');
  const outputFormat  = document.getElementById('outputFormat');
  const maxWidth      = document.getElementById('maxWidth');
  const fileName      = document.getElementById('fileName');

  const preserveMetadata = document.getElementById('preserveMetadata');
  const keepTransparency = document.getElementById('keepTransparency');

  const compressBtn   = document.getElementById('compressBtn');
  const startOverBtn  = document.getElementById('startOverBtn');

  const progressSection = document.getElementById('progressSection');
  const progressPercent = document.getElementById('progressPercent');
  const progressBar     = document.getElementById('progressBar');

  const resultSection         = document.getElementById('resultSection');
  const resultSummary         = document.getElementById('resultSummary');
  const resultOriginalSize    = document.getElementById('resultOriginalSize');
  const resultCompressedSize  = document.getElementById('resultCompressedSize');
  const savedPercentage       = document.getElementById('savedPercentage');
  const downloadBtn           = document.getElementById('downloadBtn');
  const compressAgainBtn      = document.getElementById('compressAgainBtn');

  // ---------- State ----------
  let originalFile   = null;
  let originalImg    = new Image();
  let compressedBlob = null;

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  // ---------- Helpers ----------
  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function resetWorkspace() {
    workspace.hidden = true;
    progressSection.hidden = true;
    resultSection.hidden = true;
    compressedPreview.style.display = 'none';
    compressedPlaceholder.style.display = 'block';
    compressedSize.textContent = '—';
    compressedDimensions.textContent = '—';
    imageInput.value = '';
    originalFile = null;
    compressedBlob = null;
  }

  // ---------- 1. Select / Drag & Drop ----------
  selectImageBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    imageInput.click();
  });

  uploadZone.addEventListener('click', function (e) {
    if (e.target === selectImageBtn) return;
    imageInput.click();
  });

  uploadZone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      imageInput.click();
    }
  });

  imageInput.addEventListener('change', function (e) {
    const file = e.target.files && e.target.files[0];
    if (file) handleFile(file);
  });

  ['dragover', 'dragenter'].forEach(function (evt) {
    uploadZone.addEventListener(evt, function (e) {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(function (evt) {
    uploadZone.addEventListener(evt, function (e) {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
    });
  });

  uploadZone.addEventListener('drop', function (e) {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // ---------- 2. Handle selected file ----------
  function handleFile(file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('कृपया JPG, PNG, WEBP किंवा GIF इमेज निवडा.');
      return;
    }

    originalFile = file;

    const reader = new FileReader();
    reader.onload = function (ev) {
      originalImg = new Image();
      originalImg.onload = function () {
        originalPreview.src = ev.target.result;
        originalName.textContent = file.name;
        originalSize.textContent = formatBytes(file.size);
        originalDimensions.textContent = originalImg.width + ' × ' + originalImg.height + ' px';

        workspace.hidden = false;
        resultSection.hidden = true;
        progressSection.hidden = true;
        compressedPreview.style.display = 'none';
        compressedPlaceholder.style.display = 'block';

        const baseName = file.name.replace(/\.[^/.]+$/, '');
        fileName.value = 'nidar-' + baseName;

        workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      originalImg.src = ev.target.result;
    };
    reader.onerror = function () {
      alert('इमेज वाचताना error आली. पुन्हा प्रयत्न करा.');
    };
    reader.readAsDataURL(file);
  }

  // ---------- 3. Quality slider ----------
  quality.addEventListener('input', function () {
    qualityValue.textContent = quality.value;
  });

  // ---------- 4. Compress ----------
  compressBtn.addEventListener('click', function () {
    if (!originalFile) {
      alert('आधी इमेज सिलेक्ट करा.');
      return;
    }

    progressSection.hidden = false;
    resultSection.hidden = true;
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';

    let fakeProgress = 0;
    const progressInterval = setInterval(function () {
      fakeProgress = Math.min(fakeProgress + 15, 85);
      progressBar.style.width = fakeProgress + '%';
      progressPercent.textContent = fakeProgress + '%';
    }, 80);

    setTimeout(function () {
      compressImage(function (blob, outMime) {
        clearInterval(progressInterval);
        progressBar.style.width = '100%';
        progressPercent.textContent = '100%';

        setTimeout(function () {
          progressSection.hidden = true;
          showResult(blob, outMime);
        }, 200);
      });
    }, 50);
  });

  // ---------- Real transparency detection (FIXED) ----------
  function hasTransparency(img) {
    // JPEG never has alpha; only PNG/GIF can.
    if (originalFile.type !== 'image/png' && originalFile.type !== 'image/gif') {
      return false;
    }
    const testCanvas = document.createElement('canvas');
    testCanvas.width = img.width;
    testCanvas.height = img.height;
    const ctx = testCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    try {
      const data = ctx.getImageData(0, 0, testCanvas.width, testCanvas.height).data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) return true;
      }
    } catch (e) {
      return keepTransparency.checked;
    }
    return false;
  }

  function getTargetMime() {
    const chosen = outputFormat.value;
    if (chosen !== 'auto') return chosen;

    // Auto: only use PNG if the image truly has transparent pixels
    // AND the user wants to keep transparency. Otherwise always JPEG
    // (JPEG re-encodes photos far smaller than lossless PNG).
    if (keepTransparency.checked && hasTransparency(originalImg)) {
      return 'image/png';
    }
    return 'image/jpeg';
  }

  function compressImage(callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let targetW = originalImg.width;
    let targetH = originalImg.height;

    const chosenMaxWidth = maxWidth.value;
    if (chosenMaxWidth !== 'original') {
      const mw = parseInt(chosenMaxWidth, 10);
      if (targetW > mw) {
        const ratio = mw / targetW;
        targetW = mw;
        targetH = Math.round(targetH * ratio);
      }
    }

    canvas.width = targetW;
    canvas.height = targetH;

    const outMime = getTargetMime();

    if (outMime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    ctx.drawImage(originalImg, 0, 0, targetW, targetH);

    const q = parseInt(quality.value, 10) / 100;

    canvas.toBlob(function (blob) {
      callback(blob, outMime);
    }, outMime, q);
  }

  // ---------- 5. Show result ----------
  function showResult(blob, outMime) {
    compressedBlob = blob;

    const url = URL.createObjectURL(blob);
    compressedPreview.src = url;
    compressedPreview.style.display = 'block';
    compressedPlaceholder.style.display = 'none';

    const img = new Image();
    img.onload = function () {
      compressedDimensions.textContent = img.width + ' × ' + img.height + ' px';
    };
    img.src = url;

    compressedSize.textContent = formatBytes(blob.size);

    resultOriginalSize.textContent = formatBytes(originalFile.size);
    resultCompressedSize.textContent = formatBytes(blob.size);

    const savedBytes = originalFile.size - blob.size;
    const savedPct = originalFile.size > 0
      ? Math.round((savedBytes / originalFile.size) * 100)
      : 0;
    savedPercentage.textContent = savedPct + '%';

    if (blob.size >= originalFile.size) {
      resultSummary.textContent = 'ही सेटिंग्ज मूळ फाईलपेक्षा मोठी फाईल तयार करत आहेत — Quality कमी करा किंवा Format JPG निवडा.';
    } else {
      resultSummary.textContent = 'तुमची इमेज ' + savedPct + '% ने compress झाली आहे.';
    }

    const ext = outMime === 'image/png' ? '.png'
              : outMime === 'image/webp' ? '.webp'
              : '.jpg';

    const finalName = (fileName.value.trim() || 'nidar-compressed') + ext;

    downloadBtn.href = url;
    downloadBtn.setAttribute('download', finalName);

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- 6. Reset buttons ----------
  startOverBtn.addEventListener('click', function () {
    resetWorkspace();
    uploadZone.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  compressAgainBtn.addEventListener('click', function () {
    resultSection.hidden = true;
    workspace.querySelector('.step-heading').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

})();
