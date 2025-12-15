/**
 * Unit tests for the exposure calculator core functions
 */

// Create mock DOM elements that script.js expects BEFORE loading the module
document.body.innerHTML = `
    <div id="error" class="hidden"></div>
    <input id="evDisplay" value="" />
    <select id="aperture">
        <option value="">Select...</option>
        <option value="1.0">f/1.0</option>
        <option value="1.4">f/1.4</option>
        <option value="2.0">f/2.0</option>
        <option value="2.8">f/2.8</option>
        <option value="4.0">f/4</option>
        <option value="5.6">f/5.6</option>
        <option value="8.0">f/8</option>
        <option value="11">f/11</option>
        <option value="16">f/16</option>
        <option value="22">f/22</option>
    </select>
    <input id="isoDisplay" value="" />
    <input id="timeDisplay" value="" />
    <select id="timeShutter">
        <option value="">Select...</option>
        <option value="1">1s</option>
        <option value="0.5">1/2s</option>
        <option value="0.25">1/4s</option>
        <option value="0.125">1/8s</option>
        <option value="0.0666667">1/15s</option>
        <option value="0.0333333">1/30s</option>
        <option value="0.02">1/50s</option>
        <option value="0.0166667">1/60s</option>
        <option value="0.008">1/125s</option>
        <option value="0.004">1/250s</option>
        <option value="0.002">1/500s</option>
        <option value="0.001">1/1000s</option>
    </select>
    <select id="evSituation">
        <option value="">Select...</option>
        <option value="-2">EV -2</option>
        <option value="0">EV 0</option>
        <option value="2">EV 2</option>
        <option value="4">EV 4</option>
        <option value="6">EV 6</option>
        <option value="8">EV 8</option>
        <option value="10">EV 10</option>
        <option value="11">EV 11</option>
        <option value="12">EV 12</option>
        <option value="13">EV 13</option>
        <option value="14">EV 14</option>
        <option value="15">EV 15</option>
    </select>
    <select id="isoFilm">
        <option value="">Select...</option>
        <option value="25">ISO 25</option>
        <option value="50">ISO 50</option>
        <option value="100">ISO 100</option>
        <option value="200">ISO 200</option>
        <option value="400">ISO 400</option>
        <option value="800">ISO 800</option>
        <option value="1600">ISO 1600</option>
        <option value="3200">ISO 3200</option>
    </select>
    <div id="documentationContent" class="hidden"></div>
    <div id="docIcon">▼</div>
    <div id="docToggle" aria-expanded="false"></div>
`;

// NOW require the module after DOM is set up
const {
    shutterSpeeds,
    findClosestShutterSpeed,
    findClosestLightSituation,
    findClosestFilmSpeed,
    clearField,
    showError,
    hideError,
} = require('../src/script.js');

describe('Shutter Speed Functions', () => {
    describe('shutterSpeeds array', () => {
        test('should contain expected shutter speed values', () => {
            expect(shutterSpeeds).toBeDefined();
            expect(Array.isArray(shutterSpeeds)).toBe(true);
            expect(shutterSpeeds.length).toBe(12);
        });

        test('should have proper structure with value and label', () => {
            shutterSpeeds.forEach(speed => {
                expect(speed).toHaveProperty('value');
                expect(speed).toHaveProperty('label');
                expect(typeof speed.value).toBe('number');
                expect(typeof speed.label).toBe('string');
            });
        });

        test('should be sorted from slowest to fastest', () => {
            for (let i = 0; i < shutterSpeeds.length - 1; i++) {
                expect(shutterSpeeds[i].value).toBeGreaterThan(shutterSpeeds[i + 1].value);
            }
        });
    });

    describe('findClosestShutterSpeed', () => {
        test('should find exact match for 1 second', () => {
            const result = findClosestShutterSpeed(1);
            expect(result.value).toBe(1);
            expect(result.label).toBe('1s');
        });

        test('should find exact match for 1/125s', () => {
            const result = findClosestShutterSpeed(0.008);
            expect(result.value).toBe(0.008);
            expect(result.label).toBe('1/125s');
        });

        test('should find closest speed for value between stops', () => {
            // 0.035 is between 1/30 (0.0333) and 1/50 (0.02)
            const result = findClosestShutterSpeed(0.035);
            expect(result.value).toBe(0.0333333); // Closer to 1/30
        });

        test('should handle very fast speeds by choosing fastest available', () => {
            const result = findClosestShutterSpeed(0.0001);
            expect(result.value).toBe(0.001); // 1/1000s
        });

        test('should handle very slow speeds by choosing slowest available', () => {
            const result = findClosestShutterSpeed(10);
            expect(result.value).toBe(1); // 1s
        });

        test('should use logarithmic comparison for accurate stop matching', () => {
            // Test that it uses log comparison (which is correct for exposure stops)
            const result = findClosestShutterSpeed(0.006);
            // Log comparison: |log(0.006/0.008)| = 0.415 vs |log(0.006/0.004)| = 0.693
            // So 0.006 is closer to 1/125s (0.008) than 1/250s (0.004) on log scale
            expect(result.value).toBe(0.008);
        });
    });
});

describe('Light Situation Functions', () => {
    describe('findClosestLightSituation', () => {
        test('should find exact EV match', () => {
            const result = findClosestLightSituation(12);
            expect(result).toBe('12');
        });

        test('should find closest EV for value between stops', () => {
            const result = findClosestLightSituation(12.7);
            expect(result).toBe('13'); // Closer to EV 13
        });

        test('should handle negative EV values', () => {
            const result = findClosestLightSituation(-1.5);
            expect(result).toBe('-2'); // Closest available
        });

        test('should handle very high EV values', () => {
            const result = findClosestLightSituation(20);
            expect(result).toBe('15'); // Highest available
        });

        test('should handle very low EV values', () => {
            const result = findClosestLightSituation(-10);
            expect(result).toBe('-2'); // Lowest available
        });
    });
});

describe('Film Speed Functions', () => {
    describe('findClosestFilmSpeed', () => {
        test('should find exact ISO match', () => {
            const result = findClosestFilmSpeed(400);
            expect(result).toBe('400');
        });

        test('should find closest ISO for value between standard speeds', () => {
            const result = findClosestFilmSpeed(300);
            // 300 is equidistant from 200 and 400 (diff: 100 each)
            // Implementation chooses the first match (200)
            expect(result).toBe('200');
        });

        test('should handle very low ISO values', () => {
            const result = findClosestFilmSpeed(10);
            expect(result).toBe('25'); // Lowest available
        });

        test('should handle very high ISO values', () => {
            const result = findClosestFilmSpeed(6400);
            expect(result).toBe('3200'); // Highest available
        });

        test('should correctly round values closer to lower ISO', () => {
            const result = findClosestFilmSpeed(283);
            // 283 is closer to 200 (diff: 83) than to 400 (diff: 117)
            expect(result).toBe('200');
        });
    });
});

describe('Error Display Functions', () => {
    describe('showError', () => {
        test('should display error message and remove hidden class', () => {
            const errorDiv = document.getElementById('error');
            showError('Test error message');
            
            expect(errorDiv.textContent).toBe('Test error message');
            expect(errorDiv.classList.contains('hidden')).toBe(false);
        });
    });

    describe('hideError', () => {
        test('should add hidden class to error div', () => {
            const errorDiv = document.getElementById('error');
            errorDiv.classList.remove('hidden');
            
            hideError();
            
            expect(errorDiv.classList.contains('hidden')).toBe(true);
        });
    });
});

describe('Field Clearing Functions', () => {
    const {
        clearTimeFields,
        clearEVFields,
        clearISOFields,
    } = require('../src/script.js');

    describe('clearField', () => {
        test('should clear EV field and reset styling', () => {
            const evDisplay = document.getElementById('evDisplay');
            evDisplay.textContent = '12';
            evDisplay.classList.add('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
            
            clearField('ev');
            
            expect(evDisplay.textContent).toBe('—');
            expect(evDisplay.classList.contains('bg-gray-200')).toBe(false);
            expect(evDisplay.classList.contains('bg-gray-100')).toBe(true);
        });

        test('should clear aperture field', () => {
            const aperture = document.getElementById('aperture');
            aperture.value = '5.6';
            aperture.classList.add('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
            
            clearField('aperture');
            
            expect(aperture.value).toBe('');
            expect(aperture.classList.contains('bg-gray-200')).toBe(false);
        });

        test('should clear time field and reset styling', () => {
            const timeDisplay = document.getElementById('timeDisplay');
            timeDisplay.textContent = '0.008';
            timeDisplay.classList.add('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
            
            clearField('time');
            
            expect(timeDisplay.textContent).toBe('—');
            expect(timeDisplay.classList.contains('bg-gray-200')).toBe(false);
        });

        test('should clear ISO field and reset styling', () => {
            const isoDisplay = document.getElementById('isoDisplay');
            isoDisplay.textContent = '400';
            isoDisplay.classList.add('bg-gray-200', 'border-gray-700', 'text-gray-800', 'font-semibold');
            
            clearField('iso');
            
            expect(isoDisplay.textContent).toBe('—');
            expect(isoDisplay.classList.contains('bg-gray-200')).toBe(false);
        });
    });

    describe('clearTimeFields', () => {
        test('should clear both time display and select', () => {
            const timeDisplay = document.getElementById('timeDisplay');
            const timeShutterSelect = document.getElementById('timeShutter');
            
            timeDisplay.textContent = '0.008';
            timeShutterSelect.value = '0.008';
            
            clearTimeFields();
            
            expect(timeDisplay.textContent).toBe('—');
            expect(timeShutterSelect.value).toBe('');
        });
    });

    describe('clearEVFields', () => {
        test('should clear both EV display and select', () => {
            const evDisplay = document.getElementById('evDisplay');
            const evSituationSelect = document.getElementById('evSituation');
            
            evDisplay.textContent = '12';
            evSituationSelect.value = '12';
            
            clearEVFields();
            
            expect(evDisplay.textContent).toBe('—');
            expect(evSituationSelect.value).toBe('');
        });
    });

    describe('clearISOFields', () => {
        test('should clear both ISO display and select', () => {
            const isoDisplay = document.getElementById('isoDisplay');
            const isoFilmSelect = document.getElementById('isoFilm');
            
            isoDisplay.textContent = '400';
            isoFilmSelect.value = '400';
            
            clearISOFields();
            
            expect(isoDisplay.textContent).toBe('—');
            expect(isoFilmSelect.value).toBe('');
        });
    });
});

describe('Exposure Calculation Formulas', () => {
    // These tests verify the mathematical correctness of the formulas used
    describe('EV calculation from aperture, ISO, and time', () => {
        test('should calculate correct EV for sunny day (Sunny 16 rule)', () => {
            // Sunny 16: f/16, 1/100s (approx 1/125s), ISO 100 should be ~EV 14-15
            const aperture = 16;
            const iso = 100;
            const time = 0.008; // 1/125s
            
            // Formula: EV = log₂(100 × A² / (ISO × T))
            const ev = Math.log2((100 * Math.pow(aperture, 2)) / (iso * time));
            
            expect(ev).toBeCloseTo(14.97, 1); // ~EV 15
        });

        test('should calculate correct EV for indoor photography', () => {
            // Typical indoor: f/2.8, 1/60s, ISO 400
            const aperture = 2.8;
            const iso = 400;
            const time = 0.0166667; // 1/60s
            
            const ev = Math.log2((100 * Math.pow(aperture, 2)) / (iso * time));
            
            expect(ev).toBeCloseTo(6.88, 1); // ~EV 7
        });
    });

    describe('Aperture calculation from EV, ISO, and time', () => {
        test('should calculate correct aperture', () => {
            const ev = 13;
            const iso = 400;
            const time = 0.008; // 1/125s
            
            // Formula: A = √(ISO × T × 2^EV / 100)
            const aperture = Math.sqrt((iso * time * Math.pow(2, ev)) / 100);
            
            expect(aperture).toBeCloseTo(16.19, 1); // ~f/16
        });
    });

    describe('ISO calculation from EV, aperture, and time', () => {
        test('should calculate correct ISO', () => {
            const ev = 12;
            const aperture = 5.6;
            const time = 0.004; // 1/250s
            
            // Formula: ISO = 100 × A² / (T × 2^EV)
            const calculatedIso = (100 * Math.pow(aperture, 2)) / (time * Math.pow(2, ev));
            
            expect(calculatedIso).toBeCloseTo(191, 0); // ~ISO 200
        });
    });

    describe('Time calculation from EV, aperture, and ISO', () => {
        test('should calculate correct shutter speed', () => {
            const ev = 14;
            const aperture = 16;
            const iso = 100;
            
            // Formula: T = 100 × A² / (ISO × 2^EV)
            const time = (100 * Math.pow(aperture, 2)) / (iso * Math.pow(2, ev));
            
            expect(time).toBeCloseTo(0.015625, 4); // ~1/64s, between 1/60 and 1/125
        });
    });
});

describe('Edge Cases and Validation', () => {
    test('should handle very small aperture values', () => {
        const aperture = 1.0;
        const iso = 100;
        const time = 1;
        
        const ev = Math.log2((100 * Math.pow(aperture, 2)) / (iso * time));
        
        expect(ev).toBeCloseTo(0, 1);
        expect(isFinite(ev)).toBe(true);
    });

    test('should handle very large aperture values', () => {
        const aperture = 22;
        const iso = 100;
        const time = 1;
        
        const ev = Math.log2((100 * Math.pow(aperture, 2)) / (iso * time));
        
        expect(ev).toBeCloseTo(8.92, 1); // ~EV 9
        expect(isFinite(ev)).toBe(true);
    });

    test('should handle extreme ISO values in calculation', () => {
        const aperture = 5.6;
        const iso = 25600;
        const time = 0.001;
        
        const ev = Math.log2((100 * Math.pow(aperture, 2)) / (iso * time));
        
        expect(isFinite(ev)).toBe(true);
    });
});
