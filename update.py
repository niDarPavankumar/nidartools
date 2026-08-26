import os
import glob

# सर्व कन्टेन्ट फोल्डरमधील HTML फायली शोधा
html_files = glob.glob('content/**/*.html', recursive=True)

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # टूलचे नाव फाईलपाथवरून ओळखा (उदा. content/age-calculator/index.html -> age-calculator)
    parts = file_path.replace('\\', '/').split('/')
    if len(parts) >= 2:
        tool_name = parts[1] # age-calculator, word-counter इ.
        
        # चुकीचा कॅनॉनिकल शोधून तो मुख्य टूलच्या URL ने बदलणे
        old_canonical = f'<link rel="canonical" href="https://nidartools.com/content/{tool_name}/">'
        new_canonical = f'<link rel="canonical" href="https://nidartools.com/{tool_name}/">'
        
        if old_canonical in content:
            content = content.replace(old_canonical, new_canonical)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {file_path}")
        else:
            # जर आधीपासूनच वेगळा असेल तर सरळ <head> मध्ये शोधून रिप्लेस करणे किंवा जोडणे
            print(f"Checked: {file_path}")

print("All content canonical tags updated successfully!")

