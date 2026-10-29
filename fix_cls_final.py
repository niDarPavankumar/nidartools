import os

# १. index.html मध्ये Header ची जागा आधीच राखून ठेवणे (Dynamic load CLS fix)
index_file = 'index.html'
if os.path.exists(index_file):
    with open(index_file, 'r', encoding='utf-8') as f:
        idx = f.read()
    idx = idx.replace('<div id="site-header"></div>', '<div id="site-header" style="min-height: 68px;"></div>')
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(idx)
    print("✅ Index.html CLS space reserved")

# २. Header.html मधील लोगोचा conflicting class बदलणे
header_file = 'header.html'
if os.path.exists(header_file):
    with open(header_file, 'r', encoding='utf-8') as f:
        html = f.read()
    html = html.replace('class="header-logo-icon"', 'class="header-main-logo" style="width: 133px; height: auto; object-fit: contain;"')
    with open(header_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print("✅ Header Logo CLS & Size Fixed")

# ३. Footer.html मधील Trustpilot ची जागा आधीच राखून ठेवणे
footer_file = 'footer.html'
if os.path.exists(footer_file):
    with open(footer_file, 'r', encoding='utf-8') as f:
        footer = f.read()
    footer = footer.replace('<div class="trustpilot-widget"', '<div class="trustpilot-widget" style="min-height: 52px; display: block;"')
    with open(footer_file, 'w', encoding='utf-8') as f:
        f.write(footer)
    print("✅ Footer Trustpilot CLS Fixed")

print("🎉 सर्व Layout Shift (CLS) एरर्स कायमचे फिक्स झाले आहेत!")
