import os
import re

# १. Trustpilot स्क्रिप्टला ३.५ सेकंद delay देणे (Main-thread fix)
js_file = 'assets/js/common.js'
if os.path.exists(js_file):
    with open(js_file, 'r', encoding='utf-8') as f:
        js = f.read()
    js = js.replace('loadTrustpilot();', 'setTimeout(loadTrustpilot, 3500);')
    with open(js_file, 'w', encoding='utf-8') as f:
        f.write(js)
    print("✅ Trustpilot Script Delayed")

# २. दोन्ही CSS फाईल्समधील ॲनिमेशन एरर काढणे
css_files = ['assets/css/common.css', 'assets/css/style.css']
for css_file in css_files:
    if os.path.exists(css_file):
        with open(css_file, 'r', encoding='utf-8') as f:
            css = f.read()
        css = re.sub(r'transition:\s*background-color[^;]+;', '/* PageSpeed Fix */', css)
        css = re.sub(r'transition:\s*all\s*0\.3s[^;]+;', '/* PageSpeed Fix */', css)
        with open(css_file, 'w', encoding='utf-8') as f:
            f.write(css)
        print(f"✅ CSS Animation Error Fixed in {css_file}")

# ३. लोगो इमेज सुरक्षित ठेवून ऑप्टिमाइझ करणे (LCP Fix)
html_file = 'header.html'
if os.path.exists(html_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()
    old_img_tag = r'<img[^>]*nidar-logo\.webp[^>]*>'
    # इमेज तशीच ठेवून त्याला width, height आणि fetchpriority लावले आहे
    new_img_tag = '<img src="/assets/images/nidar-logo.webp" alt="niDar Tools" class="header-logo-icon" width="133" height="66" fetchpriority="high">'
    html = re.sub(old_img_tag, new_img_tag, html)
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print("✅ Image Logo Optimized safely for LCP")

print("🎉 सर्व PageSpeed प्रॉब्लेम्स सुरक्षितपणे फिक्स झाले आहेत!")
