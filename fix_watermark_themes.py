import os

wm_path = 'image-watermark/index.html'
if os.path.exists(wm_path):
    with open(wm_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # The exact dark and senior theme variables to add to the CSS
    theme_css = """
    /* Dark Theme */
    html[data-theme="dark"] {
        --nc-accent: #4ade80;
        --nc-accent-dark: #22c55e;
        --nc-accent-soft: rgba(74, 222, 128, 0.11);
        --nc-accent-border: rgba(74, 222, 128, 0.25);
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

    /* Senior Theme */
    html[data-theme="senior"] {
        --nc-accent: #ffff00;
        --nc-accent-dark: #ffff00;
        --nc-accent-soft: rgba(255, 255, 0, 0.10);
        --nc-accent-border: #ffffff;
        --nc-page-bg: #000000;
        --nc-surface: #111111;
        --nc-surface-solid: #111111;
        --nc-text: #ffffff;
        --nc-muted: #ffffff;
        --nc-border: #ffffff;
        --nc-shadow: none;
    }
    html[data-theme="senior"] body { background: #000000; }
    html[data-theme="senior"] * { text-shadow: none; border-width: 2px !important; }
    """

    # Inject the themes into the <style> block
    if '</style>' in html and 'html[data-theme="dark"]' not in html:
        html = html.replace('</style>', theme_css + '\n  </style>')

    with open(wm_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("✅ Fixed Watermark Theme Switcher: Dark and Senior modes will now work perfectly!")
else:
    print("❌ File not found.")
