import os

file_path = 'footer.html'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Replace light color (#cbd5e1) with dark slate color (#334155) for contrast
    html = html.replace("color: #cbd5e1;", "color: #334155;")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("✅ Successfully fixed contrast ratio in footer.html!")
else:
    print("❌ footer.html not found.")
