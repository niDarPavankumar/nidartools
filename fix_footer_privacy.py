import os

file_path = 'footer.html'

if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # चुकीच्या /privacy किंवा विना-स्लॅशच्या लिंक्सना अचूक /privacy-policy/ मध्ये बदलणे
    content = content.replace('href="/privacy"', 'href="/privacy-policy/"')
    content = content.replace("href='/privacy'", "href='/privacy-policy/'")
    content = content.replace('href="/privacy-policy"', 'href="/privacy-policy/"')
    content = content.replace("href='/privacy-policy'", "href='/privacy-policy/'")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Successfully updated Privacy Policy link to /privacy-policy/ in footer.html!")
else:
    print(f"❌ footer.html not found.")
