import os

def fix_footer():
    footer_path = "footer.html"
    try:
        with open(footer_path, "r", encoding="utf-8") as f:
            content = f.read()

        new_links = """<h3>Tools</h3>
            <a href="/index.html#image" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">🖼️ Image Tools</a>
            <a href="/index.html#pdf" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">📄 PDF & Document</a>
            <a href="/index.html#calculators" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">🧮 Calculators</a>
            <a href="/index.html#text" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">✍️ Text Tools</a>
            <a href="/index.html#developer" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">💻 Developer Utilities</a>
            <a href="/index.html#ai" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">🤖 AI & Career Tools</a>
"""
        
        import re
        content = re.sub(r'<h3>Tools</h3>.*?(?=</div>\s*<div class="nidar-footer-column"|<h3>Support|</div>\s*</footer>)', new_links, content, flags=re.DOTALL | re.IGNORECASE)
        
        with open(footer_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("✅ Footer links successfully updated with explicit index.html paths.")
    except Exception as e:
        print("⚠️ Error updating footer:", e)

if __name__ == "__main__":
    fix_footer()
