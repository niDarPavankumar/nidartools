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
    print("\n📂 niDar Tools - Folder Content Check\n" + "="*60)
    empty_folders = []
    html_folders = []
    missing_folders = []

    for name, url in MASTER_TOOLS.items():
        folder_name = url.strip("/")
        
        # फोल्डर आहे की नाही ते तपासणे
        if os.path.exists(folder_name):
            files = os.listdir(folder_name)
            # फोल्डर रिकामे आहे का ते तपासणे
            if len(files) == 0:
                print(f"  ⚠️ EMPTY FOLDER: /{folder_name}/ (No files inside)")
                empty_folders.append(folder_name)
            else:
                # फोल्डरमध्ये index.html आहे का ते तपासणे
                if 'index.html' in files:
                    print(f"  ✅ READY: /{folder_name}/ (Has index.html)")
                    html_folders.append(folder_name)
                else:
                    print(f"  ❓ HAS FILES (But no HTML): /{folder_name}/ -> {files}")
        else:
            print(f"  ❌ MISSING FOLDER: /{folder_name}/")
            missing_folders.append(folder_name)

    print("="*60)
    print(f"📊 Total Folders Checked : {len(MASTER_TOOLS)}")
    print(f"✅ Folders with HTML     : {len(html_folders)}")
    print(f"⚠️ Empty Folders         : {len(empty_folders)}")
    print(f"❌ Missing Folders       : {len(missing_folders)}")
    
    if len(html_folders) == len(MASTER_TOOLS):
        print("\n🎉 WOW! All 28 folders are perfectly ready with HTML files!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
