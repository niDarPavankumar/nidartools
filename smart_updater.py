import os

MASTER_TOOLS = {
    "Pro PDF Editor": {"url": "/pro-pdf-editor/", "category": "PDF & Document", "icon": "📝"},
    "Compound Interest & FIRE": {"url": "/compound-interest-calculator/", "category": "Calculators", "icon": "📈"},
    "SIP Return Calculator": {"url": "/sip-calculator/", "category": "Calculators", "icon": "📊"},
    "Advanced Mortgage Calculator": {"url": "/mortgage-calculator/", "category": "Calculators", "icon": "🏠"},
    "Pro Word Counter": {"url": "/pro-word-counter/", "category": "Text Tools", "icon": "📝"},
    "Pro Word to PDF": {"url": "/pro-word-to-pdf/", "category": "PDF & Document", "icon": "📑"},
    "Unit Converter": {"url": "/unit-converter/", "category": "Developer Utilities", "icon": "🔄"}
}

def main():
    print("\n🔍 Smart Auditor - Missing Tools Report\n" + "="*50)
    
    try:
        with open("assets/js/common.js", "r") as f:
            js_content = f.read()
            
        missing_search = []
        for name, data in MASTER_TOOLS.items():
            if data["url"] not in js_content:
                missing_search.append((name, data))
                
        if missing_search:
            print("❌ MISSING in Search Bar (common.js):")
            for name, data in missing_search:
                print(f"  - {name}")
                
            print("\n✅ Run this command to fix Search Bar:")
            fix_cmd = "sed -i '/const tools = \\[/a \\\n"
            for name, data in missing_search:
                fix_cmd += f'            ["{name}", "{data["url"]}"],\\\n'
            fix_cmd += "' assets/js/common.js"
            print(f"\033[92m{fix_cmd}\033[0m\n")
        else:
            print("✅ Search Bar (common.js) is 100% PERFECT!")

    except FileNotFoundError:
        print("⚠️ assets/js/common.js not found.")

if __name__ == "__main__":
    main()
