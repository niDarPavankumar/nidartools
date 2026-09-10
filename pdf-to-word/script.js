(function () {
  'use strict';

  /* =========================================================
     ELEMENTS
     ========================================================= */

  const uploadZone = document.getElementById('uploadZone');
  const selectPdfBtn = document.getElementById('selectPdfBtn');
  const pdfInput = document.getElementById('pdfInput');

  const workspace = document.getElementById('workspace');
  const previewSection = document.getElementById('previewSection');
  const convertSection = document.getElementById('convertSection');
  const progressSection = document.getElementById('progressSection');
  const resultSection = document.getElementById('resultSection');

  const pdfFileName = document.getElementById('pdfFileName');
  const pdfFileSize = document.getElementById('pdfFileSize');
  const pdfPageCount = document.getElementById('pdfPageCount');

  const pageCountValue = document.getElementById('pageCountValue');
  const sizeValue = document.getElementById('sizeValue');

  const outputFormat = document.getElementById('outputFormat');
  const documentName = document.getElementById('documentName');

  const includePageBreaks =
    document.getElementById('includePageBreaks');

  const includePageNumbers =
    document.getElementById('includePageNumbers');

  const cleanText =
    document.getElementById('cleanText');

  const previewStatus =
    document.getElementById('previewStatus');

  const textStats =
    document.getElementById('textStats');

  const extractedText =
    document.getElementById('extractedText');

  const convertBtn =
    document.getElementById('convertBtn');

  const convertMessage =
    document.getElementById('convertMessage');

  const progressPercent =
    document.getElementById('progressPercent');

  const progressBar =
    document.getElementById('progressBar');

  const progressMessage =
    document.getElementById('progressMessage');

  const resultSummary =
    document.getElementById('resultSummary');

  const resultOriginal =
    document.getElementById('resultOriginal');

  const resultOutput =
    document.getElementById('resultOutput');

  const resultPages =
    document.getElementById('resultPages');

  const downloadBtn =
    document.getElementById('downloadBtn');

  const convertAgainBtn =
    document.getElementById('convertAgainBtn');

  const startOverBtn =
    document.getElementById('startOverBtn');


  /* =========================================================
     STATE
     ========================================================= */

  let selectedPdf = null;
  let pdfDocument = null;
  let extractedPages = [];
  let downloadUrl = null;

  const MAX_FILE_SIZE =
    25 * 1024 * 1024;


  /* =========================================================
     HELPERS
     ========================================================= */

  function formatBytes(bytes) {

    if (bytes < 1024) {
      return bytes + ' B';
    }

    if (bytes < 1024 * 1024) {
      return (
        bytes / 1024
      ).toFixed(1) + ' KB';
    }

    return (
      bytes / (1024 * 1024)
    ).toFixed(2) + ' MB';
  }


  function updateProgress(percent, message) {

    const value =
      Math.max(
        0,
        Math.min(100, percent)
      );

    progressPercent.textContent =
      Math.round(value) + '%';

    progressBar.style.width =
      value + '%';

    if (message) {
      progressMessage.textContent =
        message;
    }
  }


  function revokeDownloadUrl() {

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      downloadUrl = null;
    }
  }


  function updateTextStats() {

    const text =
      extractedText.value || '';

    const characters =
      text.length;

    const words =
      text.trim()
        ? text.trim().split(/\s+/).length
        : 0;

    textStats.textContent =
      words.toLocaleString() +
      ' words • ' +
      characters.toLocaleString() +
      ' characters';
  }


  function sanitizeFileName(name) {

    return String(name || '')
      .replace(/\.pdf$/i, '')
      .replace(/[^a-z0-9-_ ]/gi, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  }


  /* =========================================================
     PDF.JS LOADER
     ========================================================= */

  async function getPdfJs() {

    if (
      window.pdfjsLib &&
      typeof window.pdfjsLib.getDocument === 'function'
    ) {
      return window.pdfjsLib;
    }

    try {

      const module =
        await import(
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs'
        );

      if (
        module &&
        typeof module.getDocument === 'function'
      ) {

        module.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

        window.pdfjsLib = module;

        return module;
      }

    } catch (error) {

      console.error(
        'PDF.js loading error:',
        error
      );
    }

    throw new Error(
      'PDF engine is not available.'
    );
  }


  /* =========================================================
     VALIDATE PDF
     ========================================================= */

  function validatePdf(file) {

    if (!file) {
      return false;
    }

    const isPdf =
      file.type === 'application/pdf' ||
      /\.pdf$/i.test(file.name);

    if (!isPdf) {

      alert(
        'Please select a valid PDF file.'
      );

      return false;
    }

    if (file.size > MAX_FILE_SIZE) {

      alert(
        'PDF size must be 25 MB or less.'
      );

      return false;
    }

    return true;
  }


  /* =========================================================
     SELECT PDF
     ========================================================= */

  selectPdfBtn.addEventListener(
    'click',
    function (event) {

      event.preventDefault();
      event.stopPropagation();

      pdfInput.click();
    }
  );


  uploadZone.addEventListener(
    'click',
    function (event) {

      if (event.target === selectPdfBtn) {
        return;
      }

      pdfInput.click();
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

        pdfInput.click();
      }
    }
  );


  pdfInput.addEventListener(
    'change',
    function (event) {

      const file =
        event.target.files &&
        event.target.files[0];

      if (file) {
        loadPdf(file);
      }
    }
  );


  /* =========================================================
     DRAG & DROP
     ========================================================= */

  uploadZone.addEventListener(
    'dragenter',
    function (event) {

      event.preventDefault();

      uploadZone.classList.add(
        'drag-over'
      );
    }
  );


  uploadZone.addEventListener(
    'dragover',
    function (event) {

      event.preventDefault();

      uploadZone.classList.add(
        'drag-over'
      );
    }
  );


  uploadZone.addEventListener(
    'dragleave',
    function (event) {

      event.preventDefault();

      uploadZone.classList.remove(
        'drag-over'
      );
    }
  );


  uploadZone.addEventListener(
    'drop',
    function (event) {

      event.preventDefault();

      uploadZone.classList.remove(
        'drag-over'
      );

      const file =
        event.dataTransfer.files &&
        event.dataTransfer.files[0];

      if (file) {
        loadPdf(file);
      }
    }
  );


  /* =========================================================
     LOAD PDF
     ========================================================= */

  async function loadPdf(file) {

    if (!validatePdf(file)) {
      return;
    }

    selectedPdf = file;

    workspace.hidden = false;
    previewSection.hidden = true;
    convertSection.hidden = true;
    resultSection.hidden = true;

    pdfFileName.textContent =
      file.name;

    pdfFileSize.textContent =
      formatBytes(file.size);

    sizeValue.textContent =
      formatBytes(file.size);

    pdfPageCount.textContent =
      'Reading PDF...';

    pageCountValue.textContent =
      '…';

    previewStatus.textContent =
      'Reading PDF...';

    extractedText.value = '';

    extractedPages = [];

    updateTextStats();

    try {

      const pdfjsLib =
        await getPdfJs();

      const buffer =
        await file.arrayBuffer();

      const loadingTask =
        pdfjsLib.getDocument({
          data: new Uint8Array(buffer)
        });

      pdfDocument =
        await loadingTask.promise;

      const totalPages =
        pdfDocument.numPages;

      pdfFileName.textContent =
        file.name;

      pdfFileSize.textContent =
        formatBytes(file.size);

      pdfPageCount.textContent =
        totalPages +
        (totalPages === 1 ? ' page' : ' pages');

      pageCountValue.textContent =
        totalPages;

      updateProgress(
        0,
        'Preparing text extraction...'
      );

      await extractAllPages();

      previewSection.hidden = false;
      convertSection.hidden = false;

      previewStatus.textContent =
        'Text extracted successfully';

      convertMessage.textContent =
        totalPages +
        (totalPages === 1
          ? ' page is ready to convert.'
          : ' pages are ready to convert.');

      updateTextStats();

      previewSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    } catch (error) {

      console.error(
        'PDF loading error:',
        error
      );

      alert(
        'Unable to read this PDF. The file may be encrypted, damaged or unsupported.'
      );

      resetTool();
    }
  }


  /* =========================================================
     EXTRACT ALL PAGES
     ========================================================= */

  async function extractAllPages() {

    extractedPages = [];

    const total =
      pdfDocument.numPages;

    for (
      let pageNumber = 1;
      pageNumber <= total;
      pageNumber++
    ) {

      const page =
        await pdfDocument.getPage(
          pageNumber
        );

      const textContent =
        await page.getTextContent();

      const pageText =
        buildPageText(
          textContent.items
        );

      extractedPages.push(
        pageText
      );

      const percent =
        Math.round(
          (pageNumber / total) * 100
        );

      updateProgress(
        percent,
        'Extracting page ' +
        pageNumber +
        ' of ' +
        total +
        '...'
      );

      if (
        pageNumber % 3 === 0
      ) {
        await new Promise(
          function (resolve) {
            setTimeout(
              resolve,
              0
            );
          }
        );
      }
    }

    extractedText.value =
      buildCombinedText();

    updateTextStats();

    progressSection.hidden = true;
  }


  /* =========================================================
     BUILD PAGE TEXT
     ========================================================= */

  function buildPageText(items) {

    if (!items || !items.length) {
      return '';
    }

    const lines = [];
    let currentLine = '';
    let lastY = null;

    items.forEach(
      function (item) {

        const text =
          typeof item.str === 'string'
            ? item.str
            : '';

        if (!text) {
          return;
        }

        const transform =
          item.transform || [];

        const y =
          transform.length > 5
            ? transform[5]
            : null;

        if (
          lastY !== null &&
          y !== null &&
          Math.abs(y - lastY) > 4
        ) {

          if (currentLine.trim()) {
            lines.push(
              currentLine.trim()
            );
          }

          currentLine = '';
        }

        currentLine += text;

        if (item.hasEOL) {

          if (currentLine.trim()) {
            lines.push(
              currentLine.trim()
            );
          }

          currentLine = '';
        }

        lastY = y;
      }
    );

    if (currentLine.trim()) {
      lines.push(
        currentLine.trim()
      );
    }

    return lines.join('\n');
  }


  /* =========================================================
     COMBINED TEXT
     ========================================================= */

  function buildCombinedText() {

    if (!extractedPages.length) {
      return '';
    }

    if (
      includePageBreaks &&
      includePageBreaks.checked
    ) {

      return extractedPages
        .map(function (pageText, index) {

          const heading =
            '[Page ' +
            (index + 1) +
            ']';

          return heading +
            '\n' +
            pageText;

        })
        .join('\n\n');
    }

    return extractedPages
      .join('\n\n');
  }


  /* =========================================================
     CLEAN TEXT
     ========================================================= */

  function cleanExtractedText(text) {

    let value =
      String(text || '');

    value =
      value.replace(/\r\n/g, '\n');

    value =
      value.replace(/[ \t]+/g, ' ');

    value =
      value.replace(
        /\n{3,}/g,
        '\n\n'
      );

    value =
      value
        .split('\n')
        .map(function (line) {
          return line.trimEnd();
        })
        .join('\n');

    return value.trim();
  }


  /* =========================================================
     TEXT EDITOR
     ========================================================= */

  extractedText.addEventListener(
    'input',
    function () {
      updateTextStats();
      previewStatus.textContent =
        'Edited content';
    }
  );


  cleanText.addEventListener(
    'change',
    function () {

      if (
        cleanText.checked &&
        extractedText.value
      ) {

        extractedText.value =
          cleanExtractedText(
            extractedText.value
          );

        updateTextStats();
      }
    }
  );


  includePageBreaks.addEventListener(
    'change',
    function () {

      if (
        extractedPages.length &&
        !extractedText.value.trim()
      ) {
        extractedText.value =
          buildCombinedText();
      }
    }
  );


  /* =========================================================
     CONVERT TO DOC
     ========================================================= */

  convertBtn.addEventListener(
    'click',
    async function () {

      if (
        !extractedText.value.trim()
      ) {

        alert(
          'There is no text to convert. Please upload a PDF first.'
        );

        return;
      }

      convertBtn.disabled = true;

      progressSection.hidden = false;
      resultSection.hidden = true;

      try {

        updateProgress(
          15,
          'Preparing document...'
        );

        await wait(100);

        updateProgress(
          40,
          'Formatting extracted text...'
        );

        let text =
          extractedText.value;

        if (cleanText.checked) {
          text =
            cleanExtractedText(text);
        }

        await wait(120);

        updateProgress(
          65,
          'Creating Word-compatible document...'
        );

        const format =
          outputFormat.value;

        let blob;

        if (format === 'txt') {

          blob =
            createTextBlob(text);

        } else {

          blob =
            createWordBlob(text);
        }

        await wait(120);

        updateProgress(
          90,
          'Preparing download...'
        );

        revokeDownloadUrl();

        downloadUrl =
          URL.createObjectURL(blob);

        const baseName =
          sanitizeFileName(
            documentName.value
          ) ||
          'nidar-converted-document';

        const extension =
          format === 'txt'
            ? '.txt'
            : '.doc';

        downloadBtn.href =
          downloadUrl;

        downloadBtn.download =
          baseName + extension;

        resultOriginal.textContent =
          selectedPdf
            ? formatBytes(selectedPdf.size)
            : 'PDF';

        resultOutput.textContent =
          format === 'txt'
            ? 'TXT'
            : 'DOC';

        resultPages.textContent =
          pdfDocument
            ? pdfDocument.numPages
            : extractedPages.length;

        resultSummary.textContent =
          'Your ' +
          (
            format === 'txt'
              ? 'text file'
              : 'Word-compatible document'
          ) +
          ' is ready to download.';

        updateProgress(
          100,
          'Conversion completed.'
        );

        resultSection.hidden = false;

        resultSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      } catch (error) {

        console.error(
          'Conversion error:',
          error
        );

        alert(
          'Unable to create the document. Please try again.'
        );

      } finally {

        convertBtn.disabled = false;

        setTimeout(
          function () {
            progressSection.hidden = true;
          },
          500
        );
      }
    }
  );


  /* =========================================================
     WORD-COMPATIBLE HTML DOCUMENT
     ========================================================= */

  function createWordBlob(text) {

    const title =
      documentName.value.trim() ||
      'niDar Converted Document';

    const pages =
      text.split(/\n\s*\n/);

    let body = '';

    pages.forEach(
      function (pageText, index) {

        const lines =
          pageText.split('\n');

        body +=
          '<div class="page">';

        if (
          includePageNumbers.checked
        ) {

          body +=
            '<div class="page-number">' +
            'Page ' +
            (index + 1) +
            '</div>';
        }

        lines.forEach(
          function (line) {

            const safe =
              escapeHTML(line);

            if (!safe.trim()) {

              body +=
                '<p>&nbsp;</p>';

            } else if (
              /^\[Page\s+\d+\]$/i.test(
                line.trim()
              )
            ) {

              body +=
                '<h2>' +
                safe +
                '</h2>';

            } else {

              body +=
                '<p>' +
                safe +
                '</p>';
            }
          }
        );

        body +=
          '</div>';
      }
    );

    const html =
      '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
      '<meta charset="utf-8">' +
      '<title>' +
      escapeHTML(title) +
      '</title>' +
      '<style>' +
      'body{font-family:Arial,sans-serif;' +
      'font-size:12pt;line-height:1.55;' +
      'margin:30pt;color:#222;}' +
      'h1{font-size:20pt;margin-bottom:20pt;}' +
      'h2{font-size:14pt;margin-top:18pt;}' +
      'p{margin:0 0 8pt;}' +
      '.page{position:relative;}' +
      '.page-number{text-align:center;' +
      'font-size:9pt;color:#777;' +
      'margin-bottom:12pt;}' +
      '</style>' +
      '</head>' +
      '<body>' +
      '<h1>' +
      escapeHTML(title) +
      '</h1>' +
      body +
      '</body>' +
      '</html>';

    return new Blob(
      [html],
      {
        type:
          'application/msword'
      }
    );
  }


  /* =========================================================
     TEXT FILE
     ========================================================= */

  function createTextBlob(text) {

    return new Blob(
      [text],
      {
        type:
          'text/plain;charset=utf-8'
      }
    );
  }


  /* =========================================================
     ESCAPE HTML
     ========================================================= */

  function escapeHTML(value) {

    return String(value)
      .replace(
        /&/g,
        '&amp;'
      )
      .replace(
        /</g,
        '&lt;'
      )
      .replace(
        />/g,
        '&gt;'
      )
      .replace(
        /"/g,
        '&quot;'
      )
      .replace(
        /'/g,
        '&#039;'
      );
  }


  /* =========================================================
     WAIT
     ========================================================= */

  function wait(ms) {

    return new Promise(
      function (resolve) {
        setTimeout(
          resolve,
          ms
        );
      }
    );
  }


  /* =========================================================
     CONVERT AGAIN
     ========================================================= */

  convertAgainBtn.addEventListener(
    'click',
    function () {

      resultSection.hidden = true;

      convertSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  );


  /* =========================================================
     START OVER
     ========================================================= */

  startOverBtn.addEventListener(
    'click',
    function () {
      resetTool();

      uploadZone.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  );


  /* =========================================================
     RESET
     ========================================================= */

  function resetTool() {

    selectedPdf = null;
    pdfDocument = null;
    extractedPages = [];

    revokeDownloadUrl();

    pdfInput.value = '';

    workspace.hidden = true;
    previewSection.hidden = true;
    convertSection.hidden = true;
    progressSection.hidden = true;
    resultSection.hidden = true;

    extractedText.value = '';

    pdfFileName.textContent =
      'document.pdf';

    pdfFileSize.textContent =
      '0 KB';

    pdfPageCount.textContent =
      '0 pages';

    pageCountValue.textContent =
      '0';

    sizeValue.textContent =
      '0 KB';

    previewStatus.textContent =
      'Waiting for PDF';

    convertMessage.textContent =
      'Your PDF is ready to be converted.';

    updateTextStats();
    updateProgress(0);
  }


  /* =========================================================
     INITIAL STATE
     ========================================================= */

  resetTool();

})();
