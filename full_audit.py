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

FOOTER_CATEGORIES = [
    "/#image", "/#pdf", "/#calculator", "/#text", "/#developer", "/#ai"
]

def main():
    print("\n🔍 niDar Tools - Full Site Audit Report\n" + "="*60)

    # 1. Home Page Duplicates
    print("\n🏠 1. Home Page (index.html) - Duplicate Check")
    try:
        with open("index.html", "r", encoding="utf-8") as f:
            index_content = f.read()
        has_duplicates = False
        for name, url in MASTER_TOOLS.items():
            count = index_content.count(f'href="{url}"')
            if count > 1:
                print(f"  ⚠️ Warning: '{name}' is added {count} times! (Duplicate)")
                has_duplicates = True
        if not has_duplicates:
            print("  ✅ No duplicate tools found on the Home Page! Everything is clean.")
    except FileNotFoundError:
        print("  ⚠️ index.html not found.")

    # 2. Header Navigation
    print("\n🔝 2. Header Navigation (header.html) - Link Count")
    try:
        with open("header.html", "r", encoding="utf-8") as f:
            header_content = f.read()
        header_count = sum(1 for url in MASTER_TOOLS.values() if url in header_content)
        print(f"  ✅ {header_count} out of {len(MASTER_TOOLS)} tools are correctly linked in the Header.")
    except FileNotFoundError:
        print("  ⚠️ header.html not found.")

    # 3. Footer Links
    print("\n⬇️ 3. Footer Menu (footer.html) - Category Links Count")
    try:
        with open("footer.html", "r", encoding="utf-8") as f:
            footer_content = f.read()
        footer_count = sum(1 for cat in FOOTER_CATEGORIES if cat in footer_content)
        print(f"  ✅ {footer_count} out of {len(FOOTER_CATEGORIES)} Category Links found in the Footer.")
    except FileNotFoundError:
        print("  ⚠️ footer.html not found.")

    # 4. User Guide Tools
    print("\n📖 4. User Guide (user-guide/index.html) - Tools Explained")
    try:
        with open("user-guide/index.html", "r", encoding="utf-8") as f:
            guide_content = f.read()
        guide_found = []
        for name, url in MASTER_TOOLS.items():
            if url in guide_content:
                guide_found.append(name)
        print(f"  ✅ {len(guide_found)} tools are documented in the User Guide:")
        for name in guide_found:
            print(f"      ✔️ {name}")
    except FileNotFoundError:
        print("  ⚠️ user-guide/index.html not found.")

    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    main()
