let growthChart = null;

document.addEventListener("DOMContentLoaded", () => {
    calculateAndDraw();
    document.getElementById("calculateBtn").addEventListener("click", calculateAndDraw);
});

function calculateAndDraw() {
    const currency = document.getElementById("currency").value;
    const P = parseFloat(document.getElementById("initialAmount").value) || 0;
    const PMT = parseFloat(document.getElementById("monthlyContribution").value) || 0;
    const r = parseFloat(document.getElementById("interestRate").value) || 0;
    const t = parseInt(document.getElementById("years").value) || 0;

    const rate = r / 100;
    const n = 12; // Monthly compounding

    let yearsData = [];
    let principalData = [];
    let balanceData = [];

    let currentBalance = P;
    let currentPrincipal = P;

    for (let year = 0; year <= t; year++) {
        yearsData.push(`Year ${year}`);
        principalData.push(currentPrincipal);
        balanceData.push(currentBalance);

        if (year < t) {
            for (let month = 1; month <= 12; month++) {
                currentBalance = currentBalance * (1 + rate / n) + PMT;
                currentPrincipal += PMT;
            }
        }
    }

    const totalBalance = balanceData[balanceData.length - 1];
    const totalPrincipal = principalData[principalData.length - 1];
    const totalInterest = totalBalance - totalPrincipal;

    // Update UI
    document.getElementById("totalBalance").innerText = formatCurrency(currency, totalBalance);
    document.getElementById("totalPrincipal").innerText = formatCurrency(currency, totalPrincipal);
    document.getElementById("totalInterest").innerText = formatCurrency(currency, totalInterest);

    // Update Chart
    drawChart(yearsData, principalData, balanceData);
}

function formatCurrency(symbol, amount) {
    return symbol + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function drawChart(labels, principal, balance) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    if (growthChart) {
        growthChart.destroy();
    }

    growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Balance',
                    data: balance,
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Total Principal Invested',
                    data: principal,
                    borderColor: '#94a3b8',
                    backgroundColor: 'transparent',
                    fill: false,
                    borderDash: [5, 5],
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y).replace('$', document.getElementById("currency").value);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
