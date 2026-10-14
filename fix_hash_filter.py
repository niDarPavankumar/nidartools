def fix_js():
    js_path = "assets/js/common.js"
    try:
        with open(js_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # जुना कोड काढून नवीन, अधिक स्मार्ट कोड टाकूया
        import re
        if "hashchange" not in content:
            # जुना ऑटो-फिल्टर कोड शोधून बदलणे
            content = re.sub(r'// --- AUTO FILTER ON CATEGORY CLICK.*?}\);', '', content, flags=re.DOTALL)
            
            new_code = """
// --- SMART HASH FILTERING ---
function applyHashFilter() {
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
        
        let buttons = document.querySelectorAll('.nidar-filter-btn'); 
        if (buttons.length === 0) {
            // जर क्लासने सापडले नाही, तर सर्व बटणे तपासा
            buttons = document.querySelectorAll('button');
        }
        
        for(let btn of buttons) {
            if(btn.innerText.toLowerCase().includes(keyword)) {
                btn.click(); // क्लिक करा
                
                // स्मूथ स्क्रोल
                setTimeout(() => {
                    const toolsSection = document.querySelector('.nidar-tool-grid') || document.querySelector('.hero').nextElementSibling;
                    if(toolsSection) {
                        toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        window.scrollBy(0, -100); // हेडरसाठी थोडी जागा सोडा
                    }
                }, 200);
                break;
            }
        }
    }
}

// पेज लोड झाल्यावर रन करा
document.addEventListener("DOMContentLoaded", applyHashFilter);

// जेव्हा URL मधील हॅश (उदा. #pdf) बदलेल तेव्हाही रन करा!
window.addEventListener("hashchange", applyHashFilter);
"""
            with open(js_path, "a", encoding="utf-8") as f:
                f.write(new_code)
            print("✅ Smart Hash Filtering updated! It will now detect clicks properly.")
        else:
            print("✅ Hash logic is already perfect.")
    except Exception as e:
        print("⚠️ JS Update Error:", e)

if __name__ == "__main__":
    fix_js()
