import os

file_path = 'assets/css/style.css'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Update Root Variables to NamoCrux Dark Theme
    if ":root {" in css:
        old_root_split = css.split(":root {")[1].split("}")[0]
        new_root = """
  --bg-color: #0f172a; /* Dark Slate/Navy Background */
  --card-bg: #1e293b; /* Darker Card Background */
  --text-color: #f8fafc; /* White Text */
  --text-muted: #94a3b8; /* Light Gray Text */
  --primary: #0d9488; /* Mint Green / Teal */
  --primary-hover: #0f766e;
  --border-color: rgba(51, 65, 85, 0.8); /* Dark Border */
  --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --card-hover-translate: -6px;
  --radius: 16px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
"""
        css = css.replace(old_root_split, new_root)

    # 2. Update Body Background
    # We remove the white gradient and replace it with a solid dark gradient
    import re
    css = re.sub(r'body\s*{[^}]*}', """body {
  background: linear-gradient(180deg, #0b1121 0%, #0f172a 100%);
  background-attachment: fixed;
  color: var(--text-color);
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
}""", css, count=1)

    # 3. Update Header Background & Border
    css = re.sub(r'header\s*{[^}]*}', """header {
  background: #0f172a;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: none;
}""", css, count=1)

    # 4. Make Buttons Glossy & Pop
    old_btn = """.btn, .nidar-primary-btn {"""
    if old_btn not in css:
        # If the previous button replace didn't work, let's force it
        css += """\n
.btn, .nidar-primary-btn, .primary-btn {
  display: inline-block;
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
  color: #ffffff !important;
  padding: 0.85rem 1.75rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(13, 148, 136, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn:hover, .nidar-primary-btn:hover, .primary-btn:hover {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  box-shadow: 0 6px 20px rgba(13, 148, 136, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
}
"""

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("✅ Successfully applied NamoCrux Dark Theme to entire site!")
else:
    print("❌ style.css not found.")
