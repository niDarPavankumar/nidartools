import os

# कॅटेगरीज आणि त्यांचा डेटा
categories = {
    "pdf-tools": {
        "title": "PDF & Document",
        "badge": "📄 PDF MASTER SUITE",
        "heading": "Control Your Documents.",
        "desc": "Professional tools to merge, split, convert, edit and secure your PDF files completely in your browser.",
        "tools": [
            {"name": "Pro PDF Editor", "url": "/pro-pdf-editor/", "icon": "📝", "desc": "Advanced browser-based PDF editor. Add text, draw signatures, whiteout, and annotate."},
            {"name": "Word to PDF", "url": "/word-to-pdf/", "icon": "📑", "desc": "Convert Word documents into PDF files."},
            {"name": "PDF to Word", "url": "/pdf-to-word/", "icon": "📝", "desc": "Convert PDF documents into editable Word files."},
            {"name": "Pro Word to PDF", "url": "/pro-word-to-pdf/", "icon": "🚀", "desc": "Instant client-side DOCX to PDF conversion. 100% Free & Secure!"},
            {"name": "PDF Merger & Splitter", "url": "/pdf-merger-splitter/", "icon": "✂️", "desc": "Merge multiple PDF files or split PDF pages easily."}
        ]
    },
    "calculators": {
        "title": "Calculators",
        "badge": "🧮 SMART CALCULATORS",
        "heading": "Calculate with Confidence.",
        "desc": "Accurate, fast and easy-to-use calculators for finance, math, and everyday needs.",
        "tools": [
            {"name": "Age Calculator", "url": "/age-calculator/", "icon": "🎂", "desc": "Calculate your exact age in years, months and days."},
            {"name": "Percentage Calculator", "url": "/percentage-calculator/", "icon": "💯", "desc": "Calculate percentages, increases, decreases and ratios."},
            {"name": "EMI Calculator", "url": "/emi-calculator/", "icon": "💰", "desc": "Calculate loan EMI, interest and repayment details."},
            {"name": "GST Calculator", "url": "/gst-calculator/", "icon": "🧾", "desc": "Calculate GST amount, inclusive and exclusive prices easily."},
            {"name": "Construction Cost Estimator", "url": "/construction-cost-estimator/", "icon": "🏗️", "desc": "Estimate construction and material costs easily."},
            {"name": "SIP Return Calculator", "url": "/sip-calculator/", "icon": "📈", "desc": "Calculate mutual fund returns and visualize wealth creation."},
            {"name": "Compound Interest & FIRE", "url": "/compound-interest-calculator/", "icon": "🔥", "desc": "Calculate investment growth and plan your early financial independence."},
            {"name": "Mortgage Calculator", "url": "/mortgage-calculator/", "icon": "🏠", "desc": "Calculate your true monthly house payment including taxes."},
            {"name": "Unit Converter", "url": "/unit-converter/", "icon": "📏", "desc": "Convert Length, Weight, and Temperature instantly."}
        ]
    },
    "text-tools": {
        "title": "Text Tools",
        "badge": "✍️ TEXT STUDIO",
        "heading": "Master Your Text.",
        "desc": "Powerful utilities to count, format, and analyze text perfectly for SEO, writing, and coding.",
        "tools": [
            {"name": "Pro Word Counter", "url": "/pro-word-counter/", "icon": "📊", "desc": "Advanced SEO keyword density & stats. 100% Free forever!"},
            {"name": "Word & Character Counter", "url": "/word-counter/", "icon": "📝", "desc": "Count words, characters, sentences and paragraphs."}
        ]
    },
    "developer-tools": {
        "title": "Developer Utilities",
        "badge": "💻 DEV TOOLS",
        "heading": "Code Faster. Build Better.",
        "desc": "Essential online tools for developers to format, encode, decode and generate secure data.",
        "tools": [
            {"name": "JSON Formatter & Validator", "url": "/json-formatter/", "icon": "{}", "desc": "Format, validate and minify JSON directly in your browser."},
            {"name": "Base64 Encoder & Decoder", "url": "/base64-encoder-decoder/", "icon": "🔐", "desc": "Encode and decode text or supported files with Base64."},
            {"name": "Password Generator", "url": "/password-generator/", "icon": "🔑", "desc": "Generate strong and secure passwords for your online accounts."},
            {"name": "QR Code Generator", "url": "/qr-generator/", "icon": "📱", "desc": "Create QR codes for text, links and useful information."}
        ]
    },
    "ai-career-tools": {
        "title": "AI & Career Tools",
        "badge": "🤖 NEXT-GEN TOOLS",
        "heading": "Boost Your Career & Creativity.",
        "desc": "Leverage AI to generate ideas and utilize smart checkers to optimize your professional resume.",
        "tools": [
            {"name": "NamoCrux - AI Name Generator", "url": "/namocrux/", "icon": "🤖", "desc": "Generate unique, meaningful names for businesses, brands, startups."},
            {"name": "ATS Resume Checker", "url": "/ats-checker/", "icon": "📄", "desc": "Check your resume for ATS compatibility, keywords and job-readiness."}
        ]
    }
}

# HTML Template
def get_html_template(data):
    cards_html = ""
    for t in data["tools"]:
        cards_html += f"""
            <a href="{t['url']}" class="pro-card">
                <div class="pro-icon-wrapper">{t['icon']}</div>
                <h3>{t['name']}</h3>
                <p>{t['desc']}</p>
                <div class="pro-arrow">↗</div>
            </a>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{data['title']} - Pro Suite by niDar Tools</title>
    <meta name="description" content="{data['desc']}">
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        body {{ background-color: #f8fafc; }}
        .pro-hero {{ text-align: center; padding: 4rem 1rem 3rem; background: linear-gradient(135deg, #e0f2fe 0%, #dcfce7 100%); border-bottom: 1px solid #e2e8f0; border-radius: 0 0 40px 40px; margin-bottom: 3rem; box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05); }}
        .pro-badge {{ display: inline-block; padding: 6px 16px; background: #ffffff; color: #059669; font-size: 0.85rem; font-weight: 700; border-radius: 20px; margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); letter-spacing: 0.5px; text-transform: uppercase; }}
        .pro-hero h1 {{ font-size: 3rem; color: #0f172a; margin: 0 0 1rem 0; font-weight: 800; letter-spacing: -1px; }}
        .pro-hero p {{ color: #475569; font-size: 1.15rem; max-width: 650px; margin: 0 auto; line-height: 1.6; }}
        .pro-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; max-width: 1100px; margin: 0 auto 5rem; padding: 0 1rem; }}
        .pro-card {{ background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.8rem; text-decoration: none; transition: all 0.3s ease; position: relative; overflow: hidden; display: flex; flex-direction: column; }}
        .pro-card:hover {{ transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); border-color: #10b981; }}
        .pro-icon-wrapper {{ width: 56px; height: 56px; background: #f1f5f9; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 1.2rem; transition: background 0.3s ease; }}
        .pro-card:hover .pro-icon-wrapper {{ background: #dcfce7; }}
        .pro-card h3 {{ font-size: 1.25rem; color: #1e293b; margin: 0 0 0.5rem 0; font-weight: 700; }}
        .pro-card p {{ font-size: 0.95rem; color: #64748b; margin: 0; line-height: 1.5; flex-grow: 1; }}
        .pro-arrow {{ position: absolute; bottom: 1.8rem; right: 1.8rem; color: #cbd5e1; font-size: 1.2rem; transition: all 0.3s ease; }}
        .pro-card:hover .pro-arrow {{ color: #10b981; transform: translateX(3px) translateY(-3px); }}
        @media (max-width: 768px) {{ .pro-hero {{ padding: 3rem 1rem 2rem; border-radius: 0 0 24px 24px; }} .pro-hero h1 {{ font-size: 2.2rem; }} }}
        html.dark-mode body {{ background-color: #0f172a; }}
        html.dark-mode .pro-hero {{ background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-bottom: 1px solid #334155; }}
        html.dark-mode .pro-badge {{ background: #1e293b; color: #34d399; }}
        html.dark-mode .pro-hero h1 {{ color: #f8fafc; }}
        html.dark-mode .pro-hero p {{ color: #94a3b8; }}
        html.dark-mode .pro-card {{ background: #1e293b; border-color: #334155; }}
        html.dark-mode .pro-card h3 {{ color: #f8fafc; }}
        html.dark-mode .pro-card p {{ color: #94a3b8; }}
        html.dark-mode .pro-icon-wrapper {{ background: #0f172a; }}
    </style>
</head>
<body>
    <div id="site-header"></div>
    <main>
        <section class="pro-hero">
            <div class="pro-badge">{data['badge']}</div>
            <h1>{data['heading']}</h1>
            <p>{data['desc']}</p>
        </section>
        <div class="pro-grid">
            {cards_html}
        </div>
    </main>
    <div id="site-footer"></div>
    <script src="../assets/js/common.js"></script>
</body>
</html>"""

# फोल्डर्स आणि फाइल्स तयार करणे
for folder, data in categories.items():
    os.makedirs(folder, exist_ok=True)
    with open(f"{folder}/index.html", "w", encoding="utf-8") as f:
        f.write(get_html_template(data))
    print(f"✅ Created {folder}/index.html")

# फुटर लिंक्स अपडेट करणे
footer_path = "footer.html"
try:
    with open(footer_path, "r", encoding="utf-8") as f:
        content = f.read()

    import re
    content = re.sub(r'href="/#pdf"', 'href="/pdf-tools/"', content)
    content = re.sub(r'href="/#calculators"', 'href="/calculators/"', content)
    content = re.sub(r'href="/#text"', 'href="/text-tools/"', content)
    content = re.sub(r'href="/#developer"', 'href="/developer-tools/"', content)
    content = re.sub(r'href="/#ai"', 'href="/ai-career-tools/"', content)

    with open(footer_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("✅ Footer links updated with new category pages.")
except Exception as e:
    print("⚠️ Footer update error:", e)

