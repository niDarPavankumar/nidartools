import os
import re

IGNORE_DIRS = ['.git', 'assets']

def fix_urls():
    files_modified = 0
    total_fixes = 0
    
    print("🔍 Scanning project for broken and unclean URLs...\n")
    
    for root, dirs, files in os.walk('.'):
        # Ignore unnecessary folders
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            if file.endswith('.html') or file.endswith('.js') or file.endswith('.py'):
                # Skip this script itself
                if file == 'fix_clean_urls.py':
                    continue
                    
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                original_content = content
                
                # 1. Fix missing trailing slashes (e.g., href="/about" -> href="/about/")
                content, count1 = re.subn(r'href="/([a-zA-Z0-9_-]+)"', r'href="/\1/"', content)
                
                # 2. Fix .html extensions (e.g., href="about.html" or href="/about.html" -> href="/about/")
                content, count2 = re.subn(r'href="(?:\.\./)?/?([a-zA-Z0-9_-]+)\.html"', r'href="/\1/"', content)
                
                # 3. Fix index.html links -> href="/"
                content, count3 = re.subn(r'href="(?:\.\./)?/?index\.html"', r'href="/"', content)
                
                fixes_in_file = count1 + count2 + count3
                
                if fixes_in_file > 0:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"✅ Fixed {fixes_in_file} URLs in: {filepath}")
                    files_modified += 1
                    total_fixes += fixes_in_file
                    
    if files_modified > 0:
        print(f"\n🎉 Success! Fixed a total of {total_fixes} unclean URLs across {files_modified} files.")
    else:
        print("\n👍 Great! No unclean URLs found. All links are perfectly clean.")

if __name__ == "__main__":
    fix_urls()
