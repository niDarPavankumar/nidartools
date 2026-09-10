(function () {
  'use strict';

  /* =========================================================
     niDar Tools — Word & Character Counter
     Tool #10 — Client-side JavaScript
     ========================================================= */

  const textInput = document.getElementById('textInput');

  const inputStatus = document.getElementById('inputStatus');
  const liveCharacters = document.getElementById('liveCharacters');

  const wordCount = document.getElementById('wordCount');
  const characterCount = document.getElementById('characterCount');
  const characterNoSpacesCount =
    document.getElementById('characterNoSpacesCount');
  const sentenceCount = document.getElementById('sentenceCount');
  const paragraphCount = document.getElementById('paragraphCount');
  const lineCount = document.getElementById('lineCount');

  const readingTime = document.getElementById('readingTime');
  const speakingTime = document.getElementById('speakingTime');

  const averageWordLength =
    document.getElementById('averageWordLength');

  const averageSentenceLength =
    document.getElementById('averageSentenceLength');

  const longestWord =
    document.getElementById('longestWord');

  const spaceCount =
    document.getElementById('spaceCount');

  const clearTextBtn =
    document.getElementById('clearTextBtn');

  const sampleTextBtn =
    document.getElementById('sampleTextBtn');

  const uppercaseBtn =
    document.getElementById('uppercaseBtn');

  const lowercaseBtn =
    document.getElementById('lowercaseBtn');

  const capitalizeBtn =
    document.getElementById('capitalizeBtn');

  const removeExtraSpacesBtn =
    document.getElementById('removeExtraSpacesBtn');

  const startCountingBtn =
    document.getElementById('startCountingBtn');


  /* =========================================================
     SAMPLE TEXT
     ========================================================= */

  const sampleText =
    `niDar Tools provides simple and useful online tools.

This Word and Character Counter helps you count words, characters,
sentences and paragraphs instantly.

Your text is processed directly in your browser, making the tool
fast, convenient and private.`;


  /* =========================================================
     FORMAT NUMBER
     ========================================================= */

  function formatNumber(number) {
    if (!Number.isFinite(number)) {
      return '0';
    }

    return number.toLocaleString('en-IN');
  }


  /* =========================================================
     GET WORDS
     ========================================================= */

  function getWords(text) {
    const cleanText = text.trim();

    if (!cleanText) {
      return [];
    }

    return cleanText.match(/\S+/g) || [];
  }


  /* =========================================================
     GET SENTENCES
     ========================================================= */

  function getSentences(text) {
    const cleanText = text.trim();

    if (!cleanText) {
      return [];
    }

    return cleanText
      .split(/[.!?]+(?:\s+|$)/)
      .map(function (sentence) {
        return sentence.trim();
      })
      .filter(Boolean);
  }


  /* =========================================================
     GET PARAGRAPHS
     ========================================================= */

  function getParagraphs(text) {
    const cleanText = text.trim();

    if (!cleanText) {
      return [];
    }

    return cleanText
      .split(/\n\s*\n+/)
      .map(function (paragraph) {
        return paragraph.trim();
      })
      .filter(Boolean);
  }


  /* =========================================================
     COUNT LINES
     ========================================================= */

  function getLineCount(text) {
    if (!text) {
      return 0;
    }

    return text.split(/\r\n|\r|\n/).length;
  }


  /* =========================================================
     READING TIME
     Average reading speed = 200 words/minute
     ========================================================= */

  function getReadingTime(words) {
    if (words === 0) {
      return '0 min';
    }

    const minutes = words / 200;

    if (minutes < 1) {
      return '< 1 min';
    }

    if (minutes < 10) {
      return minutes.toFixed(1) + ' min';
    }

    return Math.ceil(minutes) + ' min';
  }


  /* =========================================================
     SPEAKING TIME
     Average speaking speed = 130 words/minute
     ========================================================= */

  function getSpeakingTime(words) {
    if (words === 0) {
      return '0 min';
    }

    const minutes = words / 130;

    if (minutes < 1) {
      return '< 1 min';
    }

    if (minutes < 10) {
      return minutes.toFixed(1) + ' min';
    }

    return Math.ceil(minutes) + ' min';
  }


  /* =========================================================
     CAPITALIZE
     ========================================================= */

  function capitalizeText(text) {
    return text
      .toLowerCase()
      .replace(/(^|[.!?]\s+)([a-z\u00C0-\u024F])/g, function (
        match,
        prefix,
        letter
      ) {
        return prefix + letter.toUpperCase();
      });
  }


  /* =========================================================
     UPDATE STATISTICS
     ========================================================= */

  function updateStatistics() {
    const text = textInput.value;

    const words = getWords(text);
    const sentences = getSentences(text);
    const paragraphs = getParagraphs(text);

    const characters = text.length;

    const charactersWithoutSpaces =
      text.replace(/\s/g, '').length;

    const spaces =
      (text.match(/ /g) || []).length;

    const lines =
      getLineCount(text);


    /* ---------- Basic counts ---------- */

    wordCount.textContent =
      formatNumber(words.length);

    characterCount.textContent =
      formatNumber(characters);

    characterNoSpacesCount.textContent =
      formatNumber(charactersWithoutSpaces);

    sentenceCount.textContent =
      formatNumber(sentences.length);

    paragraphCount.textContent =
      formatNumber(paragraphs.length);

    lineCount.textContent =
      formatNumber(lines);

    liveCharacters.textContent =
      formatNumber(characters);

    spaceCount.textContent =
      formatNumber(spaces);


    /* ---------- Reading / speaking ---------- */

    readingTime.textContent =
      getReadingTime(words.length);

    speakingTime.textContent =
      getSpeakingTime(words.length);


    /* ---------- Average word length ---------- */

    if (words.length > 0) {
      const totalWordCharacters =
        words.reduce(function (total, word) {
          return total + word.length;
        }, 0);

      const average =
        totalWordCharacters / words.length;

      averageWordLength.textContent =
        average.toFixed(1) + ' characters';
    } else {
      averageWordLength.textContent =
        '0 characters';
    }


    /* ---------- Average sentence length ---------- */

    if (sentences.length > 0 && words.length > 0) {
      const averageSentence =
        words.length / sentences.length;

      averageSentenceLength.textContent =
        averageSentence.toFixed(1) + ' words';
    } else {
      averageSentenceLength.textContent =
        '0 words';
    }


    /* ---------- Longest word ---------- */

    if (words.length > 0) {
      let longest = '';

      words.forEach(function (word) {
        const cleaned =
          word.replace(
            /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,
            ''
          );

        if (cleaned.length > longest.length) {
          longest = cleaned;
        }
      });

      longestWord.textContent =
        longest || '—';
    } else {
      longestWord.textContent =
        '—';
    }


    /* ---------- Status ---------- */

    if (text.trim()) {
      inputStatus.textContent =
        'Counting live';

      inputStatus.style.color =
        '#008f3c';
    } else {
      inputStatus.textContent =
        'Ready';

      inputStatus.style.color =
        '';
    }
  }


  /* =========================================================
     CLEAR TEXT
     ========================================================= */

  function clearText() {
    textInput.value = '';

    updateStatistics();

    textInput.focus();
  }


  /* =========================================================
     SAMPLE TEXT
     ========================================================= */

  function loadSampleText() {
    textInput.value = sampleText;

    updateStatistics();

    textInput.focus();

    textInput.setSelectionRange(
      textInput.value.length,
      textInput.value.length
    );
  }


  /* =========================================================
     UPPERCASE
     ========================================================= */

  function convertUppercase() {
    if (!textInput.value) {
      textInput.focus();
      return;
    }

    textInput.value =
      textInput.value.toUpperCase();

    updateStatistics();

    textInput.focus();
  }


  /* =========================================================
     LOWERCASE
     ========================================================= */

  function convertLowercase() {
    if (!textInput.value) {
      textInput.focus();
      return;
    }

    textInput.value =
      textInput.value.toLowerCase();

    updateStatistics();

    textInput.focus();
  }


  /* =========================================================
     CAPITALIZE
     ========================================================= */

  function convertCapitalize() {
    if (!textInput.value) {
      textInput.focus();
      return;
    }

    textInput.value =
      capitalizeText(textInput.value);

    updateStatistics();

    textInput.focus();
  }


  /* =========================================================
     REMOVE EXTRA SPACES
     ========================================================= */

  function removeExtraSpaces() {
    if (!textInput.value) {
      textInput.focus();
      return;
    }

    textInput.value =
      textInput.value
        .replace(/[ \t]+/g, ' ')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    updateStatistics();

    textInput.focus();
  }


  /* =========================================================
     SCROLL TO COUNTER
     ========================================================= */

  function startCounting() {
    textInput.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    setTimeout(function () {
      textInput.focus();
    }, 450);
  }


  /* =========================================================
     EVENT LISTENERS
     ========================================================= */

  textInput.addEventListener(
    'input',
    updateStatistics
  );


  clearTextBtn.addEventListener(
    'click',
    clearText
  );


  sampleTextBtn.addEventListener(
    'click',
    loadSampleText
  );


  uppercaseBtn.addEventListener(
    'click',
    convertUppercase
  );


  lowercaseBtn.addEventListener(
    'click',
    convertLowercase
  );


  capitalizeBtn.addEventListener(
    'click',
    convertCapitalize
  );


  removeExtraSpacesBtn.addEventListener(
    'click',
    removeExtraSpaces
  );


  startCountingBtn.addEventListener(
    'click',
    startCounting
  );


  /* =========================================================
     INITIAL STATE
     ========================================================= */

  updateStatistics();

})();
