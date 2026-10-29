import os

file_path = 'assets/css/style.css'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Update Root & Body to NamoCrux Style (Top Mint fading to White bottom)
    if ":root {" in css:
        old_root_split = css.split(":root {")[1].split("}")[0]
        new_root = """
  --bg-color: #ffffff;
  --card-bg: #ffffff;
  --text-color: #0f172a;
  --text-muted: #475569;
  --primary: #0d9488;
  --primary-hover: #0f766e;
  --border-color: rgba(226, 232, 240, 0.8);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  --card-hover-translate: -4px;
  --radius: 16px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
"""
        css = css.replace(old_root_split, new_root)

    # 2. Add Top Gradient to Body
    old_body = """body {
  background: linear-gradient(135deg, #e0f8f5 0%, #ccfbf1 50%, #f1f5f9 100%);
  background-attachment: fixed;
  color: var(--text-color);
  line-height: 1.6;
  overflow-x: hidden;
}"""
    # Fallback if old body wasn't exactly matched
    old_body_alt = """body {
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
  overflow-x: hidden;
}"""

    new_body = """body {
  background: linear-gradient(180deg, #ccfbf1 0%, #ffffff 35%, #ffffff 100%);
  background-repeat: no-repeat;
  background-attachment: scroll;
  color: var(--text-color);
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
}"""
    if old_body in css:
        css = css.replace(old_body, new_body)
    elif old_body_alt in css:
        css = css.replace(old_body_alt, new_body)

    # 3. Add Rainbow Border to Header
    old_header = """header {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}"""
    new_header = """header {
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 1000;
}
header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #8b5cf6, #ec4899, #eab308, #10b981, #06b6d4);
}"""
    if old_header in css:
        css = css.replace(old_header, new_header)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("✅ Successfully applied precise NamoCrux style!")
else:
    print("❌ style.css not found.")
