import os

file_path = 'assets/js/common.js'

if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replacing both double and single quote variations to be perfectly safe
    new_content = content.replace('href="/privacy"', 'href="/privacy/"')
    new_content = new_content.replace("href='/privacy'", "href='/privacy/'")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Successfully updated Privacy Policy link to a Clean URL (/privacy/) in common.js!")
else:
    print(f"❌ File not found at {file_path}.")
