(function () {

    const base = '/';

    function loadComponent(id, file, callback) {
        const element = document.getElementById(id);

        if (!element) return;

        fetch(base + file)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load ' + file);
                }

                return response.text();
            })
            .then(html => {
                element.innerHTML = html;

                if (typeof callback === 'function') {
                    callback(element);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    function loadCommonCSS() {
        if (document.querySelector('link[data-nidar-common-css]')) {
            return;
        }

        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.href = '/assets/css/common.css';
        link.dataset.nidarCommonCss = 'true';

        document.head.appendChild(link);
    }

    /* ---------- Trustpilot ---------- */

    function loadTrustpilot() {

        if (window.Trustpilot) {
            initializeTrustpilotWidgets();
            return;
        }

        if (document.querySelector('script[data-nidar-trustpilot]')) {
            return;
        }

        const script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
        script.async = true;
        script.dataset.nidarTrustpilot = 'true';

        script.onload = function () {
            initializeTrustpilotWidgets();
        };

        document.head.appendChild(script);
    }

    function initializeTrustpilotWidgets() {

        if (!window.Trustpilot) return;

        document.querySelectorAll('.trustpilot-widget').forEach(function (element) {

            if (element.dataset.trustpilotInitialized === 'true') {
                return;
            }

            window.Trustpilot.loadFromElement(element, true);
            element.dataset.trustpilotInitialized = 'true';

        });
    }

    /* ---------- Theme System ---------- */

    function initTheme() {

        const themeButton = document.getElementById('themeToggle');

        if (!themeButton) return;

        const savedTheme =
            localStorage.getItem('nidar_theme') ||
            localStorage.getItem('theme') ||
            'light';

        function applyTheme(theme) {

            document.documentElement.setAttribute(
                'data-theme',
                theme
            );

            document.body.classList.remove(
                'dark',
                'senior-theme'
            );

            if (theme === 'dark') {
                document.body.classList.add('dark');
                themeButton.textContent = '☀️';
                themeButton.title = 'Switch to Senior Theme';

            } else if (theme === 'senior') {
                document.body.classList.add('senior-theme');
                themeButton.textContent = '👓';
                themeButton.title = 'Switch to Light Theme';

            } else {
                themeButton.textContent = '🌙';
                themeButton.title = 'Switch to Dark Theme';
            }

            localStorage.setItem('nidar_theme', theme);
            localStorage.setItem('theme', theme);
        }

        applyTheme(savedTheme);

        themeButton.addEventListener('click', function () {

            const current =
                localStorage.getItem('nidar_theme') || 'light';

            let next;

            if (current === 'light') {
                next = 'dark';
            } else if (current === 'dark') {
                next = 'senior';
            } else {
                next = 'light';
            }

            applyTheme(next);
        });
    }

    /* ---------- Mobile Menu ---------- */

    function initMobileMenu() {

        const menuButton =
            document.getElementById('nidarMenuToggle');

        const nav =
            document.getElementById('nidarNav');

        if (!menuButton || !nav) return;

        menuButton.addEventListener('click', function () {

            const isOpen =
                nav.classList.toggle('is-open');

            menuButton.setAttribute(
                'aria-expanded',
                String(isOpen)
            );

            menuButton.setAttribute(
                'aria-label',
                isOpen
                    ? 'Close navigation menu'
                    : 'Open navigation menu'
            );
        });

        nav.querySelectorAll('a').forEach(function (link) {

            link.addEventListener('click', function () {

                nav.classList.remove('is-open');

                menuButton.setAttribute(
                    'aria-expanded',
                    'false'
                );
            });
        });
    }

    /* ---------- Tool Search ---------- */

    function initSearch() {

        const searchButton =
            document.getElementById('nidarSearchBtn');

        const searchPanel =
            document.getElementById('nidarSearchPanel');

        const searchInput =
            document.getElementById('nidarSearchInput');

        const results =
            document.getElementById('nidarSearchResults');

        if (
            !searchButton ||
            !searchPanel ||
            !searchInput ||
            !results
        ) {
            return;
        }

        const tools = [
            ["Compound Interest & FIRE", "/compound-interest-calculator/"],
            ["SIP Return Calculator", "/sip-calculator/"],
            ["Advanced Mortgage Calculator", "/mortgage-calculator/"],
            ["Pro Word Counter", "/pro-word-counter/"],
            ["Pro Word to PDF", "/pro-word-to-pdf/"],
            ["Unit Converter", "/unit-converter/"],

['Pro PDF Editor', '/pro-pdf-editor/'],
            ['Image Resizer', '/image-resizer/'],
            ['Image Compressor', '/image-compressor/'],
            ['Image Converter', '/image-converter/'],
            ['Background Remover', '/background-remover/'],
            ['Icon/Favicon Tools', '/icon-kit-generator/'],
            ['Image to PDF', '/image-to-pdf/'],
            ['Word to PDF', '/word-to-pdf/'],
            ['PDF to Word', '/pdf-to-word/'],
            ['PDF Merger & Splitter', '/pdf-merger-splitter/'],
            ['QR Generator', '/qr-generator/'],
            ['Word Counter', '/word-counter/'],
            ['Age Calculator', '/age-calculator/'],
            ['Percentage Calculator', '/percentage-calculator/'],
            ['EMI Calculator', '/emi-calculator/'],
            ['GST Calculator', '/gst-calculator/'],
            ['Construction Cost Estimator', '/construction-cost-estimator/'],
            ['JSON Formatter', '/json-formatter/'],
            ['Base64 Encoder/Decoder', '/base64-encoder-decoder/'],
            ['Password Generator', '/password-generator/'],
            ['ATS Resume Checker', '/ats-checker/'],
            ['NamoCrux – AI Name Generator', '/namocrux/']
        ];

        function showResults(query) {

            results.innerHTML = '';

            const text = query.trim().toLowerCase();

            if (!text) {
                return;
            }

            const matches = tools.filter(function (tool) {

                return tool[0]
                    .toLowerCase()
                    .includes(text);
            });

            if (matches.length === 0) {

                results.innerHTML =
                    '<div class="nidar-search-empty">No tools found.</div>';

                return;
            }

            matches.forEach(function (tool) {

                const link =
                    document.createElement('a');

                link.href = tool[1];
                link.textContent = tool[0];
                link.className = 'nidar-search-result';

                results.appendChild(link);
            });
        }

        searchButton.addEventListener('click', function () {

            const isHidden =
                searchPanel.hasAttribute('hidden');

            if (isHidden) {

                searchPanel.removeAttribute('hidden');

                setTimeout(function () {
                    searchInput.focus();
                }, 50);

            } else {

                searchPanel.setAttribute('hidden', '');

                searchInput.value = '';
                results.innerHTML = '';
            }
        });

        searchInput.addEventListener(
            'input',
            function () {
                showResults(searchInput.value);
            }
        );

        searchInput.addEventListener(
            'keydown',
            function (event) {

                if (event.key === 'Escape') {

                    searchPanel.setAttribute(
                        'hidden',
                        ''
                    );

                    searchInput.value = '';
                    results.innerHTML = '';
                }
            }
        );
    }

    /* ---------- Scroll To Top ---------- */

    function createScrollTopButton() {

        if (document.querySelector('.nidar-scroll-top')) {
            return;
        }

        const button =
            document.createElement('button');

        button.className = 'nidar-scroll-top';
        button.type = 'button';

        button.setAttribute(
            'aria-label',
            'Scroll to top'
        );

        button.title = 'Back to top';
        button.innerHTML = '↑';

        document.body.appendChild(button);

        window.addEventListener(
            'scroll',
            function () {

                if (window.scrollY > 300) {
                    button.classList.add('is-visible');
                } else {
                    button.classList.remove('is-visible');
                }

            },
            { passive: true }
        );

        button.addEventListener(
            'click',
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

            }
        );
    }

    /* ---------- Start Common System ---------- */

    document.addEventListener(
        'DOMContentLoaded',
        function () {

            loadCommonCSS();

            loadComponent(
                'site-header',
                'header.html',
                function () {

                    initTheme();
                    initMobileMenu();
                    initSearch();

                }
            );

            loadComponent(
                'site-footer',
                'footer.html',
                function () {
                    loadTrustpilot();
                }
            );

            createScrollTopButton();
        }
    );

})();

// --- AUTO FILTER ON CATEGORY CLICK (Footer Links) ---
document.addEventListener("DOMContentLoaded", function() {
    let hash = window.location.hash.toLowerCase();
    if (hash) {
        let target = hash.substring(1); 
        let mapping = {
            "image": "image",
            "pdf": "pdf",
            "calculators": "calculator",
            "calculator": "calculator",
            "text": "text",
            "developer": "developer",
            "ai": "ai"
        };
        let keyword = mapping[target] || target;
        
        // होम पेजवरील योग्य फिल्टर बटन शोधून त्यावर क्लिक करणे
        let buttons = document.querySelectorAll('button'); 
        for(let btn of buttons) {
            if(btn.innerText.toLowerCase().includes(keyword)) {
                btn.click(); // आपोआप फिल्टर अप्लाय होईल!
                
                // स्क्रीनला टूल्सच्या बरोबर समोर आणण्यासाठी थोडं खाली स्क्रोल करणे
                setTimeout(() => {
                    window.scrollBy({ top: 350, behavior: 'smooth' });
                }, 400);
                break;
            }
        }
    }
});

// --- SMART HASH FILTERING ---
function applyHashFilter() {
    let hash = window.location.hash.toLowerCase();
    if (hash) {
        let target = hash.substring(1); 
        let mapping = {
            "image": "image",
            "pdf": "pdf",
            "calculators": "calculator",
            "calculator": "calculator",
            "text": "text",
            "developer": "developer",
            "ai": "ai"
        };
        let keyword = mapping[target] || target;
        
        let buttons = document.querySelectorAll('.nidar-filter-btn'); 
        if (buttons.length === 0) {
            // जर क्लासने सापडले नाही, तर सर्व बटणे तपासा
            buttons = document.querySelectorAll('button');
        }
        
        for(let btn of buttons) {
            if(btn.innerText.toLowerCase().includes(keyword)) {
                btn.click(); // क्लिक करा
                
                // स्मूथ स्क्रोल
                setTimeout(() => {
                    const toolsSection = document.querySelector('.nidar-tool-grid') || document.querySelector('.hero').nextElementSibling;
                    if(toolsSection) {
                        toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        window.scrollBy(0, -100); // हेडरसाठी थोडी जागा सोडा
                    }
                }, 200);
                break;
            }
        }
    }
}

// पेज लोड झाल्यावर रन करा
document.addEventListener("DOMContentLoaded", applyHashFilter);

// जेव्हा URL मधील हॅश (उदा. #pdf) बदलेल तेव्हाही रन करा!
window.addEventListener("hashchange", applyHashFilter);
