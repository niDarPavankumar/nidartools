let mortgageChart = null;

document.addEventListener("DOMContentLoaded", () => {
    calculateMortgage();
    document.getElementById("calculateBtn").addEventListener("click", calculateMortgage);
    
    // Auto calculate on input change for smooth user experience
    const inputs = document.querySelectorAll('.input-section input, .input-section select');
    inputs.forEach(input => input.addEventListener('input', calculateMortgage));
});

function calculateMortgage() {
    const currency = document.getElementById("currency").value;
    const homePrice = parseFloat(document.getElementById("homePrice").value) || 0;
    const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
    const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;
    const loanTerm = parseInt(document.getElementById("loanTerm").value) || 0;
    const propertyTaxYearly = parseFloat(document.getElementById("propertyTax").value) || 0;
    const homeInsuranceYearly = parseFloat(document.getElementById("homeInsurance").value) || 0;

    const principal = homePrice - downPayment;
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate Principal & Interest (M = P [ i(1 + i)^n ] / [ (1 + i)^n - 1])
    let monthlyPI = 0;
    if (monthlyInterestRate > 0 && numberOfPayments > 0) {
        monthlyPI = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else if (numberOfPayments > 0) {
        monthlyPI = principal / numberOfPayments;
    }

    const monthlyTax = propertyTaxYearly / 12;
    const monthlyInsurance = homeInsuranceYearly / 12;
    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance;

    // Update UI
    document.getElementById("monthlyPayment").innerText = formatCurrency(currency, totalMonthlyPayment);
    document.getElementById("valPI").innerText = formatCurrency(currency, monthlyPI);
    document.getElementById("valTax").innerText = formatCurrency(currency, monthlyTax);
    document.getElementById("valIns").innerText = formatCurrency(currency, monthlyInsurance);

    // Update Chart
    drawChart(monthlyPI, monthlyTax, monthlyInsurance);
}

function formatCurrency(symbol, amount) {
    return symbol + Math.round(amount).toLocaleString('en-US');
}

function drawChart(pi, tax, ins) {
    const ctx = document.getElementById('mortgageChart').getContext('2d');
    
    if (mortgageChart) {
        mortgageChart.destroy();
    }

    mortgageChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal & Interest', 'Property Tax', 'Home Insurance'],
            datasets: [{
                data: [pi, tax, ins],
                backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
                hoverBackgroundColor: ['#2563eb', '#d97706', '#059669'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // We are using custom HTML legend
                }
            },
            cutout: '70%'
        }
    });
}
