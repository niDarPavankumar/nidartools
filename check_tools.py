import os

# 1. Master List of all your tools (URL paths)
MASTER_TOOLS = {
    "Image Resizer": "/image-resizer/",
    "Image Compressor": "/image-compressor/",
    "Image Converter": "/image-converter/",
    "Background Remover": "/background-remover/",
    "Icon & Favicon Kit": "/icon-kit-generator/",
    "Image to PDF": "/image-to-pdf/",
    "Pro Word Counter": "/pro-word-counter/",
    "Pro Word to PDF": "/pro-word-to-pdf/",
    "Word to PDF": "/word-to-pdf/",
    "PDF to Word": "/pdf-to-word/",
    "PDF Merger & Splitter": "/pdf-merger-splitter/",
    "Age Calculator": "/age-calculator/",
    "Percentage Calculator": "/percentage-calculator/",
    "EMI Calculator": "/emi-calculator/",
    "GST Calculator": "/gst-calculator/",
    "Construction Cost Estimator": "/construction-cost-estimator/",
    "Compound Interest & FIRE": "/compound-interest-calculator/",
    "SIP Return Calculator": "/sip-calculator/",
    "Advanced Mortgage Calculator": "/mortgage-calculator/",
    "Unit Converter": "/unit-converter/",
    "NamoCrux AI": "/namocrux/",
    "JSON Formatter": "/json-formatter/",
    "Base64 Encoder Decoder": "/base64-encoder-decoder/",
    "Password Generator": "/password-generator/",
    "ATS Resume Checker": "/ats-checker/",
    "QR Generator": "/qr-generator/",
    "Word & Character Counter": "/word-counter/",
    "Pro PDF Editor": "/pro-pdf-editor/"
}

# 2. Files to scan
FILES_TO_CHECK = {
    "Home Page (index.html)": "index.html",
    "Mega Menu (header.html)": "header.html",
    "Footer (footer.html)": "footer.html",
    "Search Bar (common.js)": "assets/js/common.js",
    "User Guide": "user-guide/index.html"
}

def main():
    print("\n" + "="*60)
    print(" 🔍 niDar Tools - Automation Audit Report")
    print("="*60 + "\n")

    # Read the contents of each file
    file_contents = {}
    for display_name, file_path in FILES_TO_CHECK.items():
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                file_contents[display_name] = f.read()
        else:
            file_contents[display_name] = None
            print(f"⚠️  Warning: File '{file_path}' not found. Skipping.\n")

    total_tools = len(MASTER_TOOLS)
    perfect_tools = 0

    # Scan and report
    for tool_name, tool_url in MASTER_TOOLS.items():
        print(f"🛠️  {tool_name} ({tool_url})")
        
        missing_in = []
        for file_name, content in file_contents.items():
            if content is None: continue
            
            # Check if the exact URL exists in the file content
            if tool_url in content:
                print(f"    ✅ Found in {file_name}")
            else:
                print(f"    ❌ MISSING in {file_name}")
                missing_in.append(file_name)
        
        if not missing_in:
            perfect_tools += 1
        print("-" * 60)

    # Summary
    print("\n" + "="*60)
    print(" 📊 SUMMARY")
    print("="*60)
    print(f"Total Tools Checked : {total_tools}")
    print(f"Perfectly Linked    : {perfect_tools} tools")
    print(f"Needs Attention     : {total_tools - perfect_tools} tools")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
