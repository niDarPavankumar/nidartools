/* =========================================================
   niDar Tools — EMI Calculator
   Complete Client-Side Calculator
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const loanAmount = document.getElementById("loanAmount");
  const interestRate = document.getElementById("interestRate");
  const loanTenure = document.getElementById("loanTenure");
  const tenureUnit = document.getElementById("tenureUnit");
  const extraPayment = document.getElementById("extraPayment");

  const calculateBtn = document.getElementById("calculateBtn");
  const resetBtn = document.getElementById("resetBtn");
  const inputError = document.getElementById("inputError");

  const monthlyEmi = document.getElementById("monthlyEmi");
  const emiResultNote = document.getElementById("emiResultNote");

  const principalAmount = document.getElementById("principalAmount");
  const totalInterest = document.getElementById("totalInterest");
  const totalPayment = document.getElementById("totalPayment");
  const totalMonths = document.getElementById("totalMonths");

  const principalBar = document.getElementById("principalBar");
  const interestBar = document.getElementById("interestBar");

  const principalPercent = document.getElementById("principalPercent");
  const interestPercent = document.getElementById("interestPercent");

  const extraPaymentResult =
    document.getElementById("extraPaymentResult");

  const newMonthlyPayment =
    document.getElementById("newMonthlyPayment");

  const interestSaved =
    document.getElementById("interestSaved");

  const timeSaved =
    document.getElementById("timeSaved");

  const showScheduleBtn =
    document.getElementById("showScheduleBtn");

  const scheduleContainer =
    document.getElementById("scheduleContainer");

  const scheduleBody =
    document.getElementById("scheduleBody");

  const scheduleTitle =
    document.getElementById("scheduleTitle");

  const scheduleInfo =
    document.getElementById("scheduleInfo");


  /* =======================================================
     STATE
     ======================================================= */

  let currentCalculation = null;
  let currentSchedule = [];


  /* =======================================================
     FORMATTERS
     ======================================================= */

  function formatCurrency(value) {
    if (!Number.isFinite(value)) {
      return "₹0";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  }


  function formatCurrencyDecimal(value) {
    if (!Number.isFinite(value)) {
      return "₹0.00";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }


  function formatNumber(value) {
    if (!Number.isFinite(value)) {
      return "0";
    }

    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0
    }).format(value);
  }


  /* =======================================================
     INPUT HELPERS
     ======================================================= */

  function getNumber(input) {
    return Number.parseFloat(input.value);
  }


  function getTenureMonths() {
    const tenure = getNumber(loanTenure);

    if (!Number.isFinite(tenure) || tenure <= 0) {
      return 0;
    }

    if (tenureUnit.value === "years") {
      return Math.round(tenure * 12);
    }

    return Math.round(tenure);
  }


  /* =======================================================
     VALIDATION
     ======================================================= */

  function validateInputs() {

    const amount = getNumber(loanAmount);
    const rate = getNumber(interestRate);
    const tenure = getNumber(loanTenure);
    const extra = getNumber(extraPayment) || 0;

    if (!Number.isFinite(amount) || amount <= 0) {
      return "Please enter a valid loan amount.";
    }

    if (!Number.isFinite(rate) || rate < 0) {
      return "Please enter a valid interest rate.";
    }

    if (!Number.isFinite(tenure) || tenure <= 0) {
      return "Please enter a valid loan tenure.";
    }

    if (!Number.isFinite(extra) || extra < 0) {
      return "Please enter a valid extra monthly payment.";
    }

    const months = getTenureMonths();

    if (months < 1) {
      return "Loan tenure must be at least 1 month.";
    }

    if (months > 600) {
      return "Loan tenure cannot exceed 50 years.";
    }

    if (extra >= amount) {
      return "Extra monthly payment should be lower than the loan amount.";
    }

    return "";
  }


  function showError(message) {
    inputError.textContent = message || "";
  }


  /* =======================================================
     EMI FORMULA
     =======================================================

     EMI = P × r × (1+r)^n / ((1+r)^n - 1)

     P = Principal
     r = Monthly interest rate
     n = Number of months
     ======================================================= */

  function calculateBaseEmi(principal, annualRate, months) {

    if (months <= 0) {
      return 0;
    }

    if (annualRate === 0) {
      return principal / months;
    }

    const monthlyRate = annualRate / 100 / 12;

    const factor = Math.pow(
      1 + monthlyRate,
      months
    );

    return (
      principal *
      monthlyRate *
      factor /
      (factor - 1)
    );
  }


  /* =======================================================
     STANDARD AMORTIZATION
     ======================================================= */

  function buildSchedule(
    principal,
    annualRate,
    months,
    payment
  ) {

    const schedule = [];

    let balance = principal;
    let totalInterestValue = 0;

    const monthlyRate =
      annualRate / 100 / 12;

    for (let month = 1; month <= months; month++) {

      if (balance <= 0.005) {
        break;
      }

      const openingBalance = balance;

      let interest = 0;

      if (monthlyRate > 0) {
        interest = balance * monthlyRate;
      }

      let principalPart =
        payment - interest;

      if (principalPart < 0) {
        principalPart = 0;
      }

      let actualPayment =
        payment;

      if (principalPart > balance) {
        principalPart = balance;
        actualPayment =
          principalPart + interest;
      }

      balance -= principalPart;

      if (balance < 0.005) {
        balance = 0;
      }

      totalInterestValue += interest;

      schedule.push({
        month,
        openingBalance,
        payment: actualPayment,
        principal: principalPart,
        interest,
        closingBalance: balance
      });

      if (balance <= 0) {
        break;
      }
    }

    return {
      schedule,
      totalInterest: totalInterestValue,
      totalPayment:
        principal + totalInterestValue
    };
  }


  /* =======================================================
     EXTRA PAYMENT SCHEDULE
     ======================================================= */

  function buildExtraPaymentSchedule(
    principal,
    annualRate,
    originalEmi,
    extra
  ) {

    const payment =
      originalEmi + extra;

    if (extra <= 0) {
      return {
        schedule: [],
        totalInterest: 0,
        totalPayment: 0
      };
    }

    const monthlyRate =
      annualRate / 100 / 12;

    const schedule = [];

    let balance = principal;
    let totalInterestValue = 0;
    let month = 0;

    const safetyLimit = 1200;

    while (balance > 0.005 && month < safetyLimit) {

      month++;

      const openingBalance = balance;

      let interest = 0;

      if (monthlyRate > 0) {
        interest = balance * monthlyRate;
      }

      let principalPart =
        payment - interest;

      if (principalPart <= 0) {
        break;
      }

      let actualPayment =
        payment;

      if (principalPart > balance) {
        principalPart = balance;
        actualPayment =
          principalPart + interest;
      }

      balance -= principalPart;

      if (balance < 0.005) {
        balance = 0;
      }

      totalInterestValue += interest;

      schedule.push({
        month,
        openingBalance,
        payment: actualPayment,
        principal: principalPart,
        interest,
        closingBalance: balance
      });
    }

    return {
      schedule,
      totalInterest: totalInterestValue,
      totalPayment:
        principal + totalInterestValue
    };
  }


  /* =======================================================
     DISPLAY RESULT
     ======================================================= */

  function displayCalculation(data) {

    const {
      principal,
      annualRate,
      months,
      emi,
      baseSchedule,
      extra,
      extraSchedule
    } = data;

    const interest =
      baseSchedule.totalInterest;

    const payment =
      baseSchedule.totalPayment;

    monthlyEmi.textContent =
      formatCurrencyDecimal(emi);

    principalAmount.textContent =
      formatCurrency(principal);

    totalInterest.textContent =
      formatCurrency(interest);

    totalPayment.textContent =
      formatCurrency(payment);

    totalMonths.textContent =
      formatNumber(months);

    emiResultNote.textContent =
      `${formatNumber(months)} monthly payments at ${annualRate}% annual interest.`;

    const total =
      principal + interest;

    let principalRatio = 0;
    let interestRatio = 0;

    if (total > 0) {
      principalRatio =
        (principal / total) * 100;

      interestRatio =
        (interest / total) * 100;
    }

    principalBar.style.width =
      `${principalRatio}%`;

    interestBar.style.width =
      `${interestRatio}%`;

    principalPercent.textContent =
      `${principalRatio.toFixed(1)}%`;

    interestPercent.textContent =
      `${interestRatio.toFixed(1)}%`;


    /* -----------------------------------------------------
       Extra Payment
       ----------------------------------------------------- */

    if (extra > 0 && extraSchedule.length > 0) {

      const extraInterest =
        extraSchedule.totalInterest;

      const savedInterest =
        Math.max(
          0,
          interest - extraInterest
        );

      const savedMonths =
        Math.max(
          0,
          baseSchedule.schedule.length -
          extraSchedule.schedule.length
        );

      newMonthlyPayment.textContent =
        formatCurrencyDecimal(
          emi + extra
        );

      interestSaved.textContent =
        formatCurrency(savedInterest);

      timeSaved.textContent =
        `${formatNumber(savedMonths)} ${
          savedMonths === 1 ? "month" : "months"
        }`;

      extraPaymentResult.hidden = false;

    } else {

      extraPaymentResult.hidden = true;
    }


    /* -----------------------------------------------------
       Schedule
       ----------------------------------------------------- */

    currentSchedule =
      baseSchedule.schedule;

    scheduleTitle.textContent =
      "Repayment Schedule";

    scheduleInfo.textContent =
      `${formatNumber(currentSchedule.length)} payment ${
        currentSchedule.length === 1
          ? "month"
          : "months"
      }`;

    renderSchedule(currentSchedule);
  }


  /* =======================================================
     RENDER SCHEDULE
     ======================================================= */

  function renderSchedule(schedule) {

    scheduleBody.innerHTML = "";

    if (!schedule || schedule.length === 0) {
      return;
    }

    const fragment =
      document.createDocumentFragment();

    schedule.forEach(row => {

      const tr =
        document.createElement("tr");

      const values = [
        row.month,
        formatCurrency(row.openingBalance),
        formatCurrency(row.payment),
        formatCurrency(row.principal),
        formatCurrency(row.interest),
        formatCurrency(row.closingBalance)
      ];

      values.forEach((value, index) => {

        const td =
          document.createElement("td");

        td.textContent = value;

        if (index === 0) {
          td.style.textAlign = "center";
        }

        tr.appendChild(td);
      });

      fragment.appendChild(tr);
    });

    scheduleBody.appendChild(fragment);
  }


  /* =======================================================
     CALCULATE
     ======================================================= */

  function calculate() {

    showError("");

    const error =
      validateInputs();

    if (error) {
      showError(error);
      return;
    }

    const principal =
      getNumber(loanAmount);

    const annualRate =
      getNumber(interestRate);

    const months =
      getTenureMonths();

    const extra =
      getNumber(extraPayment) || 0;

    const emi =
      calculateBaseEmi(
        principal,
        annualRate,
        months
      );

    const baseSchedule =
      buildSchedule(
        principal,
        annualRate,
        months,
        emi
      );

    const extraSchedule =
      buildExtraPaymentSchedule(
        principal,
        annualRate,
        emi,
        extra
      );

    currentCalculation = {
      principal,
      annualRate,
      months,
      emi,
      baseSchedule,
      extra,
      extraSchedule
    };

    displayCalculation(
      currentCalculation
    );

    scheduleContainer.hidden = true;

    calculateBtn.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }


  /* =======================================================
     RESET
     ======================================================= */

  function resetCalculator() {

    loanAmount.value = "500000";
    interestRate.value = "8.5";
    loanTenure.value = "5";
    tenureUnit.value = "years";
    extraPayment.value = "0";

    showError("");

    monthlyEmi.textContent = "₹0";
    emiResultNote.textContent =
      "Calculate your loan to see results.";

    principalAmount.textContent = "₹0";
    totalInterest.textContent = "₹0";
    totalPayment.textContent = "₹0";
    totalMonths.textContent = "0";

    principalBar.style.width = "0%";
    interestBar.style.width = "0%";

    principalPercent.textContent = "0%";
    interestPercent.textContent = "0%";

    extraPaymentResult.hidden = true;

    scheduleBody.innerHTML = "";

    scheduleContainer.hidden = true;

    scheduleTitle.textContent =
      "Repayment Schedule";

    scheduleInfo.textContent =
      "Calculate EMI to generate the schedule.";

    currentCalculation = null;
    currentSchedule = [];

    loanAmount.focus();
  }


  /* =======================================================
     SCHEDULE TOGGLE
     ======================================================= */

  function toggleSchedule() {

    if (!currentSchedule.length) {

      showError(
        "Please calculate the EMI first."
      );

      return;
    }

    scheduleContainer.hidden =
      !scheduleContainer.hidden;

    showScheduleBtn.textContent =
      scheduleContainer.hidden
        ? "View Schedule"
        : "Hide Schedule";

    if (!scheduleContainer.hidden) {

      scheduleContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }


  /* =======================================================
     INPUT EVENTS
     ======================================================= */

  [
    loanAmount,
    interestRate,
    loanTenure,
    extraPayment
  ].forEach(input => {

    input.addEventListener(
      "input",
      () => {
        showError("");
      }
    );

    input.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {
          event.preventDefault();
          calculate();
        }
      }
    );
  });


  tenureUnit.addEventListener(
    "change",
    () => {
      showError("");
    }
  );


  /* =======================================================
     BUTTON EVENTS
     ======================================================= */

  calculateBtn.addEventListener(
    "click",
    calculate
  );

  resetBtn.addEventListener(
    "click",
    resetCalculator
  );

  showScheduleBtn.addEventListener(
    "click",
    toggleSchedule
  );


  /* =======================================================
     INITIAL CALCULATION
     ======================================================= */

  calculate();

})();
