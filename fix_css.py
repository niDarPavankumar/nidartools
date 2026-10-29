import os

file_path = 'assets/css/style.css'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Update Root Variables for Dark Mint Green Look
    old_root = """:root {
  --bg-color: #f1f5f9;
  --card-bg: rgba(255, 255, 255, 0.85);
  --text-color: #0f172a;
  --text-muted: #475569;
  --primary: #2e7d32;
  --primary-hover: #1b5e20;
  --border-color: rgba(226, 232, 240, 0.8);
  --shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  --card-hover-translate: -8px;
  --radius: 16px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}"""

    new_root = """:root {
  --bg-color: #e6f9f5;
  --card-bg: rgba(255, 255, 255, 0.85);
  --text-color: #0f172a;
  --text-muted: #334155;
  --primary: #0d9488; /* Dark Mint Green / Teal */
  --primary-hover: #0f766e;
  --border-color: rgba(13, 148, 136, 0.25);
  --shadow: 0 12px 30px -10px rgba(13, 148, 136, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  --card-hover-translate: -8px;
  --radius: 16px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}"""
    css = css.replace(old_root, new_root)

    # 2. Update Body Background to a beautiful Mint Gradient
    old_body = """body {
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
  overflow-x: hidden;
}"""

    new_body = """body {
  background: linear-gradient(135deg, #e0f8f5 0%, #ccfbf1 50%, #f1f5f9 100%);
  background-attachment: fixed;
  color: var(--text-color);
  line-height: 1.6;
  overflow-x: hidden;
}"""
    css = css.replace(old_body, new_body)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("✅ Successfully updated style.css with the new Dark Mint Green Theme!")
else:
    print("❌ style.css not found.")
