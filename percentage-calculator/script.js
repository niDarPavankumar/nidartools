(function () {
  'use strict';

  /* =======================================================
     niDar Tools
     Percentage Calculator
     Client-side JavaScript
     ======================================================= */


  // -------------------------------------------------------
  // ELEMENT HELPER
  // -------------------------------------------------------

  function $(id) {
    return document.getElementById(id);
  }


  // -------------------------------------------------------
  // CALCULATOR 1 ELEMENTS
  // -------------------------------------------------------

  const percentOfPercent =
    $('percentOfPercent');

  const percentOfNumber =
    $('percentOfNumber');

  const calculatePercentOfBtn =
    $('calculatePercentOfBtn');

  const percentOfResult =
    $('percentOfResult');

  const percentOfResultValue =
    $('percentOfResultValue');

  const percentOfExplanation =
    $('percentOfExplanation');


  // -------------------------------------------------------
  // CALCULATOR 2 ELEMENTS
  // -------------------------------------------------------

  const whatPercentX =
    $('whatPercentX');

  const whatPercentY =
    $('whatPercentY');

  const calculateWhatPercentBtn =
    $('calculateWhatPercentBtn');

  const whatPercentResult =
    $('whatPercentResult');

  const whatPercentResultValue =
    $('whatPercentResultValue');

  const whatPercentExplanation =
    $('whatPercentExplanation');


  // -------------------------------------------------------
  // CALCULATOR 3 ELEMENTS
  // -------------------------------------------------------

  const isPercentX =
    $('isPercentX');

  const isPercentY =
    $('isPercentY');

  const calculateIsPercentBtn =
    $('calculateIsPercentBtn');

  const isPercentResult =
    $('isPercentResult');

  const isPercentResultValue =
    $('isPercentResultValue');

  const isPercentExplanation =
    $('isPercentExplanation');


  // -------------------------------------------------------
  // CALCULATOR 4 ELEMENTS
  // -------------------------------------------------------

  const changeOldValue =
    $('changeOldValue');

  const changeNewValue =
    $('changeNewValue');

  const calculateChangeBtn =
    $('calculateChangeBtn');

  const changeResult =
    $('changeResult');

  const changeResultValue =
    $('changeResultValue');

  const changeExplanation =
    $('changeExplanation');


  // -------------------------------------------------------
  // CALCULATOR 5 ELEMENTS
  // -------------------------------------------------------

  const increaseBase =
    $('increaseBase');

  const increasePercent =
    $('increasePercent');

  const increaseType =
    $('increaseType');

  const calculateIncreaseBtn =
    $('calculateIncreaseBtn');

  const increaseResult =
    $('increaseResult');

  const increaseResultValue =
    $('increaseResultValue');

  const increaseExplanation =
    $('increaseExplanation');


  // -------------------------------------------------------
  // CLEAR
  // -------------------------------------------------------

  const clearAllBtn =
    $('clearAllBtn');


  // -------------------------------------------------------
  // NUMBER FORMATTER
  // -------------------------------------------------------

  function formatNumber(value) {

    if (!Number.isFinite(value)) {
      return '0';
    }

    if (Number.isInteger(value)) {
      return value.toLocaleString('en-IN');
    }

    return value.toLocaleString(
      'en-IN',
      {
        maximumFractionDigits: 8
      }
    );
  }


  // -------------------------------------------------------
  // INPUT READER
  // -------------------------------------------------------

  function getNumber(input) {

    if (!input) {
      return NaN;
    }

    const value =
      Number(input.value);

    return Number.isFinite(value)
      ? value
      : NaN;
  }


  // -------------------------------------------------------
  // SHOW RESULT
  // -------------------------------------------------------

  function showResult(element) {

    if (!element) {
      return;
    }

    element.hidden = false;
  }


  // -------------------------------------------------------
  // ERROR MESSAGE
  // -------------------------------------------------------

  function showInputError(message) {
    alert(message);
  }


  // =======================================================
  // CALCULATOR 1
  // WHAT IS X% OF Y?
  // =======================================================

  function calculatePercentOf() {

    const percent =
      getNumber(percentOfPercent);

    const number =
      getNumber(percentOfNumber);


    if (
      !Number.isFinite(percent) ||
      !Number.isFinite(number)
    ) {

      showInputError(
        'कृपया Percentage आणि Number दोन्ही भरा.'
      );

      return;
    }


    const result =
      (percent / 100) * number;


    percentOfResultValue.textContent =
      formatNumber(result);


    percentOfExplanation.textContent =
      `${formatNumber(percent)}% × ${formatNumber(number)} = ${formatNumber(result)}`;


    showResult(percentOfResult);
  }


  // =======================================================
  // CALCULATOR 2
  // X IS WHAT % OF Y?
  // =======================================================

  function calculateWhatPercent() {

    const x =
      getNumber(whatPercentX);

    const y =
      getNumber(whatPercentY);


    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y)
    ) {

      showInputError(
        'कृपया X आणि Y दोन्ही values भरा.'
      );

      return;
    }


    if (y === 0) {

      showInputError(
        'Total value Y शून्य असू शकत नाही.'
      );

      return;
    }


    const result =
      (x / y) * 100;


    whatPercentResultValue.textContent =
      formatNumber(result) + '%';


    whatPercentExplanation.textContent =
      `${formatNumber(x)} ÷ ${formatNumber(y)} × 100 = ${formatNumber(result)}%`;


    showResult(whatPercentResult);
  }


  // =======================================================
  // CALCULATOR 3
  // X IS Y% OF WHAT?
  // =======================================================

  function calculateIsPercent() {

    const x =
      getNumber(isPercentX);

    const y =
      getNumber(isPercentY);


    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y)
    ) {

      showInputError(
        'कृपया Value आणि Percentage दोन्ही भरा.'
      );

      return;
    }


    if (y === 0) {

      showInputError(
        'Percentage शून्य असू शकत नाही.'
      );

      return;
    }


    const result =
      x / (y / 100);


    isPercentResultValue.textContent =
      formatNumber(result);


    isPercentExplanation.textContent =
      `${formatNumber(x)} ÷ (${formatNumber(y)} ÷ 100) = ${formatNumber(result)}`;


    showResult(isPercentResult);
  }


  // =======================================================
  // CALCULATOR 4
  // PERCENTAGE CHANGE
  // =======================================================

  function calculateChange() {

    const oldValue =
      getNumber(changeOldValue);

    const newValue =
      getNumber(changeNewValue);


    if (
      !Number.isFinite(oldValue) ||
      !Number.isFinite(newValue)
    ) {

      showInputError(
        'कृपया Original Value आणि New Value दोन्ही भरा.'
      );

      return;
    }


    if (oldValue === 0) {

      showInputError(
        'Original Value शून्य असल्यास percentage change calculate करता येत नाही.'
      );

      return;
    }


    const difference =
      newValue - oldValue;


    const percentage =
      (difference / Math.abs(oldValue)) * 100;


    changeResultValue.textContent =
      formatNumber(Math.abs(percentage)) + '%';


    if (difference > 0) {

      changeExplanation.textContent =
        `Value ${formatNumber(Math.abs(percentage))}% ने वाढली आहे.`;

    } else if (difference < 0) {

      changeExplanation.textContent =
        `Value ${formatNumber(Math.abs(percentage))}% ने कमी झाली आहे.`;

    } else {

      changeExplanation.textContent =
        'दोन्ही values समान आहेत. कोणताही बदल नाही.';

    }


    showResult(changeResult);
  }


  // =======================================================
  // CALCULATOR 5
  // PERCENTAGE INCREASE / DECREASE
  // =======================================================

  function calculateIncreaseDecrease() {

    const base =
      getNumber(increaseBase);

    const percent =
      getNumber(increasePercent);

    const operation =
      increaseType.value;


    if (
      !Number.isFinite(base) ||
      !Number.isFinite(percent)
    ) {

      showInputError(
        'कृपया Original Value आणि Percentage दोन्ही भरा.'
      );

      return;
    }


    let changeAmount;
    let finalValue;


    if (operation === 'decrease') {

      changeAmount =
        (base * percent) / 100;

      finalValue =
        base - changeAmount;

    } else {

      changeAmount =
        (base * percent) / 100;

      finalValue =
        base + changeAmount;
    }


    increaseResultValue.textContent =
      formatNumber(finalValue);


    if (operation === 'decrease') {

      increaseExplanation.textContent =
        `${formatNumber(base)} मधून ${formatNumber(changeAmount)} वजा केले → ${formatNumber(finalValue)}`;

    } else {

      increaseExplanation.textContent =
        `${formatNumber(base)} मध्ये ${formatNumber(changeAmount)} जोडले → ${formatNumber(finalValue)}`;
    }


    showResult(increaseResult);
  }


  // =======================================================
  // CLEAR ALL
  // =======================================================

  function clearAll() {

    const inputs = [
      percentOfPercent,
      percentOfNumber,
      whatPercentX,
      whatPercentY,
      isPercentX,
      isPercentY,
      changeOldValue,
      changeNewValue,
      increaseBase,
      increasePercent
    ];


    inputs.forEach(
      function (input) {

        if (input) {
          input.value = '';
        }
      }
    );


    increaseType.value =
      'increase';


    const results = [
      percentOfResult,
      whatPercentResult,
      isPercentResult,
      changeResult,
      increaseResult
    ];


    results.forEach(
      function (result) {

        if (result) {
          result.hidden = true;
        }
      }
    );


    percentOfResultValue.textContent =
      '0';

    whatPercentResultValue.textContent =
      '0%';

    isPercentResultValue.textContent =
      '0';

    changeResultValue.textContent =
      '0%';

    increaseResultValue.textContent =
      '0';


    percentOfExplanation.textContent =
      '—';

    whatPercentExplanation.textContent =
      '—';

    isPercentExplanation.textContent =
      '—';

    changeExplanation.textContent =
      '—';

    increaseExplanation.textContent =
      '—';


    percentOfPercent.focus();
  }


  // =======================================================
  // ENTER KEY SUPPORT
  // =======================================================

  function addEnterSupport(
    inputs,
    callback
  ) {

    inputs.forEach(
      function (input) {

        if (!input) {
          return;
        }

        input.addEventListener(
          'keydown',
          function (event) {

            if (event.key === 'Enter') {

              event.preventDefault();

              callback();
            }
          }
        );
      }
    );
  }


  // -------------------------------------------------------
  // BUTTON EVENTS
  // -------------------------------------------------------

  calculatePercentOfBtn.addEventListener(
    'click',
    calculatePercentOf
  );


  calculateWhatPercentBtn.addEventListener(
    'click',
    calculateWhatPercent
  );


  calculateIsPercentBtn.addEventListener(
    'click',
    calculateIsPercent
  );


  calculateChangeBtn.addEventListener(
    'click',
    calculateChange
  );


  calculateIncreaseBtn.addEventListener(
    'click',
    calculateIncreaseDecrease
  );


  clearAllBtn.addEventListener(
    'click',
    clearAll
  );


  // -------------------------------------------------------
  // ENTER SUPPORT
  // -------------------------------------------------------

  addEnterSupport(
    [
      percentOfPercent,
      percentOfNumber
    ],
    calculatePercentOf
  );


  addEnterSupport(
    [
      whatPercentX,
      whatPercentY
    ],
    calculateWhatPercent
  );


  addEnterSupport(
    [
      isPercentX,
      isPercentY
    ],
    calculateIsPercent
  );


  addEnterSupport(
    [
      changeOldValue,
      changeNewValue
    ],
    calculateChange
  );


  addEnterSupport(
    [
      increaseBase,
      increasePercent
    ],
    calculateIncreaseDecrease
  );


  // =======================================================
  // BASIC HTML SAFETY CHECK
  // =======================================================

  const requiredElements = [
    percentOfPercent,
    percentOfNumber,
    calculatePercentOfBtn,
    percentOfResult,
    percentOfResultValue,
    percentOfExplanation,

    whatPercentX,
    whatPercentY,
    calculateWhatPercentBtn,
    whatPercentResult,
    whatPercentResultValue,
    whatPercentExplanation,

    isPercentX,
    isPercentY,
    calculateIsPercentBtn,
    isPercentResult,
    isPercentResultValue,
    isPercentExplanation,

    changeOldValue,
    changeNewValue,
    calculateChangeBtn,
    changeResult,
    changeResultValue,
    changeExplanation,

    increaseBase,
    increasePercent,
    increaseType,
    calculateIncreaseBtn,
    increaseResult,
    increaseResultValue,
    increaseExplanation,

    clearAllBtn
  ];


  const missingElements =
    requiredElements.filter(
      function (element) {
        return !element;
      }
    );


  if (missingElements.length) {

    console.warn(
      'Percentage Calculator: some required HTML elements are missing.'
    );

  }


})();
