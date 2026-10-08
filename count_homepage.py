import os

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

def main():
    print("\n🏠 Home Page (index.html) - Tool Counter Report\n" + "="*55)
    try:
        with open("index.html", "r", encoding="utf-8") as f:
            content = f.read()

        found_tools = []
        missing_tools = []

        for name, url in MASTER_TOOLS.items():
            if url in content:
                found_tools.append(name)
            else:
                missing_tools.append(name)

        print(f"✅ Successfully Found {len(found_tools)} tools on the Home Page.")
        
        if missing_tools:
            print(f"\n❌ Missing {len(missing_tools)} tools:")
            for tool in missing_tools:
                print(f"  - {tool}")
        else:
            print("\n🎉 WOW! All 28 tools are perfectly linked on the Home Page!")
            
        print("="*55)
        print(f"📊 Final Score: {len(found_tools)} / {len(MASTER_TOOLS)} tools active")
        print("="*55 + "\n")

    except FileNotFoundError:
        print("⚠️ Error: index.html not found in the current directory.")

if __name__ == "__main__":
    main()
