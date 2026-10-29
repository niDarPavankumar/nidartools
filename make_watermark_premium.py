import os

wm_path = 'image-watermark/index.html'
if os.path.exists(wm_path):
    with open(wm_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # The exact premium dark CSS from NamoCrux
    premium_css = """<style>
        :root {
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
            --nc-radius: 24px;
        }

        body { 
            background: radial-gradient(circle at 8% 8%, rgba(74, 222, 128, 0.08), transparent 28%),
                        radial-gradient(circle at 92% 22%, rgba(59, 130, 246, 0.07), transparent 26%),
                        linear-gradient(180deg, #0b1118, #0b1118);
            color: var(--nc-text);
            min-height: 100vh;
        }

        .pro-hero { 
            text-align: center; 
            padding: 4rem 1rem 2rem; 
            margin-bottom: 2rem; 
            position: relative;
        }
        
        .pro-badge { 
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 8px 15px;
            border: 1px solid var(--nc-accent-border);
            border-radius: 999px;
            background: var(--nc-accent-soft);
            color: var(--nc-accent);
            font-size: 0.82rem;
            font-weight: 800;
            margin-bottom: 1rem;
        }
        
        .pro-hero h1 { 
            font-size: clamp(2.5rem, 6vw, 4rem);
            color: var(--nc-text); 
            margin: 0 0 1rem 0; 
            font-weight: 900; 
        }
        
        .pro-hero p { 
            color: var(--nc-muted); 
            font-size: 1.1rem; 
            max-width: 600px; 
            margin: 0 auto; 
            line-height: 1.6; 
        }

        .tool-layout { 
            display: grid; 
            grid-template-columns: 350px 1fr; 
            gap: 2rem; 
            max-width: 1100px; 
            margin: 0 auto 3rem; 
            padding: 2rem;
            background: var(--nc-surface);
            border: 1px solid var(--nc-border);
            border-radius: var(--nc-radius);
            box-shadow: var(--nc-shadow);
            backdrop-filter: blur(18px);
        }

        .controls-panel { display: flex; flex-direction: column; gap: 1.5rem; }
        
        .preview-panel { 
            background: var(--nc-surface-solid); 
            border-radius: 16px; 
            padding: 1.5rem; 
            border: 2px dashed var(--nc-border); 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            min-height: 450px; 
        }

        .control-group label { display: block; font-weight: 700; color: var(--nc-text); margin-bottom: 0.5rem; font-size: 0.95rem; }
        .control-group input[type="text"], .control-group select { 
            width: 100%; padding: 12px; border: 1px solid var(--nc-border); border-radius: 12px; 
            background: var(--nc-surface-solid); color: var(--nc-text); font-size: 1rem; outline: none; 
        }
        .control-group input[type="text"]:focus, .control-group select:focus { border-color: var(--nc-accent); box-shadow: 0 0 0 3px var(--nc-accent-soft); }
        .control-group input[type="range"] { width: 100%; accent-color: var(--nc-accent); }
        .control-group input[type="color"] { width: 100%; height: 44px; border: 1px solid var(--nc-border); border-radius: 12px; cursor: pointer; background: var(--nc-surface-solid); }

        .primary-btn { 
            display: block; width: 100%; padding: 14px; 
            background: linear-gradient(135deg, var(--nc-accent), var(--nc-accent-dark)); 
            color: #000; border: none; border-radius: 14px; font-size: 1.1rem; font-weight: 800; 
            cursor: pointer; transition: all 0.2s ease; box-shadow: 0 10px 25px rgba(74, 222, 128, 0.2); 
        }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(74, 222, 128, 0.3); }

        #canvas-container { max-width: 100%; max-height: 60vh; display: flex; justify-content: center; align-items: center; }
        canvas { max-width: 100%; max-height: 100%; border-radius: 8px; }

        @media (max-width: 850px) { 
            .tool-layout { grid-template-columns: 1fr; padding: 1.5rem; } 
        }

        .seo-content { 
            max-width: 900px; margin: 0 auto 4rem; padding: 2.5rem; 
            background: var(--nc-surface); border-radius: var(--nc-radius); 
            border: 1px solid var(--nc-border); box-shadow: var(--nc-shadow); 
        }
        .seo-content h2, .seo-content h3 { color: var(--nc-text); font-weight: 800; }
        .seo-content p, .seo-content ul { color: var(--nc-muted); line-height: 1.7; }
    </style>"""

    # Replace old styling
    start_idx = html.find('<style>')
    end_idx = html.find('</style>')
    if start_idx != -1 and end_idx != -1:
        html = html[:start_idx] + premium_css + html[end_idx+8:]

    with open(wm_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("✅ Fixed Pro Image Watermark: Now exactly matches NamoCrux Dark Theme!")
else:
    print("❌ image-watermark/index.html not found.")
