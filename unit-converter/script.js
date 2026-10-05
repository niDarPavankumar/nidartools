const units = {
    length: {
        Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.34, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254
    },
    weight: {
        Kilogram: 1, Gram: 0.001, Milligram: 0.000001, MetricTon: 1000, Pound: 0.453592, Ounce: 0.0283495
    },
    temperature: {
        Celsius: 'C', Fahrenheit: 'F', Kelvin: 'K'
    }
};

const categorySelect = document.getElementById('categorySelect');
const inputUnit = document.getElementById('inputUnit');
const outputUnit = document.getElementById('outputUnit');
const inputValue = document.getElementById('inputValue');
const outputValue = document.getElementById('outputValue');
const swapBtn = document.getElementById('swapBtn');

function populateUnits() {
    const category = categorySelect.value;
    const options = Object.keys(units[category]);
    
    inputUnit.innerHTML = '';
    outputUnit.innerHTML = '';
    
    options.forEach(unit => {
        inputUnit.add(new Option(unit, unit));
        outputUnit.add(new Option(unit, unit));
    });
    
    if (options.length > 1) outputUnit.selectedIndex = 1;
    calculate();
}

function calculate() {
    const category = categorySelect.value;
    const val = parseFloat(inputValue.value);
    const from = inputUnit.value;
    const to = outputUnit.value;

    if (isNaN(val)) {
        outputValue.value = '';
        return;
    }

    let result = 0;

    if (category === 'temperature') {
        let tempInC;
        if (from === 'Celsius') tempInC = val;
        else if (from === 'Fahrenheit') tempInC = (val - 32) * 5/9;
        else if (from === 'Kelvin') tempInC = val - 273.15;

        if (to === 'Celsius') result = tempInC;
        else if (to === 'Fahrenheit') result = (tempInC * 9/5) + 32;
        else if (to === 'Kelvin') result = tempInC + 273.15;
    } else {
        const baseVal = val * units[category][from];
        result = baseVal / units[category][to];
    }

    outputValue.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
}

function swapUnits() {
    const temp = inputUnit.value;
    inputUnit.value = outputUnit.value;
    outputUnit.value = temp;
    calculate();
}

categorySelect.addEventListener('change', populateUnits);
inputUnit.addEventListener('change', calculate);
outputUnit.addEventListener('change', calculate);
inputValue.addEventListener('input', calculate);
swapBtn.addEventListener('click', swapUnits);

populateUnits();
