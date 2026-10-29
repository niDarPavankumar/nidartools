import os
import re

# 1. Index.html: Header ला लॉक करणे आणि ॲक्सेसिबिलिटी (Contrast) वाढवणे
index_file = 'index.html'
if os.path.exists(index_file):
    with open(index_file, 'r', encoding='utf-8') as f:
        idx = f.read()

    # हेडरची साईझ लॉक करणे जेणेकरून Unstyled HTML पेजला खाली ढकलणार नाही
    old_header = '<div id="site-header" style="min-height: 68px;"></div>'
    new_header = '<div id="site-header" style="min-height: 68px; max-height: 68px; overflow: hidden; position: sticky; top: 0; z-index: 9999;"></div>'
    
    if old_header in idx:
        idx = idx.replace(old_header, new_header)
    else:
        idx = idx.replace('<div id="site-header"></div>', new_header)

    # Accessibility Fix: बॅजचा रंग डार्क करणे (Contrast 100 करण्यासाठी)
    idx = idx.replace('--nc-accent-dark: #008f76;', '--nc-accent-dark: #006b58;')

    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(idx)
    print("✅ Index.html Header Locked & Accessibility Fixed")

# 2. Header.html: गुगलच्या सूचनेनुसार लोगोची अचूक 104x52 साईझ देणे
header_file = 'header.html'
if os.path.exists(header_file):
    with open(header_file, 'r', encoding='utf-8') as f:
        html = f.read()

    # गुगलने सांगितलेली 104x52 ही परफेक्ट साईझ लागू करणे
    html = re.sub(r'style="width: 133px[^"]*"', 'style="width: 104px; height: 52px; object-fit: contain;"', html)
    html = html.replace('width="133"', 'width="104" height="52"')

    with open(header_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print("✅ Header Logo exact dimensions applied (104x52)")

print("🎉 Desktop CLS आणि Accessibility चे सर्व मुद्दे फिक्स झाले आहेत!")
