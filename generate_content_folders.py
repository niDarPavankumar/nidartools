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

def create_boilerplate(name):
    # हा बेसिक HTML साचा आहे जो प्रत्येक नवीन टूलसाठी वापरला जाईल
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - niDar Tools</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="icon" href="../assets/favicon/favicon.ico">
</head>
<body>

    <!-- COMMON HEADER -->
    <div id="site-header"></div>

    <main class="container" style="min-height: 70vh; padding: 40px 20px; text-align: center;">
        <h1>{name}</h1>
        <p>Welcome to the {name} tool. (Your tool code will go here)</p>
    </main>

    <!-- COMMON FOOTER -->
    <div id="site-footer"></div>

    <!-- COMMON JAVASCRIPT -->
    <script src="../assets/js/common.js"></script>

</body>
</html>"""

def main():
    print("\n📁 niDar Tools - Content Folder Audit & Generator\n" + "="*60)
    created_count = 0
    existing_count = 0

    for name, url in MASTER_TOOLS.items():
        # URL मधून स्लॅश (/) काढून फोल्डरचे नाव बनवणे
        folder_name = url.strip("/")
        
        # फोल्डर अस्तित्वात नसल्यास नवीन फोल्डर बनवणे
        if not os.path.exists(folder_name):
            os.makedirs(folder_name)
            
        file_path = os.path.join(folder_name, "index.html")
        
        # जर index.html फाईल नसेल, तर नवीन बनवणे
        if not os.path.exists(file_path):
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(create_boilerplate(name))
            print(f"  ✨ NEW CREATED: /{folder_name}/index.html")
            created_count += 1
        else:
            print(f"  ✔️ Already Exists: /{folder_name}/index.html")
            existing_count += 1

    print("="*60)
    print(f"📊 Total Folders Found : {existing_count}")
    print(f"🚀 New Folders Created : {created_count}")
    print("✅ All 28 Content Folders are now 100% READY!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
