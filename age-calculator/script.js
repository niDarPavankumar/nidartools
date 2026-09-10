(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const birthDateInput = $("birthDate");
  const calculateDateInput = $("calculateDate");
  const calculateBtn = $("calculateBtn");
  const todayBtn = $("todayBtn");
  const resetBtn = $("resetBtn");

  const resultSection = $("resultSection");
  const yearsResult = $("yearsResult");
  const monthsResult = $("monthsResult");
  const daysResult = $("daysResult");
  const resultSummary = $("resultSummary");

  const totalDays = $("totalDays");
  const totalWeeks = $("totalWeeks");
  const totalHours = $("totalHours");
  const birthdayInfo = $("birthdayInfo");

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function dateToInputValue(date) {
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join("-");
  }

  function parseDate(value) {
    if (!value) return null;

    const parts = value.split("-").map(Number);

    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      return null;
    }

    const [year, month, day] = parts;
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  function setToday() {
    const today = new Date();

    calculateDateInput.value = dateToInputValue(today);

    if (!birthDateInput.value) {
      return;
    }

    calculateAge();
  }

  function daysInMonth(year, monthIndex) {
    return new Date(
      year,
      monthIndex + 1,
      0
    ).getDate();
  }

  function birthdayInYear(birthDate, year) {
    const month = birthDate.getMonth();
    const day = birthDate.getDate();

    /*
     * For a February 29 birthday in a non-leap year,
     * use February 28 as the calendar birthday.
     */
    if (
      month === 1 &&
      day === 29 &&
      daysInMonth(year, month) < 29
    ) {
      return new Date(year, 1, 28);
    }

    return new Date(year, month, day);
  }

  function calculateCalendarAge(birthDate, endDate) {
    let years =
      endDate.getFullYear() -
      birthDate.getFullYear();

    let months =
      endDate.getMonth() -
      birthDate.getMonth();

    let days =
      endDate.getDate() -
      birthDate.getDate();

    if (days < 0) {
      months--;

      const previousMonthDays = daysInMonth(
        endDate.getFullYear(),
        endDate.getMonth() - 1
      );

      days += previousMonthDays;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return {
      years,
      months,
      days
    };
  }

  function calculateTotalDays(start, end) {
    const startUtc = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );

    const endUtc = Date.UTC(
      end.getFullYear(),
      end.getMonth(),
      end.getDate()
    );

    return Math.floor(
      (endUtc - startUtc) /
      (1000 * 60 * 60 * 24)
    );
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-IN").format(value);
  }

  function getOrdinal(day) {
    const lastTwo = day % 100;

    if (
      lastTwo >= 11 &&
      lastTwo <= 13
    ) {
      return `${day}th`;
    }

    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  }

  function formatDate(date) {
    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );
  }

  function getDayName(date) {
    return date.toLocaleDateString(
      "en-IN",
      {
        weekday: "long"
      }
    );
  }

  function getNextBirthday(birthDate, fromDate) {
    let year = fromDate.getFullYear();

    let birthday = birthdayInYear(
      birthDate,
      year
    );

    const fromOnly = new Date(
      fromDate.getFullYear(),
      fromDate.getMonth(),
      fromDate.getDate()
    );

    if (birthday < fromOnly) {
      year++;
      birthday = birthdayInYear(
        birthDate,
        year
      );
    }

    return birthday;
  }

  function calculateBirthdayInfo(
    birthDate,
    endDate
  ) {
    const nextBirthday = getNextBirthday(
      birthDate,
      endDate
    );

    const daysUntil =
      calculateTotalDays(
        endDate,
        nextBirthday
      );

    const birthdayName =
      getDayName(nextBirthday);

    if (daysUntil === 0) {
      return `🎂 Happy Birthday! Today is your birthday. You are ${getOrdinal(
        birthDate.getDate()
      )} birthday today.`;
    }

    return (
      `🎂 Your next birthday is on ` +
      `${formatDate(nextBirthday)} ` +
      `(${birthdayName}) — ` +
      `${formatNumber(daysUntil)} ` +
      `day${daysUntil === 1 ? "" : "s"} to go.`
    );
  }

  function calculateAge() {
    const birthDate =
      parseDate(birthDateInput.value);

    const endDate =
      parseDate(calculateDateInput.value);

    if (!birthDate) {
      alert("Please select your date of birth.");
      birthDateInput.focus();
      return;
    }

    if (!endDate) {
      alert("Please select a calculation date.");
      calculateDateInput.focus();
      return;
    }

    if (birthDate > endDate) {
      alert(
        "Date of birth cannot be later than the calculation date."
      );
      birthDateInput.focus();
      return;
    }

    const age = calculateCalendarAge(
      birthDate,
      endDate
    );

    const days = calculateTotalDays(
      birthDate,
      endDate
    );

    const weeks = Math.floor(days / 7);
    const hours = days * 24;

    yearsResult.textContent =
      formatNumber(age.years);

    monthsResult.textContent =
      formatNumber(age.months);

    daysResult.textContent =
      formatNumber(age.days);

    totalDays.textContent =
      formatNumber(days);

    totalWeeks.textContent =
      formatNumber(weeks);

    totalHours.textContent =
      formatNumber(hours);

    resultSummary.textContent =
      `You are ${age.years} year${
        age.years === 1 ? "" : "s"
      }, ${age.months} month${
        age.months === 1 ? "" : "s"
      } and ${age.days} day${
        age.days === 1 ? "" : "s"
      } old on ${formatDate(endDate)}.`;

    birthdayInfo.textContent =
      calculateBirthdayInfo(
        birthDate,
        endDate
      );

    resultSection.hidden = false;

    resultSection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  function resetCalculator() {
    birthDateInput.value = "";
    calculateDateInput.value =
      dateToInputValue(new Date());

    yearsResult.textContent = "0";
    monthsResult.textContent = "0";
    daysResult.textContent = "0";

    totalDays.textContent = "0";
    totalWeeks.textContent = "0";
    totalHours.textContent = "0";

    resultSummary.textContent =
      "Your age will appear here.";

    birthdayInfo.textContent =
      "🎂 Birthday information will appear here.";

    resultSection.hidden = true;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function updateDateLimits() {
    const today = new Date();
    const todayValue =
      dateToInputValue(today);

    birthDateInput.max = todayValue;

    if (!calculateDateInput.value) {
      calculateDateInput.value =
        todayValue;
    }

    /*
     * Allow historical/future calculation dates,
     * but keep the normal default on today's date.
     */
  }

  calculateBtn.addEventListener(
    "click",
    calculateAge
  );

  todayBtn.addEventListener(
    "click",
    setToday
  );

  resetBtn.addEventListener(
    "click",
    resetCalculator
  );

  birthDateInput.addEventListener(
    "change",
    () => {
      if (
        birthDateInput.value &&
        calculateDateInput.value
      ) {
        calculateAge();
      }
    }
  );

  calculateDateInput.addEventListener(
    "change",
    () => {
      if (
        birthDateInput.value &&
        calculateDateInput.value
      ) {
        calculateAge();
      }
    }
  );

  updateDateLimits();

  console.log(
    "niDar Tools — Age Calculator initialized."
  );
})();
