(function () {
  'use strict';

  /* =========================================================
     ELEMENTS
     ========================================================= */

  const jsonInput = document.getElementById('jsonInput');
  const jsonOutput = document.getElementById('jsonOutput');

  const inputStatus = document.getElementById('inputStatus');
  const inputSize = document.getElementById('inputSize');

  const resultStatus = document.getElementById('resultStatus');
  const resultSize = document.getElementById('resultSize');

  const sampleBtn = document.getElementById('sampleBtn');
  const formatBtn = document.getElementById('formatBtn');
  const validateBtn = document.getElementById('validateBtn');
  const minifyBtn = document.getElementById('minifyBtn');
  const clearBtn = document.getElementById('clearBtn');

  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  const validationResult = document.getElementById('validationResult');
  const validationIcon = document.getElementById('validationIcon');
  const validationTitle = document.getElementById('validationTitle');
  const validationMessage = document.getElementById('validationMessage');

  const indentSize = document.getElementById('indentSize');
  const sortKeys = document.getElementById('sortKeys');
  const escapeUnicode = document.getElementById('escapeUnicode');

  const beautifyBtn = document.getElementById('beautifyBtn');
  const compactBtn = document.getElementById('compactBtn');
  const copyInputBtn = document.getElementById('copyInputBtn');
  const swapBtn = document.getElementById('swapBtn');


  /* =========================================================
     SAMPLE JSON
     ========================================================= */

  const SAMPLE_JSON = {
    name: 'niDar Tools',
    version: 1,
    website: 'https://nidartools.com/',
    active: true,
    categories: [
      'Image Tools',
      'PDF & Document',
      'Calculators',
      'Developer Tools'
    ],
    tools: {
      jsonFormatter: {
        enabled: true,
        features: [
          'Format',
          'Validate',
          'Minify'
        ]
      }
    },
    privacy: {
      clientSide: true,
      uploadRequired: false
    }
  };


  /* =========================================================
     HELPERS
     ========================================================= */

  function getIndent() {
    const value = indentSize.value;

    if (value === 'tab') {
      return '\t';
    }

    return Number(value);
  }


  function formatBytes(bytes) {
    if (bytes < 1024) {
      return bytes + ' B';
    }

    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }

    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }


  function updateInputInfo() {
    const text = jsonInput.value;

    inputSize.textContent =
      text.length.toLocaleString() + ' characters';

    if (!text.trim()) {
      inputStatus.textContent = 'Ready';
      return;
    }

    inputStatus.textContent = 'JSON entered';
  }


  function updateResultInfo(text) {
    const value = text || '';

    resultSize.textContent =
      value.length.toLocaleString() + ' characters';

    if (!value.trim()) {
      resultStatus.textContent = 'Waiting for JSON';
    }
  }


  function setValidation(valid, title, message) {
    validationResult.hidden = false;

    validationResult.classList.toggle('invalid', !valid);

    validationIcon.textContent = valid ? '✓' : '✕';
    validationTitle.textContent = title;
    validationMessage.textContent = message;
  }


  function clearValidation() {
    validationResult.hidden = true;
    validationResult.classList.remove('invalid');
  }


  /* =========================================================
     SORT OBJECT KEYS
     ========================================================= */

  function sortObjectKeys(value) {
    if (Array.isArray(value)) {
      return value.map(sortObjectKeys);
    }

    if (value !== null && typeof value === 'object') {
      const sorted = {};

      Object.keys(value)
        .sort(function (a, b) {
          return a.localeCompare(b);
        })
        .forEach(function (key) {
          sorted[key] = sortObjectKeys(value[key]);
        });

      return sorted;
    }

    return value;
  }


  /* =========================================================
     UNICODE ESCAPING
     ========================================================= */

  function escapeUnicodeCharacters(text) {
    return text.replace(
      /[\u0080-\uFFFF]/g,
      function (char) {
        return '\\u' +
          char.charCodeAt(0)
            .toString(16)
            .padStart(4, '0');
      }
    );
  }


  /* =========================================================
     PARSE JSON
     ========================================================= */

  function parseInput() {
    const raw = jsonInput.value.trim();

    if (!raw) {
      setValidation(
        false,
        'No JSON provided',
        'Please enter or paste JSON data first.'
      );

      return null;
    }

    try {
      const parsed = JSON.parse(raw);

      setValidation(
        true,
        'Valid JSON',
        'Your JSON syntax is valid and ready to process.'
      );

      return parsed;

    } catch (error) {

      setValidation(
        false,
        'Invalid JSON',
        getReadableError(error)
      );

      return null;
    }
  }


  /* =========================================================
     ERROR MESSAGE
     ========================================================= */

  function getReadableError(error) {
    if (!error || !error.message) {
      return 'The JSON contains a syntax error.';
    }

    return error.message;
  }


  /* =========================================================
     SERIALIZE JSON
     ========================================================= */

  function serializeJSON(data, pretty) {

    let value = data;

    if (sortKeys.value === 'sort') {
      value = sortObjectKeys(value);
    }

    let result;

    if (pretty) {
      result = JSON.stringify(value, null, getIndent());
    } else {
      result = JSON.stringify(value);
    }

    if (escapeUnicode.value === 'escape') {
      result = escapeUnicodeCharacters(result);
    }

    return result;
  }


  /* =========================================================
     SHOW RESULT
     ========================================================= */

  function showResult(text, status) {

    jsonOutput.value = text;

    resultStatus.textContent =
      status || 'Completed';

    updateResultInfo(text);
  }


  /* =========================================================
     FORMAT JSON
     ========================================================= */

  function formatJSON() {

    const data = parseInput();

    if (data === null) {
      jsonOutput.value = '';
      resultStatus.textContent = 'Invalid JSON';
      resultSize.textContent = '0 characters';
      return;
    }

    const formatted = serializeJSON(data, true);

    showResult(
      formatted,
      'Formatted successfully'
    );
  }


  /* =========================================================
     MINIFY JSON
     ========================================================= */

  function minifyJSON() {

    const data = parseInput();

    if (data === null) {
      return;
    }

    const minified = serializeJSON(data, false);

    showResult(
      minified,
      'Minified successfully'
    );
  }


  /* =========================================================
     VALIDATE JSON
     ========================================================= */

  function validateJSON() {

    const data = parseInput();

    if (data === null) {
      resultStatus.textContent = 'Invalid JSON';
      return;
    }

    const type =
      Array.isArray(data)
        ? 'array'
        : typeof data === 'object' && data !== null
          ? 'object'
          : typeof data;

    showResult(
      JSON.stringify(data, null, getIndent()),
      'Valid JSON'
    );

    validationMessage.textContent =
      'Valid JSON detected. Root type: ' + type + '.';
  }


  /* =========================================================
     SAMPLE
     ========================================================= */

  function loadSample() {

    jsonInput.value =
      JSON.stringify(
        SAMPLE_JSON,
        null,
        2
      );

    updateInputInfo();
    clearValidation();

    resultStatus.textContent =
      'Sample loaded';

    jsonOutput.value = '';
    resultSize.textContent = '0 characters';

    jsonInput.focus();
  }


  /* =========================================================
     CLEAR
     ========================================================= */

  function clearAll() {

    jsonInput.value = '';
    jsonOutput.value = '';

    inputStatus.textContent = 'Ready';
    inputSize.textContent = '0 characters';

    resultStatus.textContent =
      'Waiting for JSON';

    resultSize.textContent =
      '0 characters';

    clearValidation();

    jsonInput.focus();
  }


  /* =========================================================
     COPY TEXT
     ========================================================= */

  async function copyText(text, button, originalLabel) {

    if (!text || !text.trim()) {
      return;
    }

    try {

      await navigator.clipboard.writeText(text);

      const oldLabel =
        button.textContent;

      button.textContent = '✓ Copied';

      setTimeout(function () {
        button.textContent =
          originalLabel || oldLabel;
      }, 1500);

    } catch (error) {

      const temporary =
        document.createElement('textarea');

      temporary.value = text;
      temporary.style.position = 'fixed';
      temporary.style.opacity = '0';

      document.body.appendChild(temporary);

      temporary.focus();
      temporary.select();

      try {
        document.execCommand('copy');

        button.textContent = '✓ Copied';

        setTimeout(function () {
          button.textContent =
            originalLabel || '📋 Copy';
        }, 1500);

      } catch (copyError) {
        alert('Copy failed. Please copy the text manually.');
      }

      temporary.remove();
    }
  }


  /* =========================================================
     COPY RESULT
     ========================================================= */

  function copyResult() {

    const text =
      jsonOutput.value.trim();

    if (!text) {
      alert('There is no formatted JSON to copy.');
      return;
    }

    copyText(
      text,
      copyBtn,
      '📋 Copy'
    );
  }


  /* =========================================================
     COPY INPUT
     ========================================================= */

  function copyInput() {

    const text =
      jsonInput.value.trim();

    if (!text) {
      alert('There is no JSON input to copy.');
      return;
    }

    copyText(
      text,
      copyInputBtn,
      'Copy Input'
    );
  }


  /* =========================================================
     DOWNLOAD JSON
     ========================================================= */

  function downloadJSON() {

    const text =
      jsonOutput.value.trim();

    if (!text) {
      alert('Please format or minify JSON before downloading.');
      return;
    }

    const blob =
      new Blob(
        [text],
        {
          type: 'application/json;charset=utf-8'
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;
    link.download = 'nidar-formatted.json';

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }


  /* =========================================================
     SWAP RESULT → INPUT
     ========================================================= */

  function swapJSON() {

    const result =
      jsonOutput.value.trim();

    if (!result) {
      alert('There is no result to move into the input.');
      return;
    }

    jsonInput.value =
      result;

    updateInputInfo();

    clearValidation();

    jsonInput.focus();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  /* =========================================================
     BEAUTIFY
     ========================================================= */

  function beautifyJSON() {
    formatJSON();
  }


  /* =========================================================
     COMPACT
     ========================================================= */

  function compactJSON() {
    minifyJSON();
  }


  /* =========================================================
     OPTION CHANGE
     ========================================================= */

  indentSize.addEventListener(
    'change',
    function () {

      if (!jsonInput.value.trim()) {
        return;
      }

      const data = parseInput();

      if (data !== null) {
        showResult(
          serializeJSON(data, true),
          'Formatting updated'
        );
      }
    }
  );


  sortKeys.addEventListener(
    'change',
    function () {

      if (!jsonInput.value.trim()) {
        return;
      }

      const data = parseInput();

      if (data !== null) {
        showResult(
          serializeJSON(data, true),
          'Formatting updated'
        );
      }
    }
  );


  escapeUnicode.addEventListener(
    'change',
    function () {

      if (!jsonInput.value.trim()) {
        return;
      }

      const data = parseInput();

      if (data !== null) {
        showResult(
          serializeJSON(data, true),
          'Formatting updated'
        );
      }
    }
  );


  /* =========================================================
     INPUT EVENTS
     ========================================================= */

  jsonInput.addEventListener(
    'input',
    function () {

      updateInputInfo();

      clearValidation();

      if (!jsonInput.value.trim()) {
        jsonOutput.value = '';
        resultStatus.textContent =
          'Waiting for JSON';
        resultSize.textContent =
          '0 characters';
      }
    }
  );


  /* =========================================================
     BUTTON EVENTS
     ========================================================= */

  sampleBtn.addEventListener(
    'click',
    loadSample
  );

  formatBtn.addEventListener(
    'click',
    formatJSON
  );

  beautifyBtn.addEventListener(
    'click',
    beautifyJSON
  );

  minifyBtn.addEventListener(
    'click',
    minifyJSON
  );

  compactBtn.addEventListener(
    'click',
    compactJSON
  );

  validateBtn.addEventListener(
    'click',
    validateJSON
  );

  clearBtn.addEventListener(
    'click',
    clearAll
  );

  copyBtn.addEventListener(
    'click',
    copyResult
  );

  copyInputBtn.addEventListener(
    'click',
    copyInput
  );

  downloadBtn.addEventListener(
    'click',
    downloadJSON
  );

  swapBtn.addEventListener(
    'click',
    swapJSON
  );


  /* =========================================================
     KEYBOARD SHORTCUTS
     ========================================================= */

  jsonInput.addEventListener(
    'keydown',
    function (event) {

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'Enter'
      ) {
        event.preventDefault();
        formatJSON();
      }

      if (event.key === 'Tab') {
        event.preventDefault();

        const start =
          jsonInput.selectionStart;

        const end =
          jsonInput.selectionEnd;

        const indentation =
          indentSize.value === 'tab'
            ? '\t'
            : ' '.repeat(
                Number(indentSize.value)
              );

        jsonInput.value =
          jsonInput.value.substring(0, start) +
          indentation +
          jsonInput.value.substring(end);

        jsonInput.selectionStart =
          jsonInput.selectionEnd =
            start + indentation.length;

        updateInputInfo();
      }
    }
  );


  /* =========================================================
     INITIAL STATE
     ========================================================= */

  updateInputInfo();
  updateResultInfo('');

})();
