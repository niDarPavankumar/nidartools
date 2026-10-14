import os
import re

def update_footer():
    try:
        with open("footer.html", "r", encoding="utf-8") as f:
            content = f.read()

        new_links = """<h3>Tools</h3>
            <a href="/#image" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">🖼️ Image Tools</a>
            <a href="/#pdf" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">📄 PDF & Document</a>
            <a href="/#calculators" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">🧮 Calculators</a>
            <a href="/#text" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">✍️ Text Tools</a>
            <a href="/#developer" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">💻 Developer Utilities</a>
            <a href="/#ai" style="color: #cbd5e1; text-decoration: none; display: block; margin-bottom: 12px; transition: color 0.2s;">🤖 AI & Career Tools</a>
"""
        
        # फुटरमधील जुना Tools सेक्शन बदलून नवीन लिंक्स टाकणे
        content = re.sub(r'<h3>Tools</h3>.*?(?=</div>\s*<div class="nidar-footer-column"|<h3>Support|</div>\s*</footer>)', new_links, content, flags=re.DOTALL | re.IGNORECASE)
        
        with open("footer.html", "w", encoding="utf-8") as f:
            f.write(content)
        print("✅ 1. Footer HTML links updated perfectly.")
    except Exception as e:
        print("⚠️ Footer Update Error:", e)

def update_js():
    js_path = "assets/js/common.js"
    try:
        with open(js_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if "AUTO FILTER ON CATEGORY CLICK" not in content:
            js_code = """
// --- AUTO FILTER ON CATEGORY CLICK (Footer Links) ---
document.addEventListener("DOMContentLoaded", function() {
    let hash = window.location.hash.toLowerCase();
    if (hash) {
        let target = hash.substring(1); 
        let mapping = {
            "image": "image",
            "pdf": "pdf",
            "calculators": "calculator",
            "calculator": "calculator",
            "text": "text",
            "developer": "developer",
            "ai": "ai"
        };
        let keyword = mapping[target] || target;
        
        // होम पेजवरील योग्य फिल्टर बटन शोधून त्यावर क्लिक करणे
        let buttons = document.querySelectorAll('button'); 
        for(let btn of buttons) {
            if(btn.innerText.toLowerCase().includes(keyword)) {
                btn.click(); // आपोआप फिल्टर अप्लाय होईल!
                
                // स्क्रीनला टूल्सच्या बरोबर समोर आणण्यासाठी थोडं खाली स्क्रोल करणे
                setTimeout(() => {
                    window.scrollBy({ top: 350, behavior: 'smooth' });
                }, 400);
                break;
            }
        }
    }
});
"""
            with open(js_path, "a", encoding="utf-8") as f:
                f.write(js_code)
            print("✅ 2. Smart JavaScript Filtering logic added to common.js.")
        else:
            print("✅ 2. JavaScript logic is already present.")
    except Exception as e:
        print("⚠️ JS Update Error:", e)

if __name__ == "__main__":
    print("\n🚀 niDar Tools - Smart Footer & Filter Activation\n" + "="*55)
    update_footer()
    update_js()
    print("="*55)
    print("🎉 Successfully linked! Users will now see ONLY the selected tools.\n")
