const inputs = {
    ev: document.getElementById('evDisplay'),
    aperture: document.getElementById('aperture'),
    iso: document.getElementById('isoDisplay'),
    time: document.getElementById('timeDisplay')
};

const timeShutterSelect = document.getElementById('timeShutter');
const evSituationSelect = document.getElementById('evSituation');
const isoFilmSelect = document.getElementById('isoFilm');
const errorDiv = document.getElementById('error');

// Common analog camera shutter speeds in seconds
const shutterSpeeds = [
    { value: 1, label: '1s' },
    { value: 0.5, label: '1/2s' },
    { value: 0.25, label: '1/4s' },
    { value: 0.125, label: '1/8s' },
    { value: 0.0666667, label: '1/15s' },
    { value: 0.0333333, label: '1/30s' },
    { value: 0.02, label: '1/50s (flash sync)' },
    { value: 0.0166667, label: '1/60s' },
    { value: 0.008, label: '1/125s' },
    { value: 0.004, label: '1/250s' },
    { value: 0.002, label: '1/500s' },
    { value: 0.001, label: '1/1000s' }
];

function findClosestShutterSpeed(timeInSeconds) {
    let closest = shutterSpeeds[0];
    let minDiff = Math.abs(Math.log(timeInSeconds) - Math.log(closest.value));

    for (let i = 1; i < shutterSpeeds.length; i++) {
        const diff = Math.abs(Math.log(timeInSeconds) - Math.log(shutterSpeeds[i].value));
        if (diff < minDiff) {
            minDiff = diff;
            closest = shutterSpeeds[i];
        }
    }

    return closest;
}

function findClosestLightSituation(evValue) {
    const options = evSituationSelect.options;
    let closestValue = null;
    let minDiff = Infinity;

    for (let i = 1; i < options.length; i++) {
        const optVal = parseFloat(options[i].value);
        const diff = Math.abs(optVal - evValue);
        if (diff < minDiff) {
            minDiff = diff;
            closestValue = options[i].value;
        }
    }

    return closestValue;
}

function findClosestFilmSpeed(isoValue) {
    const options = isoFilmSelect.options;
    let closestValue = null;
    let minDiff = Infinity;

    for (let i = 1; i < options.length; i++) {
        const optVal = parseFloat(options[i].value);
        const diff = Math.abs(optVal - isoValue);
        if (diff < minDiff) {
            minDiff = diff;
            closestValue = options[i].value;
        }
    }

    return closestValue;
}

function clearField(fieldName) {
    if (fieldName === 'ev' || fieldName === 'time' || fieldName === 'iso') {
        inputs[fieldName].textContent = '—';
        inputs[fieldName].classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
        inputs[fieldName].classList.add('bg-gray-100', 'border-gray-300', 'text-gray-600');
    } else {
        inputs[fieldName].value = '';
        inputs[fieldName].classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
    }
    hideError();
}

function clearTimeFields() {
    inputs.time.textContent = '—';
    inputs.time.classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
    inputs.time.classList.add('bg-gray-100', 'border-gray-300', 'text-gray-600');
    timeShutterSelect.value = '';
    hideError();
}

function clearEVFields() {
    inputs.ev.textContent = '—';
    inputs.ev.classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
    inputs.ev.classList.add('bg-gray-100', 'border-gray-300', 'text-gray-600');
    evSituationSelect.value = '';
    hideError();
}

function clearISOFields() {
    inputs.iso.textContent = '—';
    inputs.iso.classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
    inputs.iso.classList.add('bg-gray-100', 'border-gray-300', 'text-gray-600');
    isoFilmSelect.value = '';
    hideError();
}

// When shutter speed is selected, update the time field
timeShutterSelect.addEventListener('change', function() {
    if (this.value !== '') {
        inputs.time.textContent = this.value;
    }
});

// When EV situation is selected, update the EV field
evSituationSelect.addEventListener('change', function() {
    if (this.value !== '') {
        inputs.ev.textContent = this.value;
    }
});

// When ISO film is selected, update the ISO field
isoFilmSelect.addEventListener('change', function() {
    if (this.value !== '') {
        inputs.iso.textContent = this.value;
    }
});

function calculate() {
    hideError();

    // Remove calculated class from all inputs
    inputs.ev.classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
    inputs.ev.classList.add('bg-gray-100', 'border-gray-300', 'text-gray-600');
    inputs.time.classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
    inputs.time.classList.add('bg-gray-100', 'border-gray-300', 'text-gray-600');
    inputs.iso.classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
    inputs.iso.classList.add('bg-gray-100', 'border-gray-300', 'text-gray-600');
    inputs.aperture.classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
    timeShutterSelect.classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
    evSituationSelect.classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
    isoFilmSelect.classList.remove('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');

    // Find which fields have values
    const values = {};
    const emptyFields = [];

    Object.keys(inputs).forEach(key => {
        let val;
        if (key === 'aperture') {
            val = inputs[key].value === '' ? NaN : parseFloat(inputs[key].value);
        } else if (key === 'time') {
            if (timeShutterSelect.value !== '') {
                val = parseFloat(timeShutterSelect.value);
            } else if (inputs.time.textContent !== '—' && inputs.time.textContent !== '') {
                val = parseFloat(inputs.time.textContent);
            } else {
                val = NaN;
            }
        } else if (key === 'ev') {
            if (evSituationSelect.value !== '') {
                val = parseFloat(evSituationSelect.value);
            } else if (inputs.ev.textContent !== '—' && inputs.ev.textContent !== '') {
                val = parseFloat(inputs.ev.textContent);
            } else {
                val = NaN;
            }
        } else if (key === 'iso') {
            if (isoFilmSelect.value !== '') {
                val = parseFloat(isoFilmSelect.value);
            } else if (inputs.iso.textContent !== '—' && inputs.iso.textContent !== '') {
                val = parseFloat(inputs.iso.textContent);
            } else {
                val = NaN;
            }
        } else {
            val = parseFloat(inputs[key].value);
        }

        if (isNaN(val) || (key === 'aperture' && inputs[key].value === '') ||
            (key === 'iso' && isoFilmSelect.value === '' && (inputs.iso.textContent === '—' || inputs.iso.textContent === '')) ||
            (key === 'time' && timeShutterSelect.value === '' && (inputs.time.textContent === '—' || inputs.time.textContent === '')) ||
            (key === 'ev' && evSituationSelect.value === '' && (inputs.ev.textContent === '—' || inputs.ev.textContent === ''))) {
            emptyFields.push(key);
        } else {
            values[key] = val;
        }
    });

    if (emptyFields.length === 0) {
        showError('Please clear one field to calculate it');
        return;
    }

    if (emptyFields.length > 1) {
        showError('Please fill in exactly three values');
        return;
    }

    const calculateWhat = emptyFields[0];

    try {
        let result;

        if (calculateWhat === 'ev') {
            // Formula: EV = log₂(100 × A² / (ISO × T))
            result = Math.log2((100 * Math.pow(values.aperture, 2)) / (values.iso * values.time));

            const closestSituation = findClosestLightSituation(result);
            if (closestSituation !== null) {
                evSituationSelect.value = closestSituation;
                evSituationSelect.classList.remove('bg-gray-100', 'border-gray-300', 'text-gray-600');
                evSituationSelect.classList.add('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
            }
        }
        else if (calculateWhat === 'aperture') {
            // Formula: A = √(ISO × T × 2^EV / 100)
            result = Math.sqrt((values.iso * values.time * Math.pow(2, values.ev)) / 100);
        }
        else if (calculateWhat === 'iso') {
            // Formula: ISO = 100 × A² / (T × 2^EV)
            result = (100 * Math.pow(values.aperture, 2)) / (values.time * Math.pow(2, values.ev));

            // Find and set the closest film speed
            const closestFilm = findClosestFilmSpeed(result);
            if (closestFilm !== null) {
                isoFilmSelect.value = closestFilm;
                isoFilmSelect.classList.remove('bg-gray-100', 'border-gray-300', 'text-gray-600');
                isoFilmSelect.classList.add('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
            }
        }
        else if (calculateWhat === 'time') {
            // Formula: T = 100 × A² / (ISO × 2^EV)
            result = (100 * Math.pow(values.aperture, 2)) / (values.iso * Math.pow(2, values.ev));

            // Find and set the closest shutter speed
            const closestSpeed = findClosestShutterSpeed(result);
            timeShutterSelect.value = closestSpeed.value;
            timeShutterSelect.classList.remove('bg-gray-100', 'border-gray-300', 'text-gray-600');
            timeShutterSelect.classList.add('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
        }

        if (!isFinite(result) || isNaN(result) || result <= 0) {
            showError('Invalid calculation result. Please check your input values.');
            return;
        }

        let formattedResult;
        if (calculateWhat === 'iso') {
            formattedResult = Math.round(result);
        } else if (calculateWhat === 'time') {
            formattedResult = result.toFixed(6);

            const closestSpeed = findClosestShutterSpeed(result);
            timeShutterSelect.value = closestSpeed.value;
            timeShutterSelect.classList.remove('bg-gray-100', 'border-gray-300', 'text-gray-600');
            timeShutterSelect.classList.add('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');

        } else if (calculateWhat === 'aperture') {
            formattedResult = result.toFixed(2);
            const options = inputs.aperture.options;
            let closestValue = null;
            let closestDiff = Infinity;

            for (let i = 0; i < options.length; i++) {
                if (options[i].value !== '') {
                    const optVal = parseFloat(options[i].value);
                    const diff = Math.abs(optVal - result);
                    if (diff < closestDiff) {
                        closestDiff = diff;
                        closestValue = options[i].value;
                    }
                }
            }

            if (closestDiff < 0.05) {
                inputs.aperture.value = closestValue;
            } else {
                showError(`Calculated aperture f/${formattedResult} is not in the standard list. Closest: f/${closestValue}`);
                return;
            }
        } else {
            formattedResult = result.toFixed(2);
        }

        if (calculateWhat !== 'aperture') {
            if (calculateWhat === 'ev' || calculateWhat === 'time' || calculateWhat === 'iso') {
                inputs[calculateWhat].textContent = formattedResult;
                inputs[calculateWhat].classList.remove('bg-gray-100', 'border-gray-300', 'text-gray-600');
                inputs[calculateWhat].classList.add('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
            } else {
                inputs[calculateWhat].value = formattedResult;
                inputs[calculateWhat].classList.add('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
            }
        } else {
            inputs.aperture.classList.add('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
        }

    } catch (err) {
        showError('Calculation error: ' + err.message);
    }
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}

// Toggle documentation section
function toggleDocumentation() {
    const docContent = document.getElementById('documentationContent');
    const docIcon = document.getElementById('docIcon');
    const docToggle = document.getElementById('docToggle');

    if (docContent.classList.contains('hidden')) {
        docContent.classList.remove('hidden');
        docIcon.textContent = '▲';
        docIcon.style.transform = 'rotate(180deg)';
        docToggle.setAttribute('aria-expanded', 'true');
    } else {
        docContent.classList.add('hidden');
        docIcon.textContent = '▼';
        docIcon.style.transform = 'rotate(0deg)';
        docToggle.setAttribute('aria-expanded', 'false');
    }
}
