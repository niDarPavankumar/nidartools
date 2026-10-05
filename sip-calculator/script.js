let sipChart = null;

document.addEventListener("DOMContentLoaded", () => {
    calculateSIP();
    document.getElementById("calculateBtn").addEventListener("click", calculateSIP);
});

function calculateSIP() {
    const currency = document.getElementById("currency").value;
    const P = parseFloat(document.getElementById("monthlyInvestment").value) || 0;
    const r = parseFloat(document.getElementById("expectedReturn").value) || 0;
    const t = parseInt(document.getElementById("timePeriod").value) || 0;

    const n = t * 12; // Total number of months
    const i = r / 12 / 100; // Monthly interest rate

    // SIP Formula: FV = P × {[(1 + i)^n - 1] / i} × (1 + i)
    let totalValue = 0;
    if (i === 0) {
        totalValue = P * n;
    } else {
        totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    }

    const investedAmount = P * n;
    const estReturns = totalValue - investedAmount;

    // Update UI
    document.getElementById("totalValue").innerText = formatCurrency(currency, totalValue);
    document.getElementById("investedAmount").innerText = formatCurrency(currency, investedAmount);
    document.getElementById("estReturns").innerText = formatCurrency(currency, estReturns);

    // Draw Pie Chart
    drawDoughnutChart(investedAmount, estReturns);
}

function formatCurrency(symbol, amount) {
    return symbol + Math.round(amount).toLocaleString('en-IN');
}

function drawDoughnutChart(invested, returns) {
    const ctx = document.getElementById('sipChart').getContext('2d');
    
    if (sipChart) {
        sipChart.destroy();
    }

    sipChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Invested Amount', 'Estimated Returns'],
            datasets: [{
                data: [invested, returns],
                backgroundColor: ['#94a3b8', '#0ea5e9'],
                hoverBackgroundColor: ['#64748b', '#0284c7'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            },
            cutout: '65%' // Makes it a doughnut
        }
    });
}
