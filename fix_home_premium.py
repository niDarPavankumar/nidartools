import os

wm_path = 'index.html'
html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/assets/favicon/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.json">

    <title>niDar Tools | Free Online Tools for Images, PDF, Text & More</title>
    <link rel="canonical" href="https://nidartools.com/">
    <meta name="description" content="Free online tools by niDar Tools for image editing, PDF conversion, calculators, text utilities, developer tools and more.">                                                                      
    <meta name="robots" content="index, follow">
    
    <!-- Using inline premium CSS to avoid old style.css errors and enforce NamoCrux theme -->
    <style>
        /* Exact NamoCrux Light Theme Structure for Home Page */
        :root {
            --nc-accent: #00b894;
            --nc-accent-dark: #008f76;
            --nc-accent-soft: rgba(0, 184, 148, 0.12);
            --nc-accent-border: rgba(0, 184, 148, 0.28);
            --nc-page-bg: #effcf8;
            --nc-surface: rgba(255, 255, 255, 0.82); /* White Cards */
            --nc-surface-solid: #ffffff;
            --nc-text: #13221f;
            --nc-muted: #60736f;
            --nc-border: rgba(0, 120, 100, 0.12);
            --nc-shadow: 0 18px 50px rgba(0, 111, 91, 0.12);
            --nc-radius: 24px;
            --nc-radius-small: 14px;
        }

        body {
            background: radial-gradient(circle at 8% 8%, rgba(0, 184, 148, 0.10), transparent 28%),
                        radial-gradient(circle at 92% 22%, rgba(83, 185, 255, 0.08), transparent 26%),
                        linear-gradient(180deg, var(--nc-page-bg), var(--nc-page-bg));
            color: var(--nc-text);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
        }

        /* Hero Section */
        .namocrux-hero { text-align: center; padding: 74px 20px 54px; position: relative; }
        .namocrux-badge {
            display: inline-flex; gap: 7px; padding: 8px 15px; border: 1px solid var(--nc-accent-border);
            border-radius: 999px; background: var(--nc-accent-soft); color: var(--nc-accent-dark);
            font-size: 0.82rem; font-weight: 800; margin-bottom: 18px; text-transform: uppercase;
        }
        .tool-title { font-size: clamp(3rem, 8vw, 4.5rem); font-weight: 900; color: var(--nc-text); margin: 0 0 10px; line-height: 1; }
        .tool-title span { background: linear-gradient(100deg, var(--nc-accent-dark), var(--nc-accent)); -webkit-background-clip: text; color: transparent; }
        .tool-subtitle { font-size: clamp(1.2rem, 3vw, 1.5rem); color: var(--nc-text); font-weight: 700; max-width: 700px; margin: 0 auto 15px;}
        .hero-description { color: var(--nc-muted); font-size: 1rem; max-width: 620px; margin: 0 auto 30px; line-height: 1.7; }
        
        .hero-actions { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
        .generate-btn {
            display: inline-flex; align-items: center; justify-content: center; padding: 13px 24px;
            background: linear-gradient(135deg, var(--nc-accent), var(--nc-accent-dark));
            color: #ffffff; border: none; border-radius: 15px; font-size: 1rem; font-weight: 800; text-decoration: none;
            box-shadow: 0 12px 28px rgba(0, 184, 148, 0.24); transition: transform 0.2s, box-shadow 0.2s;
        }
        .generate-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(0, 184, 148, 0.30); }
        .secondary-btn {
            display: inline-flex; align-items: center; justify-content: center; padding: 13px 24px;
            background: var(--nc-surface); color: var(--nc-text); border: 1px solid var(--nc-border); border-radius: 15px;
            font-size: 1rem; font-weight: 800; text-decoration: none; transition: background 0.2s;
        }
        .secondary-btn:hover { background: var(--nc-accent-soft); }

        /* Tools Section */
        .workspace-card {
            max-width: 1200px; margin: 0 auto 60px; padding: clamp(22px, 5vw, 38px);
            border: 1px solid var(--nc-border); border-radius: var(--nc-radius);
            background: var(--nc-surface); box-shadow: var(--nc-shadow); backdrop-filter: blur(18px);
        }
        
        .section-kicker { display: block; color: var(--nc-accent-dark); font-size: 0.72rem; font-weight: 900; letter-spacing: 0.12em; margin-bottom: 5px; text-align: center; }
        .workspace-card h2 { text-align: center; color: var(--nc-text); font-size: clamp(1.5rem, 3vw, 2rem); margin: 0 0 10px; }
        .workspace-card > p { text-align: center; color: var(--nc-muted); margin: 0 0 30px; }

        /* Filters */
        .nidar-tool-filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 30px; }
        .nidar-filter-btn {
            padding: 8px 16px; border: 1px solid var(--nc-border); border-radius: 999px;
            background: var(--nc-surface-solid); color: var(--nc-muted); font-size: 0.9rem; font-weight: 700;
            cursor: pointer; transition: all 0.2s;
        }
        .nidar-filter-btn:hover { border-color: var(--nc-accent-border); }
        .nidar-filter-btn.active { background: var(--nc-accent-soft); color: var(--nc-accent-dark); border-color: var(--nc-accent-border); }

        /* Tool Grid */
        .nidar-tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        
        /* Individual Tool Card (NamoCrux Result Style) */
        .nidar-tool-card {
            display: flex; flex-direction: column; padding: 20px; text-decoration: none;
            border: 1px solid var(--nc-border); border-radius: 17px; background: var(--nc-surface-solid);
            box-shadow: 0 5px 18px rgba(0, 80, 65, 0.06); transition: transform 0.2s, border-color 0.2s;
            position: relative; overflow: hidden;
        }
        .nidar-tool-card::before {
            content: ""; position: absolute; top: 13px; bottom: 13px; left: 0; width: 3px;
            border-radius: 5px; background: linear-gradient(180deg, var(--nc-accent), transparent); opacity: 0; transition: opacity 0.2s;
        }
        .nidar-tool-card:hover { transform: translateY(-3px); border-color: var(--nc-accent-border); }
        .nidar-tool-card:hover::before { opacity: 1; }

        .nidar-tool-icon { font-size: 2rem; margin-bottom: 12px; }
        .nidar-tool-card-content h3 { margin: 0 0 8px; color: var(--nc-accent-dark); font-size: 1.13rem; font-weight: 900; }
        .nidar-tool-card-content p { margin: 0; color: var(--nc-muted); font-size: 0.87rem; line-height: 1.55; }
        
        /* Info Section (How it works style) */
        .how-it-works { max-width: 1000px; margin: 0 auto 60px; padding: 0 20px; }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
        .step-card {
            padding: 25px 21px; border: 1px solid var(--nc-border); border-radius: 20px;
            background: var(--nc-surface); box-shadow: 0 10px 30px rgba(0, 80, 65, 0.07);
        }
        .step-icon { width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; margin-bottom: 17px; border-radius: 14px; background: var(--nc-accent-soft); font-size: 1.3rem; }
        .step-card h3 { margin: 0 0 7px; color: var(--nc-text); font-size: 1.05rem; }
        .step-card p { margin: 0; color: var(--nc-muted); font-size: 0.86rem; line-height: 1.65; }

        /* Dark & Senior Theme Support */
        html[data-theme="dark"] {
            --nc-page-bg: #0b1118;
            --nc-surface: rgba(23, 34, 53, 0.84);
            --nc-surface-solid: #172235;
            --nc-text: #f1f5f9;
            --nc-muted: #a5b4c3;
            --nc-border: rgba(148, 163, 184, 0.16);
            --nc-shadow: 0 20px 55px rgba(0, 0, 0, 0.28);
        }
        html[data-theme="dark"] body {
            background: radial-gradient(circle at 8% 8%, rgba(74, 222, 128, 0.08), transparent 28%),
                        radial-gradient(circle at 92% 22%, rgba(59, 130, 246, 0.07), transparent 26%),
                        linear-gradient(180deg, #0b1118, #0b1118);
        }
        html[data-theme="senior"] {
            --nc-page-bg: #000000;
            --nc-surface: #111111;
            --nc-surface-solid: #111111;
            --nc-text: #ffffff;
            --nc-muted: #ffffff;
            --nc-border: #ffffff;
            --nc-shadow: none;
        }
        html[data-theme="senior"] body { background: #000000; }
        html[data-theme="senior"] * { border-width: 2px !important; }
        
        .badge-new { position: absolute; top: 15px; right: 15px; background: #ef4444; color: white; font-size: 0.65rem; padding: 3px 8px; border-radius: 12px; font-weight: 900; }
        .badge-pro { position: absolute; top: 15px; right: 15px; background: linear-gradient(90deg, #ff8a00, #e52e71); color: white; font-size: 0.65rem; padding: 3px 8px; border-radius: 12px; font-weight: 900; }
    </style>
</head>

<body>
    <div id="site-header"></div>

    <main>
        <section class="namocrux-hero">
            <div class="namocrux-badge">⚡ Free Online Tools</div>
            <h1 class="tool-title">niDar <span>Tools</span></h1>
            <p class="tool-subtitle">Powerful tools. Simple solutions.</p>
            <p class="hero-description">Everything you need to resize images, convert files, create PDFs, calculate, format text and more — directly in your browser.</p>
            <div class="hero-actions">
                <a href="#tools" class="generate-btn">Explore All Tools</a>
                <a href="/user-guide/" class="secondary-btn">User Guide</a>
            </div>
        </section>

        <section class="workspace-card" id="tools">
            <span class="section-kicker">OUR SUITE</span>
            <h2>Everything you need in one place</h2>
            <p>Fast, simple and easy-to-use online tools designed for everyday work.</p>

            <div class="nidar-tool-filters" aria-label="Tool categories">
                <button class="nidar-filter-btn active" data-filter="all">All</button>
                <button class="nidar-filter-btn" data-filter="image">🖼️ Image</button>
                <button class="nidar-filter-btn" data-filter="pdf">📄 PDF</button>
                <button class="nidar-filter-btn" data-filter="calculator">🧮 Calculators</button>
                <button class="nidar-filter-btn" data-filter="text">✍️ Text</button>
                <button class="nidar-filter-btn" data-filter="developer">💻 Developer</button>
                <button class="nidar-filter-btn" data-filter="utility">🛠️ Utility</button>
                <button class="nidar-filter-btn" data-filter="career">💼 Career</button>
                <button class="nidar-filter-btn" data-filter="ai">🤖 AI</button>
            </div>

            <div class="nidar-tools-grid">
                
                <!-- NEW PRO PDF EDITOR -->
                <a href="/pro-pdf-editor/" class="nidar-tool-card" data-category="pdf">
                    <span class="badge-new">NEW</span>
                    <div class="nidar-tool-icon">📝</div>
                    <div class="nidar-tool-card-content">
                        <h3>Pro PDF Editor</h3>
                        <p>Advanced browser-based PDF editor. Add text, signatures, and annotate.</p>
                    </div>
                </a>

                <a href="/image-watermark/" class="nidar-tool-card" data-category="image">
                    <span class="badge-new">NEW</span>
                    <div class="nidar-tool-icon">©️</div>
                    <div class="nidar-tool-card-content">
                        <h3>Pro Image Watermark</h3>
                        <p>Protect photos instantly by adding custom text watermarks securely.</p>
                    </div>
                </a>

                <a href="/namocrux/" class="nidar-tool-card" data-category="ai">
                    <div class="nidar-tool-icon">🤖</div>
                    <div class="nidar-tool-card-content">
                        <h3>NamoCrux</h3>
                        <p>AI Name Generator for unique, meaningful names for businesses and startups.</p>
                    </div>
                </a>

                <a href="/image-resizer/" class="nidar-tool-card" data-category="image">
                    <div class="nidar-tool-icon">🖼️</div>
                    <div class="nidar-tool-card-content">
                        <h3>Image Resizer</h3>
                        <p>Resize images to your exact dimensions quickly and easily.</p>
                    </div>
                </a>

                <a href="/compound-interest-calculator/" class="nidar-tool-card" data-category="calculator">
                    <div class="nidar-tool-icon">📈</div>
                    <div class="nidar-tool-card-content">
                        <h3>Compound Interest & FIRE</h3>
                        <p>Calculate investment growth and plan early financial independence.</p>
                    </div>
                </a>

                <a href="/image-converter/" class="nidar-tool-card" data-category="image">
                    <div class="nidar-tool-icon">🔄</div>
                    <div class="nidar-tool-card-content">
                        <h3>Image Format Converter</h3>
                        <p>Convert images between JPG, PNG and WebP formats instantly.</p>
                    </div>
                </a>

                <a href="/image-to-pdf/" class="nidar-tool-card" data-category="pdf">
                    <div class="nidar-tool-icon">📄</div>
                    <div class="nidar-tool-card-content">
                        <h3>Image to PDF</h3>
                        <p>Combine one or more images into a single, clean PDF file.</p>
                    </div>
                </a>

                <a href="/age-calculator/" class="nidar-tool-card" data-category="calculator">
                    <div class="nidar-tool-icon">🎂</div>
                    <div class="nidar-tool-card-content">
                        <h3>Age Calculator</h3>
                        <p>Calculate your exact age in years, months and days accurately.</p>
                    </div>
                </a>

                <a href="/qr-generator/" class="nidar-tool-card" data-category="utility">
                    <div class="nidar-tool-icon">🔳</div>
                    <div class="nidar-tool-card-content">
                        <h3>QR Code Generator</h3>
                        <p>Create clean QR codes for text, links and useful information.</p>
                    </div>
                </a>

                <a href="/pro-word-counter/" class="nidar-tool-card" data-category="text">
                    <span class="badge-pro">PRO & FREE</span>
                    <div class="nidar-tool-icon">📝</div>
                    <div class="nidar-tool-card-content">
                        <h3>Pro Word Counter</h3>
                        <p>Advanced SEO keyword density & stats. 100% Free forever!</p>
                    </div>
                </a>

                <a href="/pro-word-to-pdf/" class="nidar-tool-card" data-category="pdf">
                    <span class="badge-pro">PRO & FREE</span>
                    <div class="nidar-tool-icon">📑</div>
                    <div class="nidar-tool-card-content">
                        <h3>Pro Word to PDF</h3>
                        <p>Instant client-side DOCX to PDF conversion. 100% Free & Secure!</p>
                    </div>
                </a>
                
                <a href="/image-compressor/" class="nidar-tool-card" data-category="image">
                    <div class="nidar-tool-icon">📦</div>
                    <div class="nidar-tool-card-content">
                        <h3>Image Compressor</h3>
                        <p>Reduce image file size while maintaining excellent quality.</p>
                    </div>
                </a>

                <a href="/pdf-merger-splitter/" class="nidar-tool-card" data-category="pdf">
                    <div class="nidar-tool-icon">📚</div>
                    <div class="nidar-tool-card-content">
                        <h3>PDF Merger & Splitter</h3>
                        <p>Merge multiple PDF files or split PDF pages effortlessly.</p>
                    </div>
                </a>

                <a href="/emi-calculator/" class="nidar-tool-card" data-category="calculator">
                    <div class="nidar-tool-icon">💰</div>
                    <div class="nidar-tool-card-content">
                        <h3>EMI Calculator</h3>
                        <p>Calculate loan EMI, interest and repayment schedules clearly.</p>
                    </div>
                </a>
            </div>
        </section>

        <section class="how-it-works">
            <span class="section-kicker">WHY NIDAR TOOLS?</span>
            <h2 style="text-align: center; margin: 0 0 10px;">Simple tools. Better workflow.</h2>
            <p style="text-align: center; color: var(--nc-muted);">Built to make common digital tasks faster, safer, and easier.</p>
            
            <div class="steps-grid">
                <article class="step-card">
                    <div class="step-icon">⚡</div>
                    <h3>Fast & Simple</h3>
                    <p>Clean interfaces designed to help you complete tasks without unnecessary clicks or waiting.</p>
                </article>
                <article class="step-card">
                    <div class="step-icon">🔒</div>
                    <h3>Privacy Focused</h3>
                    <p>Wherever possible, our tools process your sensitive data directly in your browser, keeping it safe.</p>
                </article>
                <article class="step-card">
                    <div class="step-icon">📱</div>
                    <h3>Works Everywhere</h3>
                    <p>Responsive layouts optimized for perfect performance on phones, tablets, and computers.</p>
                </article>
            </div>
        </section>
    </main>

    <div id="site-footer"></div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const filterButtons = document.querySelectorAll(".nidar-filter-btn");
            const toolCards = document.querySelectorAll(".nidar-tool-card");
            filterButtons.forEach(function (button) {
                button.addEventListener("click", function () {
                    const filter = button.getAttribute("data-filter");
                    filterButtons.forEach(function (btn) { btn.classList.remove("active"); });
                    button.classList.add("active");
                    toolCards.forEach(function (card) {
                        const category = card.getAttribute("data-category");
                        if (filter === "all" || category === filter) { card.style.display = ""; } else { card.style.display = "none"; }
                    });
                });
            });
        });
    </script>
    <script src="assets/js/common.js" defer></script>
</body>
</html>
"""

if os.path.exists(wm_path):
    with open(wm_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("✅ Successfully transformed Home Page to NamoCrux Premium Theme!")
else:
    print("❌ File not found.")
