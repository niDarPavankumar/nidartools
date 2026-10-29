import os

# --- 1. Fix User Guide ---
ug_path = 'user-guide/index.html'
if os.path.exists(ug_path):
    with open(ug_path, 'r', encoding='utf-8') as f:
        ug_html = f.read()
    
    # Replace basic cards with premium nidar-tool-card design
    ug_html = ug_html.replace('<section class="card">', '<section class="nidar-tool-card" style="margin-bottom: 2rem;"><div class="nidar-tool-card-content">')
    ug_html = ug_html.replace('</section>', '</div></section>')
    # Fix the duplicate closing divs created by the above simple replace for the hero section
    ug_html = ug_html.replace('</p>\n</div></section>', '</p>\n</section>')
    ug_html = ug_html.replace('<section class="hero">', '<section class="nidar-home-hero" style="margin-bottom: 3rem; text-align: center;">')
    
    with open(ug_path, 'w', encoding='utf-8') as f:
        f.write(ug_html)
    print("✅ Fixed User Guide design!")

# --- 2. Fix Pro Image Watermark ---
wm_path = 'image-watermark/index.html'
if os.path.exists(wm_path):
    with open(wm_path, 'r', encoding='utf-8') as f:
        wm_html = f.read()
    
    # Remove old inline blue styles and use our main variables
    old_style = """        /* NamoCrux Inspired Premium Styling */
        body { background-color: #f8fafc; }
        .pro-hero { text-align: center; padding: 3rem 1rem 2rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-bottom: 1px solid #bfdbfe; border-radius: 0 0 40px 40px; margin-bottom: 3rem; }
        .pro-badge { display: inline-block; padding: 6px 16px; background: #ffffff; color: #2563eb; font-size: 0.85rem; font-weight: 700; border-radius: 20px; margin-bottom: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .pro-hero h1 { font-size: 2.5rem; color: #1e3a8a; margin: 0 0 1rem 0; font-weight: 800; }
        .pro-hero p { color: #3b82f6; font-size: 1.1rem; max-width: 700px; margin: 0 auto; line-height: 1.6; }

        .tool-layout { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; max-width: 1200px; margin: 0 auto 3rem; padding: 0 1rem; }
        .controls-panel { background: #ffffff; border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; height: fit-content; }
        .preview-panel { background: #f8fafc; border-radius: 16px; padding: 1.5rem; box-shadow: inset 0 2px 10px rgba(0,0,0,0.05); border: 2px dashed #cbd5e1; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 450px; overflow: hidden; position: relative; }

        .control-group { margin-bottom: 1.2rem; }
        .control-group label { display: block; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem; font-size: 0.95rem; }
        .control-group input[type="text"], .control-group select { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .control-group input[type="text"]:focus, .control-group select:focus { border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1); }
        .control-group input[type="range"] { width: 100%; cursor: pointer; accent-color: #0d9488; }
        .control-group input[type="color"] { width: 100%; height: 40px; border: none; border-radius: 8px; cursor: pointer; background: none; padding: 0; }

        .primary-btn { display: block; width: 100%; padding: 12px; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%); color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.3s; text-align: center; box-sizing: border-box; box-shadow: 0 4px 15px rgba(13, 148, 136, 0.3); }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(13, 148, 136, 0.45); }

        #canvas-container { max-width: 100%; max-height: 60vh; display: flex; justify-content: center; align-items: center; }
        canvas { max-width: 100%; max-height: 100%; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }

        @media (max-width: 768px) { .tool-layout { grid-template-columns: 1fr; } }

        /* SEO Content Styling */
        .seo-content { max-width: 1000px; margin: 0 auto 4rem; padding: 2rem; background: var(--card-bg); border-radius: 16px; box-shadow: var(--shadow); border: 1px solid var(--border-color); }
        .seo-content h2 { color: var(--text-color); font-size: 1.8rem; margin-bottom: 1rem; font-weight: 800; }
        .seo-content h3 { color: var(--text-color); font-size: 1.3rem; margin-top: 1.5rem; margin-bottom: 0.8rem; }
        .seo-content p, .seo-content ul { color: var(--text-muted); line-height: 1.7; font-size: 1.05rem; }
        .seo-content ul { margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .seo-content li { margin-bottom: 0.5rem; }"""
    
    # Replace old styles
    start_idx = wm_html.find('/* NamoCrux Inspired Premium Styling */')
    end_idx = wm_html.find('</style>')
    if start_idx != -1 and end_idx != -1:
        wm_html = wm_html[:start_idx] + old_style + "\n    " + wm_html[end_idx:]

    # Remove Marathi Text and Update Hero
    wm_html = wm_html.replace('नव्या जगाचं नवं टूल - Protect your visual content', 'Protect your visual content')
    wm_html = wm_html.replace('<strong>नव्या जगाचं हे नवं टूल सर्वांसाठी पूर्णपणे मोफत उपलब्ध करून दिले आहे.</strong> In the digital age,', '<strong>Our tool is available completely free of cost for everyone.</strong> In the digital age,')
    
    # Update Hero Colors to match NamoCrux Mint
    wm_html = wm_html.replace('background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-bottom: 1px solid #bfdbfe;', 'background: transparent; border-bottom: none;')
    wm_html = wm_html.replace('color: #2563eb;', 'color: var(--primary);')
    wm_html = wm_html.replace('color: #1e3a8a;', 'color: var(--text-color);')
    wm_html = wm_html.replace('color: #3b82f6;', 'color: var(--text-muted);')

    with open(wm_path, 'w', encoding='utf-8') as f:
        f.write(wm_html)
    print("✅ Fixed Pro Image Watermark design and translated text to English!")
