(function () {
  'use strict';

  /* =========================================================
     ELEMENTS
     ========================================================= */

  const documentTitle = document.getElementById('documentTitle');
  const documentEditor = document.getElementById('documentEditor');

  const wordCount = document.getElementById('wordCount');
  const characterCount = document.getElementById('characterCount');

  const boldBtn = document.getElementById('boldBtn');
  const italicBtn = document.getElementById('italicBtn');
  const underlineBtn = document.getElementById('underlineBtn');
  const headingBtn = document.getElementById('headingBtn');
  const bulletBtn = document.getElementById('bulletBtn');
  const numberBtn = document.getElementById('numberBtn');

  const alignLeftBtn = document.getElementById('alignLeftBtn');
  const alignCenterBtn = document.getElementById('alignCenterBtn');
  const alignRightBtn = document.getElementById('alignRightBtn');

  const sampleBtn = document.getElementById('sampleBtn');
  const clearBtn = document.getElementById('clearBtn');

  const pageSize = document.getElementById('pageSize');
  const orientation = document.getElementById('orientation');
  const fontFamily = document.getElementById('fontFamily');
  const fontSize = document.getElementById('fontSize');
  const marginSize = document.getElementById('marginSize');
  const lineSpacing = document.getElementById('lineSpacing');

  const includeHeader = document.getElementById('includeHeader');
  const includePageNumbers = document.getElementById('includePageNumbers');
  const includeDate = document.getElementById('includeDate');

  const previewStatus = document.getElementById('previewStatus');
  const pageInfo = document.getElementById('pageInfo');

  const pdfPreview = document.getElementById('pdfPreview');
  const previewHeader = document.getElementById('previewHeader');
  const previewHeaderTitle = document.getElementById('previewHeaderTitle');
  const previewDate = document.getElementById('previewDate');
  const previewTitle = document.getElementById('previewTitle');
  const previewContent = document.getElementById('previewContent');
  const previewPageNumber = document.getElementById('previewPageNumber');

  const generatePdfBtn = document.getElementById('generatePdfBtn');

  const progressSection =
    document.getElementById('progressSection');

  const progressPercent =
    document.getElementById('progressPercent');

  const progressBar =
    document.getElementById('progressBar');

  const progressMessage =
    document.getElementById('progressMessage');

  const resultSection =
    document.getElementById('resultSection');

  const resultSummary =
    document.getElementById('resultSummary');

  const downloadBtn =
    document.getElementById('downloadBtn');

  const createAgainBtn =
    document.getElementById('createAgainBtn');

  const startOverBtn =
    document.getElementById('startOverBtn');


  /* =========================================================
     STATE
     ========================================================= */

  let pdfBlob = null;
  let pdfUrl = null;

  const SAMPLE_TITLE =
    'niDar Tools — Sample Document';

  const SAMPLE_HTML = `
    <h2>Welcome to niDar Tools</h2>

    <p>
      This is a sample document created with the
      Word to PDF Converter.
    </p>

    <p>
      You can replace this text with your own content,
      customize the document settings and generate a
      professional PDF file.
    </p>

    <h3>Features</h3>

    <ul>
      <li>Simple document editor</li>
      <li>Custom page size and orientation</li>
      <li>Adjustable font and spacing</li>
      <li>PDF generation directly in the browser</li>
    </ul>

    <p>
      Thank you for using niDar Tools.
    </p>
  `;


  /* =========================================================
     UTILITY
     ========================================================= */

  function escapeHTML(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }


  function updateCounts() {
    const text =
      documentEditor.innerText
        .replace(/\s+/g, ' ')
        .trim();

    const words =
      text
        ? text.split(/\s+/).length
        : 0;

    const chars =
      documentEditor.innerText.length;

    wordCount.textContent =
      words.toLocaleString() +
      (words === 1 ? ' word' : ' words');

    characterCount.textContent =
      chars.toLocaleString() +
      (chars === 1 ? ' character' : ' characters');
  }


  function revokePdfUrl() {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      pdfUrl = null;
    }
  }


  function setProgress(percent, message) {
    const value =
      Math.max(0, Math.min(100, percent));

    progressPercent.textContent =
      Math.round(value) + '%';

    progressBar.style.width =
      value + '%';

    if (message) {
      progressMessage.textContent =
        message;
    }
  }


  /* =========================================================
     EDITOR COMMAND
     ========================================================= */

  function executeCommand(command, value) {
    documentEditor.focus();

    try {
      document.execCommand(
        command,
        false,
        value || null
      );
    } catch (error) {
      console.warn(
        'Editor command failed:',
        command,
        error
      );
    }

    updateCounts();
    updatePreview();
  }


  /* =========================================================
     TEXT FORMATTING
     ========================================================= */

  boldBtn.addEventListener(
    'click',
    function () {
      executeCommand('bold');
    }
  );


  italicBtn.addEventListener(
    'click',
    function () {
      executeCommand('italic');
    }
  );


  underlineBtn.addEventListener(
    'click',
    function () {
      executeCommand('underline');
    }
  );


  headingBtn.addEventListener(
    'click',
    function () {

      documentEditor.focus();

      try {
        document.execCommand(
          'formatBlock',
          false,
          'h2'
        );
      } catch (error) {
        console.warn(error);
      }

      updateCounts();
      updatePreview();
    }
  );


  bulletBtn.addEventListener(
    'click',
    function () {
      executeCommand('insertUnorderedList');
    }
  );


  numberBtn.addEventListener(
    'click',
    function () {
      executeCommand('insertOrderedList');
    }
  );


  /* =========================================================
     ALIGNMENT
     ========================================================= */

  function setAlignment(command, activeButton) {

    executeCommand(command);

    [
      alignLeftBtn,
      alignCenterBtn,
      alignRightBtn
    ].forEach(function (button) {
      button.classList.remove('active');
    });

    activeButton.classList.add('active');
  }


  alignLeftBtn.addEventListener(
    'click',
    function () {
      setAlignment(
        'justifyLeft',
        alignLeftBtn
      );
    }
  );


  alignCenterBtn.addEventListener(
    'click',
    function () {
      setAlignment(
        'justifyCenter',
        alignCenterBtn
      );
    }
  );


  alignRightBtn.addEventListener(
    'click',
    function () {
      setAlignment(
        'justifyRight',
        alignRightBtn
      );
    }
  );


  /* =========================================================
     SAMPLE DOCUMENT
     ========================================================= */

  sampleBtn.addEventListener(
    'click',
    function () {

      documentTitle.value =
        SAMPLE_TITLE;

      documentEditor.innerHTML =
        SAMPLE_HTML;

      updateCounts();
      updatePreview();

      documentEditor.focus();
    }
  );


  /* =========================================================
     CLEAR
     ========================================================= */

  clearBtn.addEventListener(
    'click',
    function () {

      documentTitle.value = '';

      documentEditor.innerHTML = '';

      updateCounts();
      updatePreview();

      resultSection.hidden = true;

      revokePdfUrl();
      pdfBlob = null;

      downloadBtn.removeAttribute('href');

      documentEditor.focus();
    }
  );


  /* =========================================================
     LIVE EDITOR
     ========================================================= */

  documentEditor.addEventListener(
    'input',
    function () {
      updateCounts();
      updatePreview();
    }
  );


  documentTitle.addEventListener(
    'input',
    updatePreview
  );


  /* =========================================================
     SETTINGS EVENTS
     ========================================================= */

  [
    pageSize,
    orientation,
    fontFamily,
    fontSize,
    marginSize,
    lineSpacing,
    includeHeader,
    includePageNumbers,
    includeDate
  ].forEach(function (element) {

    element.addEventListener(
      'change',
      updatePreview
    );
  });


  /* =========================================================
     PREVIEW
     ========================================================= */

  function updatePreview() {

    const title =
      documentTitle.value.trim() ||
      'Your Document';

    previewTitle.textContent =
      title;

    previewContent.innerHTML =
      documentEditor.innerHTML.trim()
        ? documentEditor.innerHTML
        : '<p class="empty-preview">Your document preview will appear here.</p>';

    previewHeaderTitle.textContent =
      title;

    previewHeader.hidden =
      !includeHeader.checked;

    previewDate.hidden =
      !includeDate.checked;

    if (includeDate.checked) {
      previewDate.textContent =
        new Date().toLocaleDateString();
    }

    previewPageNumber.hidden =
      !includePageNumbers.checked;

    pdfPreview.style.fontFamily =
      getPreviewFont();

    pdfPreview.style.fontSize =
      Number(fontSize.value) + 'px';

    pdfPreview.style.lineHeight =
      lineSpacing.value;

    previewStatus.textContent =
      'Live Preview';

    pageInfo.textContent =
      'Page 1';
  }


  function getPreviewFont() {

    switch (fontFamily.value) {

      case 'times':
        return 'Times New Roman, Times, serif';

      case 'courier':
        return 'Courier New, Courier, monospace';

      default:
        return 'Arial, Helvetica, sans-serif';
    }
  }


  /* =========================================================
     PDF SETTINGS
     ========================================================= */

  function getPdfDimensions() {

    let width;
    let height;

    switch (pageSize.value) {

      case 'letter':
        width = 215.9;
        height = 279.4;
        break;

      case 'legal':
        width = 215.9;
        height = 355.6;
        break;

      case 'a4':
      default:
        width = 210;
        height = 297;
        break;
    }

    if (orientation.value === 'landscape') {
      const temp = width;
      width = height;
      height = temp;
    }

    return {
      width: width,
      height: height
    };
  }


  function getPdfFont() {

    switch (fontFamily.value) {

      case 'times':
        return 'times';

      case 'courier':
        return 'courier';

      default:
        return 'helvetica';
    }
  }


  /* =========================================================
     EXTRACT DOCUMENT BLOCKS
     ========================================================= */

  function getDocumentBlocks() {

    const container =
      document.createElement('div');

    container.innerHTML =
      documentEditor.innerHTML;

    const blocks = [];

    function walk(node) {

      if (node.nodeType === Node.TEXT_NODE) {

        const text =
          node.textContent.trim();

        if (text) {
          blocks.push({
            type: 'text',
            text: text,
            bold: false,
            italic: false
          });
        }

        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const tag =
        node.tagName.toLowerCase();

      if (
        tag === 'ul' ||
        tag === 'ol'
      ) {

        Array.from(node.children)
          .forEach(function (li, index) {

            const text =
              li.innerText.trim();

            if (text) {

              blocks.push({
                type: 'list',
                text: text,
                ordered: tag === 'ol',
                index: index + 1
              });
            }
          });

        return;
      }

      if (
        tag === 'h1' ||
        tag === 'h2' ||
        tag === 'h3'
      ) {

        const text =
          node.innerText.trim();

        if (text) {

          blocks.push({
            type: 'heading',
            text: text,
            level: tag === 'h1'
              ? 1
              : tag === 'h2'
                ? 2
                : 3
          });
        }

        return;
      }

      if (
        tag === 'p' ||
        tag === 'div' ||
        tag === 'section'
      ) {

        const text =
          node.innerText.trim();

        if (text) {

          blocks.push({
            type: 'text',
            text: text
          });

          return;
        }
      }

      Array.from(node.childNodes)
        .forEach(walk);
    }

    Array.from(container.childNodes)
      .forEach(walk);

    return blocks;
  }


  /* =========================================================
     ADD WRAPPED TEXT
     ========================================================= */

  function addWrappedText(
    doc,
    text,
    x,
    y,
    maxWidth,
    fontSizeValue,
    lineHeightValue
  ) {

    doc.setFontSize(
      fontSizeValue
    );

    const lines =
      doc.splitTextToSize(
        text,
        maxWidth
      );

    const lineHeight =
      fontSizeValue *
      lineHeightValue *
      0.36;

    lines.forEach(function (line) {

      if (y + lineHeight > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }

      doc.text(
        line,
        x,
        y
      );

      y += lineHeight;
    });

    return y;
  }


  /* =========================================================
     CREATE PDF
     ========================================================= */

  async function createPDF() {

    if (!documentEditor.innerText.trim()) {

      alert(
        'Please write or paste some content first.'
      );

      documentEditor.focus();

      return null;
    }

    if (
      !window.jspdf ||
      !window.jspdf.jsPDF
    ) {

      alert(
        'PDF engine is not available. Please check your internet connection and reload the page.'
      );

      return null;
    }

    const jsPDF =
      window.jspdf.jsPDF;

    const dimensions =
      getPdfDimensions();

    const doc =
      new jsPDF({
        orientation:
          orientation.value === 'landscape'
            ? 'landscape'
            : 'portrait',

        unit: 'mm',

        format: [
          dimensions.width,
          dimensions.height
        ]
      });


    /* -------------------------------------------------------
       PDF COLORS / FONT
       ------------------------------------------------------- */

    doc.setTextColor(
      30,
      35,
      31
    );

    doc.setFont(
      getPdfFont(),
      'normal'
    );


    /* -------------------------------------------------------
       PAGE METRICS
       ------------------------------------------------------- */

    const margin =
      Number(marginSize.value);

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    const contentWidth =
      pageWidth - (margin * 2);

    let y =
      margin;


    /* -------------------------------------------------------
       HEADER
       ------------------------------------------------------- */

    if (includeHeader.checked) {

      doc.setFontSize(9);
      doc.setFont(
        getPdfFont(),
        'normal'
      );

      doc.setTextColor(
        90,
        100,
        94
      );

      doc.text(
        documentTitle.value.trim() ||
        'niDar Tools Document',
        margin,
        y
      );

      doc.setDrawColor(
        205,
        212,
        207
      );

      doc.line(
        margin,
        y + 3,
        pageWidth - margin,
        y + 3
      );

      y += 12;

      doc.setTextColor(
        30,
        35,
        31
      );
    }


    /* -------------------------------------------------------
       DATE
       ------------------------------------------------------- */

    if (includeDate.checked) {

      doc.setFontSize(8);

      doc.setTextColor(
        100,
        110,
        104
      );

      doc.text(
        new Date().toLocaleDateString(),
        pageWidth - margin,
        y,
        {
          align: 'right'
        }
      );

      y += 8;

      doc.setTextColor(
        30,
        35,
        31
      );
    }


    /* -------------------------------------------------------
       TITLE
       ------------------------------------------------------- */

    const title =
      documentTitle.value.trim();

    if (title) {

      doc.setFont(
        getPdfFont(),
        'bold'
      );

      doc.setFontSize(20);

      y =
        addWrappedText(
          doc,
          title,
          margin,
          y,
          contentWidth,
          20,
          1.15
        );

      y += 7;

      doc.setFont(
        getPdfFont(),
        'normal'
      );
    }


    /* -------------------------------------------------------
       CONTENT
       ------------------------------------------------------- */

    const blocks =
      getDocumentBlocks();

    const baseSize =
      Number(fontSize.value);

    const spacing =
      Number(lineSpacing.value);

    for (
      let i = 0;
      i < blocks.length;
      i++
    ) {

      const block =
        blocks[i];

      if (
        y >
        pageHeight - margin - 15
      ) {
        doc.addPage();
        y = margin;
      }


      /* HEADING */

      if (block.type === 'heading') {

        const headingSize =
          block.level === 1
            ? baseSize + 7
            : block.level === 2
              ? baseSize + 4
              : baseSize + 2;

        doc.setFont(
          getPdfFont(),
          'bold'
        );

        y += 3;

        y =
          addWrappedText(
            doc,
            block.text,
            margin,
            y,
            contentWidth,
            headingSize,
            1.15
          );

        y += 5;

        doc.setFont(
          getPdfFont(),
          'normal'
        );

        continue;
      }


      /* LIST */

      if (block.type === 'list') {

        doc.setFont(
          getPdfFont(),
          'normal'
        );

        doc.setFontSize(
          baseSize
        );

        const bullet =
          block.ordered
            ? block.index + '. '
            : '• ';

        const lines =
          doc.splitTextToSize(
            bullet + block.text,
            contentWidth - 5
          );

        const lineHeight =
          baseSize *
          spacing *
          0.36;

        lines.forEach(function (line) {

          if (
            y + lineHeight >
            pageHeight - margin - 15
          ) {
            doc.addPage();
            y = margin;
          }

          doc.text(
            line,
            margin + 3,
            y
          );

          y += lineHeight;
        });

        y += 2;

        continue;
      }


      /* NORMAL TEXT */

      doc.setFont(
        getPdfFont(),
        'normal'
      );

      doc.setFontSize(
        baseSize
      );

      y =
        addWrappedText(
          doc,
          block.text,
          margin,
          y,
          contentWidth,
          baseSize,
          spacing
        );

      y += 3;
    }


    /* -------------------------------------------------------
       PAGE NUMBERS
       ------------------------------------------------------- */

    if (includePageNumbers.checked) {

      const totalPages =
        doc.getNumberOfPages();

      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {

        doc.setPage(page);

        doc.setFont(
          getPdfFont(),
          'normal'
        );

        doc.setFontSize(8);

        doc.setTextColor(
          105,
          115,
          109
        );

        doc.text(
          String(page),
          pageWidth / 2,
          pageHeight - 8,
          {
            align: 'center'
          }
        );
      }
    }


    /* -------------------------------------------------------
       METADATA
       ------------------------------------------------------- */

    doc.setProperties({
      title:
        title ||
        'niDar Tools Document',

      subject:
        'Document created with niDar Tools Word to PDF Converter',

      author:
        'niDar Tools',

      creator:
        'niDar Tools'
    });


    return doc;
  }


  /* =========================================================
     GENERATE BUTTON
     ========================================================= */

  generatePdfBtn.addEventListener(
    'click',
    async function () {

      if (!documentEditor.innerText.trim()) {

        alert(
          'Please write or paste your document content first.'
        );

        documentEditor.focus();

        return;
      }

      generatePdfBtn.disabled = true;

      progressSection.hidden = false;

      resultSection.hidden = true;

      setProgress(
        10,
        'Preparing document...'
      );

      try {

        await new Promise(function (resolve) {
          setTimeout(resolve, 100);
        });

        setProgress(
          35,
          'Formatting document...'
        );

        await new Promise(function (resolve) {
          setTimeout(resolve, 120);
        });

        setProgress(
          65,
          'Creating PDF...'
        );

        const doc =
          await createPDF();

        if (!doc) {
          return;
        }

        setProgress(
          85,
          'Preparing download...'
        );

        const blob =
          doc.output('blob');

        revokePdfUrl();

        pdfBlob = blob;

        pdfUrl =
          URL.createObjectURL(blob);

        setProgress(
          100,
          'PDF created successfully.'
        );

        downloadBtn.href =
          pdfUrl;

        const safeTitle =
          (
            documentTitle.value.trim() ||
            'nidar-document'
          )
            .replace(
              /[^a-z0-9-_]+/gi,
              '-'
            )
            .replace(
              /^-+|-+$/g,
              ''
            )
            .toLowerCase();

        downloadBtn.download =
          (safeTitle || 'nidar-document') +
          '.pdf';

        resultSummary.textContent =
          'Your PDF is ready. File size: ' +
          formatFileSize(blob.size) +
          '.';

        resultSection.hidden = false;

        resultSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      } catch (error) {

        console.error(
          'PDF generation error:',
          error
        );

        alert(
          'Unable to create the PDF. Please try again.'
        );

      } finally {

        generatePdfBtn.disabled = false;

        setTimeout(function () {
          progressSection.hidden = true;
        }, 400);
      }
    }
  );


  /* =========================================================
     FILE SIZE
     ========================================================= */

  function formatFileSize(bytes) {

    if (bytes < 1024) {
      return bytes + ' B';
    }

    if (bytes < 1024 * 1024) {
      return (
        bytes / 1024
      ).toFixed(1) + ' KB';
    }

    return (
      bytes /
      (1024 * 1024)
    ).toFixed(2) + ' MB';
  }


  /* =========================================================
     CREATE AGAIN
     ========================================================= */

  createAgainBtn.addEventListener(
    'click',
    function () {

      resultSection.hidden = true;

      generatePdfBtn.scrollIntoView({
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

      documentTitle.value = '';

      documentEditor.innerHTML = '';

      updateCounts();
      updatePreview();

      resultSection.hidden = true;

      progressSection.hidden = true;

      revokePdfUrl();

      pdfBlob = null;

      downloadBtn.removeAttribute('href');

      documentEditor.focus();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  );


  /* =========================================================
     KEYBOARD SHORTCUTS
     ========================================================= */

  documentEditor.addEventListener(
    'keydown',
    function (event) {

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'b'
      ) {
        event.preventDefault();
        executeCommand('bold');
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'i'
      ) {
        event.preventDefault();
        executeCommand('italic');
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'u'
      ) {
        event.preventDefault();
        executeCommand('underline');
      }
    }
  );


  /* =========================================================
     INITIALIZE
     ========================================================= */

  updateCounts();
  updatePreview();

})();
