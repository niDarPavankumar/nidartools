/* =========================================================
   niDar Tools — Construction Cost Estimator
   Independent JavaScript
   ========================================================= */

"use strict";


/* =========================================================
   STATE
   ========================================================= */

let lastCementBags = 0;
let lastSandCft = 0;
let lastBrickCount = 0;


/* =========================================================
   HELPERS
   ========================================================= */

function getNumber(id) {
    const element = document.getElementById(id);

    if (!element) {
        return NaN;
    }

    return parseFloat(element.value);
}


function formatINR(value) {
    return Math.round(value).toLocaleString("en-IN");
}


function showElement(id) {
    const element = document.getElementById(id);

    if (element) {
        element.classList.remove("hidden");
    }
}


function hideElement(id) {
    const element = document.getElementById(id);

    if (element) {
        element.classList.add("hidden");
    }
}


/* =========================================================
   BRICK / MORTAR CALCULATION
   ========================================================= */

function calcBricks() {

    const wallLen = getNumber("wallLen");
    const wallHt = getNumber("wallHt");
    const wallThkIn = getNumber("wallThk");

    const brickL = getNumber("brickL");
    const brickW = getNumber("brickW");
    const brickH = getNumber("brickH");

    const joint = getNumber("joint");

    const ratioElement = document.getElementById("ratio");

    const ratio = ratioElement
        ? ratioElement.value.split(":").map(Number)
        : [1, 6];


    const errorEl = document.getElementById("brickError");


    /* Reset previous state */

    hideElement("brickResult");

    if (errorEl) {
        errorEl.textContent = "";
        errorEl.classList.add("hidden");
    }


    /* Validate */

    const values = [
        wallLen,
        wallHt,
        wallThkIn,
        brickL,
        brickW,
        brickH,
        joint
    ];


    if (
        values.some(
            value => Number.isNaN(value) || value <= 0
        )
    ) {

        if (errorEl) {

            errorEl.textContent =
                "Please fill in all wall and brick fields with valid positive numbers.";

            errorEl.classList.remove("hidden");
        }

        return;
    }


    if (
        !Array.isArray(ratio) ||
        ratio.length !== 2 ||
        ratio.some(
            value => Number.isNaN(value) || value <= 0
        )
    ) {

        if (errorEl) {

            errorEl.textContent =
                "Please select a valid cement and sand ratio.";

            errorEl.classList.remove("hidden");
        }

        return;
    }


    /* =====================================================
       Convert dimensions from inches to feet
       ===================================================== */

    const wallThk = wallThkIn / 12;

    const bL = brickL / 12;
    const bW = brickW / 12;
    const bH = brickH / 12;

    const j = joint / 12;


    /* =====================================================
       Wall volume
       ===================================================== */

    const wallVolume =
        wallLen *
        wallHt *
        wallThk;


    /* =====================================================
       Effective brick volume
       Includes mortar joint
       ===================================================== */

    const effectiveBrickVolume =
        (bL + j) *
        (bW + j) *
        (bH + j);


    /* =====================================================
       Actual brick volume
       ===================================================== */

    const actualBrickVolume =
        bL *
        bW *
        bH;


    /* =====================================================
       Estimated brick count
       ===================================================== */

    const brickCount =
        Math.ceil(
            wallVolume /
            effectiveBrickVolume
        );


    /* =====================================================
       Mortar calculation
       ===================================================== */

    const mortarWetVolume =
        wallVolume -
        (
            brickCount *
            actualBrickVolume
        );


    const mortarDryVolume =
        Math.max(
            0,
            mortarWetVolume * 1.33
        );


    /* =====================================================
       Cement / Sand ratio
       ===================================================== */

    const sumRatio =
        ratio[0] +
        ratio[1];


    const cementVolume =
        mortarDryVolume *
        (
            ratio[0] /
            sumRatio
        );


    const sandVolume =
        mortarDryVolume *
        (
            ratio[1] /
            sumRatio
        );


    /* =====================================================
       Cement bags
       ===================================================== */

    const cementBags =
        cementVolume /
        1.226;


    /* =====================================================
       Save calculated values
       ===================================================== */

    lastCementBags = cementBags;
    lastSandCft = sandVolume;
    lastBrickCount = brickCount;


    /* =====================================================
       Display results
       ===================================================== */

    const wallVolOut =
        document.getElementById("wallVolOut");

    const brickCountOut =
        document.getElementById("brickCountOut");

    const cementBagsOut =
        document.getElementById("cementBagsOut");

    const sandCftOut =
        document.getElementById("sandCftOut");


    if (wallVolOut) {
        wallVolOut.textContent =
            wallVolume.toFixed(2) +
            " cft";
    }


    if (brickCountOut) {
        brickCountOut.textContent =
            brickCount.toLocaleString("en-IN");
    }


    if (cementBagsOut) {
        cementBagsOut.textContent =
            cementBags.toFixed(1) +
            " bags";
    }


    if (sandCftOut) {
        sandCftOut.textContent =
            sandVolume.toFixed(1) +
            " cft";
    }


    showElement("brickResult");
}


/* =========================================================
   TOTAL COST CALCULATION
   ========================================================= */

function calcTotal() {

    /* =====================================================
       Material rates
       ===================================================== */

    const rateBrick =
        getNumber("rateBrick") || 0;

    const rateCement =
        getNumber("rateCement") || 0;

    const rateSand =
        getNumber("rateSand") || 0;


    /* =====================================================
       Optional materials
       ===================================================== */

    const steelQty =
        getNumber("steelQty") || 0;

    const steelRate =
        getNumber("steelRate") || 0;

    const gittiQty =
        getNumber("gittiQty") || 0;

    const gittiRate =
        getNumber("gittiRate") || 0;


    /* =====================================================
       Additional costs
       ===================================================== */

    const laborCost =
        getNumber("laborCost") || 0;

    const centeringCost =
        getNumber("centeringCost") || 0;

    const electricalCost =
        getNumber("electricalCost") || 0;

    const transportCost =
        getNumber("transportCost") || 0;

    const architectCost =
        getNumber("architectCost") || 0;


    /* =====================================================
       Individual cost calculations
       ===================================================== */

    const brickCost =
        lastBrickCount *
        rateBrick;


    const cementCost =
        lastCementBags *
        rateCement;


    const sandCost =
        lastSandCft *
        rateSand;


    const steelCost =
        steelQty *
        steelRate;


    const gittiCost =
        gittiQty *
        gittiRate;


    /* =====================================================
       Cost rows
       ===================================================== */

    const rows = [

        [
            "Bricks (" +
            lastBrickCount.toLocaleString("en-IN") +
            " × ₹" +
            rateBrick +
            ")",
            brickCost
        ],

        [
            "Cement (" +
            lastCementBags.toFixed(1) +
            " bags × ₹" +
            rateCement +
            ")",
            cementCost
        ],

        [
            "Sand (" +
            lastSandCft.toFixed(1) +
            " cft × ₹" +
            rateSand +
            ")",
            sandCost
        ],

        [
            "Steel (" +
            steelQty +
            " kg × ₹" +
            steelRate +
            ")",
            steelCost
        ],

        [
            "Aggregate/Gitti (" +
            gittiQty +
            " cft × ₹" +
            gittiRate +
            ")",
            gittiCost
        ],

        [
            "Labor",
            laborCost
        ],

        [
            "Centering",
            centeringCost
        ],

        [
            "Electrical",
            electricalCost
        ],

        [
            "Transport",
            transportCost
        ],

        [
            "Architect / Builder Fee",
            architectCost
        ]

    ];


    /* =====================================================
       Grand total
       ===================================================== */

    const grandTotal =
        rows.reduce(
            (sum, row) =>
                sum + row[1],
            0
        );


    /* =====================================================
       Build cost table
       ===================================================== */

    const costTable =
        document.getElementById("costTable");


    if (costTable) {

        costTable.innerHTML =
            rows
                .map(
                    row =>
                        `<tr>
                            <td>${row[0]}</td>
                            <td>₹${formatINR(row[1])}</td>
                        </tr>`
                )
                .join("");
    }


    /* =====================================================
       Display grand total
       ===================================================== */

    const grandTotalOut =
        document.getElementById("grandTotalOut");


    if (grandTotalOut) {

        grandTotalOut.textContent =
            "₹" +
            formatINR(grandTotal);
    }


    /* =====================================================
       Show total card
       ===================================================== */

    showElement("totalCard");


    /* =====================================================
       Scroll to result
       ===================================================== */

    const totalCard =
        document.getElementById("totalCard");


    if (totalCard) {

        totalCard.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
}


/* =========================================================
   ENTER KEY SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !== "Enter" ||
            event.target.tagName === "TEXTAREA"
        ) {
            return;
        }


        const activeElement =
            document.activeElement;


        if (
            activeElement &&
            activeElement.matches(
                "input[type='number']"
            )
        ) {

            event.preventDefault();

            const section =
                activeElement.closest(
                    ".tool-card"
                );


            if (!section) {
                return;
            }


            const quantityButton =
                section.querySelector(
                    "#calculateQuantityBtn"
                );


            if (quantityButton) {
                quantityButton.click();
            }
        }
    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Make sure result sections start hidden */

        hideElement("brickResult");
        hideElement("totalCard");

        /* Reset calculated state */

        lastCementBags = 0;
        lastSandCft = 0;
        lastBrickCount = 0;
    }
);
