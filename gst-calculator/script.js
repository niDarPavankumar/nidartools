// GST Calculator — engine (Add/Remove GST)
document.addEventListener('DOMContentLoaded', function () {

    let currentMode = 'add';

    const addTab = document.getElementById('addTab');
    const removeTab = document.getElementById('removeTab');
    const amountLabel = document.getElementById('amountLabel');
    const gstAmount = document.getElementById('gstAmount');
    const gstRate = document.getElementById('gstRate');
    const calculateBtn = document.getElementById('calculateBtn');

    const resultsBox = document.getElementById('resultsBox');
    const errorBox = document.getElementById('errorBox');

    const resOriginal = document.getElementById('resOriginal');
    const resGst = document.getElementById('resGst');
    const resGstLabel = document.getElementById('resGstLabel');
    const resTotal = document.getElementById('resTotal');
    const resTotalLabel = document.getElementById('resTotalLabel');

    function formatCurrency(num) {
        return '₹' + num.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function setMode(mode) {
        currentMode = mode;

        if (mode === 'add') {
            addTab.classList.add('active');
            removeTab.classList.remove('active');
            amountLabel.textContent = 'Amount (Before GST)';
        } else {
            removeTab.classList.add('active');
            addTab.classList.remove('active');
            amountLabel.textContent = 'Amount (Including GST)';
        }

        resultsBox.classList.add('hidden');
        errorBox.classList.add('hidden');
    }

    addTab.addEventListener('click', function () {
        setMode('add');
    });

    removeTab.addEventListener('click', function () {
        setMode('remove');
    });

    function calculate() {
        const amount = parseFloat(gstAmount.value);
        const rate = parseFloat(gstRate.value);

        errorBox.classList.add('hidden');
        resultsBox.classList.add('hidden');

        if (isNaN(amount) || amount <= 0) {
            errorBox.classList.remove('hidden');
            return;
        }

        let original, gstValue, total;

        if (currentMode === 'add') {
            original = amount;
            gstValue = (amount * rate) / 100;
            total = original + gstValue;

            resGstLabel.textContent = 'GST Amount (' + rate + '%)';
            resTotalLabel.textContent = 'Total Amount';
        } else {
            total = amount;
            original = amount / (1 + rate / 100);
            gstValue = total - original;

            resGstLabel.textContent = 'GST Amount (' + rate + '%)';
            resTotalLabel.textContent = 'Base Amount (Before GST)';

            // Swap display so the meaningful result (base price) is highlighted
            resOriginal.textContent = formatCurrency(total);
            resGst.textContent = formatCurrency(gstValue);
            resTotal.textContent = formatCurrency(original);
            resultsBox.classList.remove('hidden');
            return;
        }

        resOriginal.textContent = formatCurrency(original);
        resGst.textContent = formatCurrency(gstValue);
        resTotal.textContent = formatCurrency(total);
        resultsBox.classList.remove('hidden');
    }

    calculateBtn.addEventListener('click', calculate);

    gstAmount.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            calculate();
        }
    });

});
