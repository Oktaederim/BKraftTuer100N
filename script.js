const allInputs = {
    width: {
        slider: document.getElementById('doorWidth'),
        number: document.getElementById('doorWidthValue')
    },
    height: {
        slider: document.getElementById('doorHeight'),
        number: document.getElementById('doorHeightValue')
    },
    pressure: {
        slider: document.getElementById('diffPressure'),
        number: document.getElementById('diffPressureValue')
    },
    correction: {
        slider: document.getElementById('correctionFactor'),
        number: document.getElementById('correctionFactorValue')
    }
};

const resultDisplay = document.getElementById('result');
const doorAreaDisplay = document.getElementById('doorArea');
const pressureDisplay = document.getElementById('pressureDisplay');
const resetButton = document.getElementById('resetButton');

const defaultValues = {
    width: 100,
    height: 200,
    pressure: 50,
    correction: 15
};

function calculate() {
    const widthM = parseFloat(allInputs.width.number.value) / 100;
    const heightM = parseFloat(allInputs.height.number.value) / 100;
    const pressurePa = parseFloat(allInputs.pressure.number.value);
    const correction = parseFloat(allInputs.correction.number.value) / 100;

    if (isNaN(widthM) || isNaN(heightM)) return;

    const areaM2 = widthM * heightM;
    const forceFromPressure = areaM2 * pressurePa;
    const totalForce = forceFromPressure * (1 + correction);
    const pressureMmWs = pressurePa / 9.80665;

    resultDisplay.textContent = `${totalForce.toFixed(1)} N`;
    doorAreaDisplay.textContent = `${areaM2.toFixed(2)} m²`;
    pressureDisplay.textContent = `${pressurePa.toFixed(0)} Pa / ${pressureMmWs.toFixed(1)} mmWS`;
    
    resultDisplay.classList.remove('ok', 'warn', 'danger');
    if (totalForce > 100) {
        resultDisplay.classList.add('danger');
    } else if (totalForce > 80) {
        resultDisplay.classList.add('warn');
    } else {
        resultDisplay.classList.add('ok');
    }
}

function setupEventListeners(type) {
    const slider = allInputs[type].slider;
    const number = allInputs[type].number;
    const min = parseFloat(number.min);
    const max = parseFloat(number.max);

    slider.addEventListener('input', () => {
        number.value = slider.value;
        number.classList.remove('input-invalid');
        calculate();
    });

    number.addEventListener('input', () => {
        const value = parseFloat(number.value);
        if (!isNaN(value) && value >= min && value <= max) {
            slider.value = value;
            number.classList.remove('input-invalid');
            calculate();
        } else {
            number.classList.add('input-invalid');
        }
    });

    number.addEventListener('change', () => {
        let value = parseFloat(number.value);
        if (isNaN(value) || value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        number.value = value;
        slider.value = value;
        number.classList.remove('input-invalid');
        calculate();
    });
}

Object.keys(allInputs).forEach(setupEventListeners);

function resetToDefaults() {
    allInputs.width.slider.value = defaultValues.width;
    allInputs.width.number.value = defaultValues.width;
    allInputs.height.slider.value = defaultValues.height;
    allInputs.height.number.value = defaultValues.height;
    allInputs.pressure.slider.value = defaultValues.pressure;
    allInputs.pressure.number.value = defaultValues.pressure;
    allInputs.correction.slider.value = defaultValues.correction;
    allInputs.correction.number.value = defaultValues.correction;
    
    Object.values(allInputs).forEach(pair => pair.number.classList.remove('input-invalid'));
    calculate();
}

resetButton.addEventListener('click', resetToDefaults);
document.addEventListener('DOMContentLoaded', calculate);
