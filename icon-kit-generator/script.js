(function () {
  'use strict';

  /* =======================================================
     niDar Tools
     Favicon & Icon Kit Generator
     Client-side JavaScript
     ======================================================= */

  // -------------------------------------------------------
  // ELEMENTS
  // -------------------------------------------------------

  const uploadZone = document.getElementById('uploadZone');
  const selectImageBtn = document.getElementById('selectImageBtn');
  const imageInput = document.getElementById('imageInput');
  const workspace = document.getElementById('workspace');

  const originalPreview = document.getElementById('originalPreview');
  const originalName = document.getElementById('originalName');
  const originalSize = document.getElementById('originalSize');
  const originalDimensions = document.getElementById('originalDimensions');

  const faviconPreview = document.getElementById('faviconPreview');
  const faviconPlaceholder = document.getElementById('faviconPlaceholder');
  const faviconPreviewImage = document.getElementById('faviconPreviewImage');

  const backgroundMode = document.getElementById('backgroundMode');
  const customBackgroundGroup = document.getElementById('customBackgroundGroup');
  const backgroundColor = document.getElementById('backgroundColor');
  const backgroundColorValue = document.getElementById('backgroundColorValue');

  const imageFit = document.getElementById('imageFit');
  const cornerStyle = document.getElementById('cornerStyle');
  const iconName = document.getElementById('iconName');

  const iconQuality = document.getElementById('iconQuality');
  const iconQualityValue = document.getElementById('iconQualityValue');

  const generateAppleTouchIcon =
    document.getElementById('generateAppleTouchIcon');

  const generateAndroidIcons =
    document.getElementById('generateAndroidIcons');

  const generateLargeIcons =
    document.getElementById('generateLargeIcons');

  const generateSvg =
    document.getElementById('generateSvg');

  const generateBtn =
    document.getElementById('generateBtn');

  const startOverBtn =
    document.getElementById('startOverBtn');

  const progressSection =
    document.getElementById('progressSection');

  const progressPercent =
    document.getElementById('progressPercent');

  const progressBar =
    document.getElementById('progressBar');

  const resultSection =
    document.getElementById('resultSection');

  const resultSummary =
    document.getElementById('resultSummary');

  const generatedGrid =
    document.getElementById('generatedGrid');

  const downloadAllBtn =
    document.getElementById('downloadAllBtn');

  const generateAgainBtn =
    document.getElementById('generateAgainBtn');


  // -------------------------------------------------------
  // STATE
  // -------------------------------------------------------

  let originalFile = null;
  let originalImage = null;
  let generatedFiles = [];

  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];


  // -------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------

  function formatBytes(bytes) {
    if (bytes < 1024) {
      return bytes + ' B';
    }

    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }

    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }


  function safeFileName(name) {
    return String(name || 'nidar-favicon')
      .trim()
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 70) || 'nidar-favicon';
  }


  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }


  function setProgress(value) {
    const percent = Math.max(
      0,
      Math.min(100, Math.round(value))
    );

    progressBar.style.width = percent + '%';
    progressPercent.textContent = percent + '%';
  }


  function showElement(element) {
    if (element) {
      element.hidden = false;
    }
  }


  function hideElement(element) {
    if (element) {
      element.hidden = true;
    }
  }


  function revokeGeneratedUrls() {
    generatedFiles.forEach(function (item) {
      if (item.url) {
        URL.revokeObjectURL(item.url);
      }
    });
  }


  // -------------------------------------------------------
  // BACKGROUND SETTINGS
  // -------------------------------------------------------

  function getBackgroundColor() {
    const mode = backgroundMode.value;

    if (mode === 'white') {
      return '#ffffff';
    }

    if (mode === 'black') {
      return '#000000';
    }

    if (mode === 'custom') {
      return backgroundColor.value || '#ffffff';
    }

    return null;
  }


  function updateBackgroundControls() {
    if (!backgroundMode || !customBackgroundGroup) {
      return;
    }

    if (backgroundMode.value === 'custom') {
      customBackgroundGroup.hidden = false;
    } else {
      customBackgroundGroup.hidden = true;
    }

    updateFaviconPreview();
  }


  function updateBackgroundColorLabel() {
    if (!backgroundColor || !backgroundColorValue) {
      return;
    }

    backgroundColorValue.textContent =
      backgroundColor.value.toUpperCase();

    updateFaviconPreview();
  }


  // -------------------------------------------------------
  // CANVAS DRAWING
  // -------------------------------------------------------

  function drawImageToCanvas(size) {
    if (!originalImage) {
      throw new Error('Original image is not available.');
    }

    const canvas = document.createElement('canvas');

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d', {
      alpha: true
    });

    if (!ctx) {
      throw new Error('Canvas is not supported by this browser.');
    }

    ctx.clearRect(
      0,
      0,
      size,
      size
    );


    // Background
    const bgColor = getBackgroundColor();

    if (bgColor) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(
        0,
        0,
        size,
        size
      );
    }


    // Corner clipping
    const corner = cornerStyle.value;

    if (corner === 'rounded') {
      const radius = size * 0.16;

      ctx.save();

      ctx.beginPath();

      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(
        size,
        0,
        size,
        radius
      );

      ctx.lineTo(
        size,
        size - radius
      );

      ctx.quadraticCurveTo(
        size,
        size,
        size - radius,
        size
      );

      ctx.lineTo(
        radius,
        size
      );

      ctx.quadraticCurveTo(
        0,
        size,
        0,
        size - radius
      );

      ctx.lineTo(
        0,
        radius
      );

      ctx.quadraticCurveTo(
        0,
        0,
        radius,
        0
      );

      ctx.closePath();
      ctx.clip();
    }


    if (corner === 'circle') {
      ctx.save();

      ctx.beginPath();

      ctx.arc(
        size / 2,
        size / 2,
        size / 2,
        0,
        Math.PI * 2
      );

      ctx.closePath();
      ctx.clip();
    }


    // Image fitting
    const imgW = originalImage.naturalWidth ||
      originalImage.width;

    const imgH = originalImage.naturalHeight ||
      originalImage.height;

    let drawW;
    let drawH;
    let offsetX;
    let offsetY;

    if (imageFit.value === 'cover') {

      const scale = Math.max(
        size / imgW,
        size / imgH
      );

      drawW = imgW * scale;
      drawH = imgH * scale;

      offsetX = (size - drawW) / 2;
      offsetY = (size - drawH) / 2;

    } else {

      const padding = size * 0.08;

      const available = size - (padding * 2);

      const scale = Math.min(
        available / imgW,
        available / imgH
      );

      drawW = imgW * scale;
      drawH = imgH * scale;

      offsetX = (size - drawW) / 2;
      offsetY = (size - drawH) / 2;
    }


    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      originalImage,
      offsetX,
      offsetY,
      drawW,
      drawH
    );


    if (
      corner === 'rounded' ||
      corner === 'circle'
    ) {
      ctx.restore();
    }


    return canvas;
  }


  // -------------------------------------------------------
  // LIVE FAVICON PREVIEW
  // -------------------------------------------------------

  function updateFaviconPreview() {
    if (!originalImage || !faviconPreviewImage) {
      return;
    }

    try {

      const canvas = drawImageToCanvas(256);

      const dataUrl = canvas.toDataURL(
        'image/png'
      );

      faviconPreviewImage.src = dataUrl;
      faviconPreviewImage.hidden = false;

      if (faviconPlaceholder) {
        faviconPlaceholder.style.display = 'none';
      }

    } catch (error) {
      console.error(
        'Preview error:',
        error
      );
    }
  }


  // -------------------------------------------------------
  // FILE SELECTION
  // -------------------------------------------------------

  function handleFile(file) {

    if (!file) {
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {

      alert(
        'कृपया JPG, JPEG, PNG किंवा WEBP इमेज निवडा.'
      );

      return;
    }


    if (file.size > 100 * 1024 * 1024) {

      alert(
        'कृपया 100 MB पेक्षा लहान इमेज निवडा.'
      );

      return;
    }


    originalFile = file;


    const reader = new FileReader();


    reader.onload = function (event) {

      const dataUrl = event.target.result;

      originalImage = new Image();


      originalImage.onload = function () {

        originalPreview.src = dataUrl;

        originalName.textContent =
          file.name;

        originalSize.textContent =
          formatBytes(file.size);

        originalDimensions.textContent =
          originalImage.naturalWidth +
          ' × ' +
          originalImage.naturalHeight +
          ' px';


        const baseName =
          file.name.replace(
            /\.[^/.]+$/,
            ''
          );

        iconName.value =
          'nidar-' + safeFileName(baseName);


        showElement(workspace);

        hideElement(resultSection);
        hideElement(progressSection);


        generatedGrid.innerHTML = '';

        generatedFiles = [];


        updateFaviconPreview();


        workspace.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      };


      originalImage.onerror = function () {

        alert(
          'इमेज load करता आली नाही. कृपया दुसरी इमेज वापरा.'
        );

        originalImage = null;
      };


      originalImage.src = dataUrl;

    };


    reader.onerror = function () {

      alert(
        'इमेज वाचताना error आली. पुन्हा प्रयत्न करा.'
      );

    };


    reader.readAsDataURL(file);
  }


  // -------------------------------------------------------
  // UPLOAD EVENTS
  // -------------------------------------------------------

  selectImageBtn.addEventListener(
    'click',
    function (event) {

      event.preventDefault();
      event.stopPropagation();

      imageInput.click();
    }
  );


  uploadZone.addEventListener(
    'click',
    function (event) {

      if (event.target === selectImageBtn) {
        return;
      }

      imageInput.click();
    }
  );


  uploadZone.addEventListener(
    'keydown',
    function (event) {

      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {

        event.preventDefault();

        imageInput.click();
      }
    }
  );


  imageInput.addEventListener(
    'change',
    function (event) {

      const file =
        event.target.files &&
        event.target.files[0];

      if (file) {
        handleFile(file);
      }
    }
  );


  ['dragenter', 'dragover'].forEach(
    function (eventName) {

      uploadZone.addEventListener(
        eventName,
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          uploadZone.classList.add(
            'drag-over'
          );
        }
      );
    }
  );


  ['dragleave', 'drop'].forEach(
    function (eventName) {

      uploadZone.addEventListener(
        eventName,
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          uploadZone.classList.remove(
            'drag-over'
          );
        }
      );
    }
  );


  uploadZone.addEventListener(
    'drop',
    function (event) {

      const files =
        event.dataTransfer &&
        event.dataTransfer.files;

      if (files && files[0]) {
        handleFile(files[0]);
      }
    }
  );


  // -------------------------------------------------------
  // SETTINGS EVENTS
  // -------------------------------------------------------

  backgroundMode.addEventListener(
    'change',
    updateBackgroundControls
  );


  backgroundColor.addEventListener(
    'input',
    updateBackgroundColorLabel
  );


  imageFit.addEventListener(
    'change',
    updateFaviconPreview
  );


  cornerStyle.addEventListener(
    'change',
    updateFaviconPreview
  );


  iconQuality.addEventListener(
    'input',
    function () {

      iconQualityValue.textContent =
        iconQuality.value;
    }
  );


  // -------------------------------------------------------
  // CANVAS → BLOB
  // -------------------------------------------------------

  function canvasToBlob(
    canvas,
    mimeType,
    quality
  ) {

    return new Promise(
      function (resolve, reject) {

        canvas.toBlob(
          function (blob) {

            if (!blob) {
              reject(
                new Error(
                  'Unable to create image.'
                )
              );

              return;
            }

            resolve(blob);

          },
          mimeType,
          quality
        );

      }
    );
  }


  // -------------------------------------------------------
  // PNG GENERATION
  // -------------------------------------------------------

  async function createPng(size) {

    const canvas =
      drawImageToCanvas(size);

    const qualityValue =
      parseInt(
        iconQuality.value,
        10
      ) / 100;

    const blob =
      await canvasToBlob(
        canvas,
        'image/png',
        qualityValue
      );

    return blob;
  }


  // -------------------------------------------------------
  // SVG GENERATION
  // -------------------------------------------------------

  async function createSvg(size) {

    const canvas =
      drawImageToCanvas(size);

    const pngData =
      canvas.toDataURL(
        'image/png'
      );

    const svg =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<svg xmlns="http://www.w3.org/2000/svg" ' +
      'width="' + size + '" ' +
      'height="' + size + '" ' +
      'viewBox="0 0 ' + size + ' ' + size + '">' +
      '<image href="' +
      pngData +
      '" width="' +
      size +
      '" height="' +
      size +
      '" preserveAspectRatio="none"/>' +
      '</svg>';

    return new Blob(
      [svg],
      {
        type: 'image/svg+xml'
      }
    );
  }


  // -------------------------------------------------------
  // PNG → ICO
  //
  // ICO can contain PNG image data.
  // We create a valid ICO container using
  // PNG images generated by the browser.
  // -------------------------------------------------------

  async function createIco() {

    const sizes = [16, 32];

    const pngBlobs = [];

    for (
      let i = 0;
      i < sizes.length;
      i++
    ) {

      pngBlobs.push(
        await createPng(sizes[i])
      );
    }


    const pngBuffers = [];

    for (
      let i = 0;
      i < pngBlobs.length;
      i++
    ) {

      pngBuffers.push(
        new Uint8Array(
          await pngBlobs[i].arrayBuffer()
        )
      );
    }


    const headerSize = 6;
    const directorySize =
      16 * pngBuffers.length;

    let imageOffset =
      headerSize +
      directorySize;

    let totalSize =
      imageOffset;

    pngBuffers.forEach(
      function (buffer) {
        totalSize += buffer.length;
      }
    );


    const output =
      new Uint8Array(totalSize);

    const view =
      new DataView(
        output.buffer
      );


    // ICO Header
    view.setUint16(
      0,
      0,
      true
    );

    // Type = 1 = icon
    view.setUint16(
      2,
      1,
      true
    );

    // Number of images
    view.setUint16(
      4,
      pngBuffers.length,
      true
    );


    let dataOffset =
      imageOffset;


    for (
      let i = 0;
      i < pngBuffers.length;
      i++
    ) {

      const size =
        sizes[i];

      const buffer =
        pngBuffers[i];

      const entryOffset =
        headerSize +
        (i * 16);


      // Width
      output[entryOffset] =
        size >= 256 ? 0 : size;


      // Height
      output[entryOffset + 1] =
        size >= 256 ? 0 : size;


      // Color palette
      output[entryOffset + 2] =
        0;


      // Reserved
      output[entryOffset + 3] =
        0;


      // Color planes
      view.setUint16(
        entryOffset + 4,
        1,
        true
      );


      // Bits per pixel
      view.setUint16(
        entryOffset + 6,
        32,
        true
      );


      // Image data size
      view.setUint32(
        entryOffset + 8,
        buffer.length,
        true
      );


      // Image data offset
      view.setUint32(
        entryOffset + 12,
        dataOffset,
        true
      );


      output.set(
        buffer,
        dataOffset
      );


      dataOffset +=
        buffer.length;
    }


    return new Blob(
      [output],
      {
        type: 'image/x-icon'
      }
    );
  }


  // -------------------------------------------------------
  // ICON DEFINITIONS
  // -------------------------------------------------------

  function getIconDefinitions() {

    const definitions = [

      {
        name: 'favicon-16x16.png',
        label: 'Favicon 16×16',
        size: 16,
        type: 'png'
      },

      {
        name: 'favicon-32x32.png',
        label: 'Favicon 32×32',
        size: 32,
        type: 'png'
      },

      {
        name: 'favicon-48x48.png',
        label: 'Favicon 48×48',
        size: 48,
        type: 'png'
      },

      {
        name: 'favicon.ico',
        label: 'Favicon ICO',
        size: 32,
        type: 'ico'
      }

    ];


    if (
      generateAppleTouchIcon.checked
    ) {

      definitions.push({
        name: 'apple-touch-icon.png',
        label: 'Apple Touch Icon',
        size: 180,
        type: 'png'
      });

    }


    if (
      generateAndroidIcons.checked
    ) {

      definitions.push(
        {
          name: 'android-icon-192x192.png',
          label: 'Android 192×192',
          size: 192,
          type: 'png'
        },
        {
          name: 'android-icon-512x512.png',
          label: 'Android 512×512',
          size: 512,
          type: 'png'
        }
      );

    }


    if (
      generateLargeIcons.checked
    ) {

      definitions.push(
        {
          name: 'icon-128x128.png',
          label: 'Large Icon 128×128',
          size: 128,
          type: 'png'
        },
        {
          name: 'icon-256x256.png',
          label: 'Large Icon 256×256',
          size: 256,
          type: 'png'
        }
      );

    }


    if (
      generateSvg.checked
    ) {

      definitions.push({
        name: 'favicon.svg',
        label: 'SVG Icon',
        size: 512,
        type: 'svg'
      });

    }


    return definitions;
  }


  // -------------------------------------------------------
  // GENERATE ICON KIT
  // -------------------------------------------------------

  async function generateIconKit() {

    if (!originalFile || !originalImage) {

      alert(
        'आधी इमेज सिलेक्ट करा.'
      );

      return;
    }


    generateBtn.disabled = true;

    showElement(progressSection);
    hideElement(resultSection);

    generatedGrid.innerHTML = '';

    revokeGeneratedUrls();

    generatedFiles = [];


    const definitions =
      getIconDefinitions();

    const total =
      definitions.length;

    try {

      for (
        let i = 0;
        i < definitions.length;
        i++
      ) {

        const definition =
          definitions[i];

        let blob;


        if (definition.type === 'ico') {

          blob =
            await createIco();

        } else if (
          definition.type === 'svg'
        ) {

          blob =
            await createSvg(
              definition.size
            );

        } else {

          blob =
            await createPng(
              definition.size
            );
        }


        const url =
          URL.createObjectURL(blob);


        generatedFiles.push({
          name: definition.name,
          label: definition.label,
          size: definition.size,
          type: definition.type,
          blob: blob,
          url: url
        });


        setProgress(
          ((i + 1) / total) * 100
        );


        await sleep(70);
      }


      renderGeneratedFiles();


      resultSummary.textContent =
        generatedFiles.length +
        ' favicon and icon files are ready to download.';


      hideElement(progressSection);
      showElement(resultSection);


      resultSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });


    } catch (error) {

      console.error(
        'Generation error:',
        error
      );

      alert(
        'Icon kit तयार करताना समस्या आली. कृपया पुन्हा प्रयत्न करा.'
      );

      hideElement(progressSection);

    } finally {

      generateBtn.disabled = false;
    }
  }


  // -------------------------------------------------------
  // RENDER GENERATED FILES
  // -------------------------------------------------------

  function renderGeneratedFiles() {

    generatedGrid.innerHTML = '';


    generatedFiles.forEach(
      function (item) {

        const card =
          document.createElement('article');

        card.className =
          'generated-icon-card';


        const preview =
          document.createElement('div');

        preview.className =
          'generated-icon-preview';


        if (item.type === 'svg') {

          const img =
            document.createElement('img');

          img.src =
            item.url;

          img.alt =
            item.label;

          preview.appendChild(img);

        } else if (
          item.type === 'ico'
        ) {

          const img =
            document.createElement('img');

          img.src =
            item.url;

          img.alt =
            item.label;

          img.width = 64;
          img.height = 64;

          preview.appendChild(img);

        } else {

          const img =
            document.createElement('img');

          img.src =
            item.url;

          img.alt =
            item.label;

          img.width =
            Math.min(
              item.size,
              100
            );

          img.height =
            Math.min(
              item.size,
              100
            );

          preview.appendChild(img);
        }


        const title =
          document.createElement('h4');

        title.textContent =
          item.label;


        const details =
          document.createElement('p');

        details.textContent =
          item.name +
          ' · ' +
          formatBytes(item.blob.size);


        const download =
          document.createElement('button');

        download.type =
          'button';

        download.className =
          'secondary-btn';

        download.style.marginTop =
          '10px';

        download.style.width =
          '100%';

        download.textContent =
          'Download';


        download.addEventListener(
          'click',
          function () {

            downloadBlob(
              item.blob,
              item.name
            );
          }
        );


        card.appendChild(preview);
        card.appendChild(title);
        card.appendChild(details);
        card.appendChild(download);

        generatedGrid.appendChild(card);
      }
    );
  }


  // -------------------------------------------------------
  // DOWNLOAD
  // -------------------------------------------------------

  function downloadBlob(
    blob,
    filename
  ) {

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href =
      url;

    link.download =
      filename;

    link.style.display =
      'none';

    document.body.appendChild(link);

    link.click();

    link.remove();


    setTimeout(
      function () {
        URL.revokeObjectURL(url);
      },
      1500
    );
  }


  async function downloadAll() {

    if (
      !generatedFiles.length
    ) {

      alert(
        'Download करण्यासाठी आधी icon kit तयार करा.'
      );

      return;
    }


    downloadAllBtn.disabled =
      true;


    try {

      /*
       * Browser security restrictions मुळे
       * अनेक files एकाच वेळी download करताना
       * काही browsers permission मागू शकतात.
       *
       * म्हणून files मध्ये थोडा delay ठेवला आहे.
       */

      for (
        let i = 0;
        i < generatedFiles.length;
        i++
      ) {

        const item =
          generatedFiles[i];

        downloadBlob(
          item.blob,
          item.name
        );

        await sleep(220);
      }

    } finally {

      downloadAllBtn.disabled =
        false;
    }
  }


  // -------------------------------------------------------
  // START OVER
  // -------------------------------------------------------

  function resetTool() {

    revokeGeneratedUrls();

    generatedFiles = [];

    originalFile = null;
    originalImage = null;


    imageInput.value = '';


    workspace.hidden = true;

    hideElement(progressSection);
    hideElement(resultSection);


    generatedGrid.innerHTML = '';


    originalPreview.src = '';

    originalName.textContent =
      'Image';

    originalSize.textContent =
      '0 KB';

    originalDimensions.textContent =
      '0 × 0 px';


    faviconPreviewImage.src = '';

    faviconPreviewImage.hidden =
      true;


    if (faviconPlaceholder) {
      faviconPlaceholder.style.display =
        'block';
    }


    setProgress(0);


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  // -------------------------------------------------------
  // BUTTON EVENTS
  // -------------------------------------------------------

  generateBtn.addEventListener(
    'click',
    generateIconKit
  );


  downloadAllBtn.addEventListener(
    'click',
    downloadAll
  );


  startOverBtn.addEventListener(
    'click',
    resetTool
  );


  generateAgainBtn.addEventListener(
    'click',
    function () {

      hideElement(resultSection);

      workspace
        .querySelector('.step-heading')
        .scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
    }
  );


  // -------------------------------------------------------
  // INITIAL STATE
  // -------------------------------------------------------

  updateBackgroundControls();

  if (iconQualityValue) {
    iconQualityValue.textContent =
      iconQuality.value;
  }


  // -------------------------------------------------------
  // SAFETY CHECK
  // -------------------------------------------------------

  const requiredElements = [
    uploadZone,
    selectImageBtn,
    imageInput,
    workspace,
    originalPreview,
    originalName,
    originalSize,
    originalDimensions,
    faviconPreview,
    faviconPreviewImage,
    backgroundMode,
    imageFit,
    cornerStyle,
    iconName,
    iconQuality,
    generateBtn,
    startOverBtn,
    progressSection,
    progressPercent,
    progressBar,
    resultSection,
    generatedGrid,
    downloadAllBtn,
    generateAgainBtn
  ];


  const missingElements =
    requiredElements.filter(
      function (element) {
        return !element;
      }
    );


  if (missingElements.length) {

    console.warn(
      'Some required HTML elements are missing.',
      missingElements
    );
  }

})();
