import os

wm_path = 'image-watermark/index.html'
if os.path.exists(wm_path):
    with open(wm_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Add 'defer' attribute to the JavaScript file to stop render-blocking
    if '<script src="../assets/js/common.js"></script>' in html:
        html = html.replace('<script src="../assets/js/common.js"></script>', '<script src="../assets/js/common.js" defer></script>')
        
        with open(wm_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print("✅ Successfully added 'defer' to common.js to fix render-blocking!")
    else:
        print("⚠️ 'defer' might already be added or script tag format is different.")
else:
    print("❌ image-watermark/index.html not found.")
