// Password Generator — engine
document.addEventListener('DOMContentLoaded', function () {

    const lengthRange = document.getElementById('lengthRange');
    const lengthValue = document.getElementById('lengthValue');

    const optUpper = document.getElementById('optUpper');
    const optLower = document.getElementById('optLower');
    const optNumbers = document.getElementById('optNumbers');
    const optSymbols = document.getElementById('optSymbols');

    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const pwdOutput = document.getElementById('pwdOutput');
    const pwdStrengthLabel = document.getElementById('pwdStrengthLabel');
    const errorBox = document.getElementById('errorBox');

    const CHARS = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    lengthRange.addEventListener('input', function () {
        lengthValue.textContent = lengthRange.value;
    });

    function getSecureRandomInt(max) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] % max;
    }

    function generatePassword() {
        errorBox.classList.add('hidden');

        let charPool = '';
        if (optUpper.checked) charPool += CHARS.upper;
        if (optLower.checked) charPool += CHARS.lower;
        if (optNumbers.checked) charPool += CHARS.numbers;
        if (optSymbols.checked) charPool += CHARS.symbols;

        if (charPool === '') {
            errorBox.classList.remove('hidden');
            pwdOutput.value = '';
            pwdStrengthLabel.textContent = 'Strength: —';
            return;
        }

        const length = parseInt(lengthRange.value, 10);
        let password = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = getSecureRandomInt(charPool.length);
            password += charPool[randomIndex];
        }

        pwdOutput.value = password;
        updateStrength(length, {
            upper: optUpper.checked,
            lower: optLower.checked,
            numbers: optNumbers.checked,
            symbols: optSymbols.checked
        });
    }

    function updateStrength(length, opts) {
        let typeCount = 0;
        if (opts.upper) typeCount++;
        if (opts.lower) typeCount++;
        if (opts.numbers) typeCount++;
        if (opts.symbols) typeCount++;

        let label = 'Weak';

        if (length >= 16 && typeCount >= 3) {
            label = 'Very Strong';
        } else if (length >= 12 && typeCount >= 3) {
            label = 'Strong';
        } else if (length >= 8 && typeCount >= 2) {
            label = 'Moderate';
        }

        pwdStrengthLabel.textContent = 'Strength: ' + label;
    }

    generateBtn.addEventListener('click', generatePassword);

    copyBtn.addEventListener('click', function () {
        if (!pwdOutput.value) return;

        navigator.clipboard.writeText(pwdOutput.value).then(function () {
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');

            setTimeout(function () {
                copyBtn.textContent = 'Copy';
                copyBtn.classList.remove('copied');
            }, 1500);
        });
    });

    generatePassword();

});
