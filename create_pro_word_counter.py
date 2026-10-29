import os
from datetime import datetime

# 1. Create the Tool Folder and File
tool_dir = 'pro-word-counter'
if not os.path.exists(tool_dir):
    os.makedirs(tool_dir)

tool_file = f"{tool_dir}/index.html"
tool_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pro Word Counter - Advanced SEO Keyword Density & Stats</title>
    <meta name="description" content="Free online advanced word counter tool. Count words, characters, sentences, paragraphs, reading time, and analyze keyword density for SEO instantly.">
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .pro-container { max-width: 1000px; margin: 3rem auto; padding: 0 1rem; }
        .hero-section { text-align: center; margin-bottom: 2rem; }
        .hero-section h1 { font-size: 2.5rem; color: #1e293b; margin-bottom: 0.5rem; }
        .hero-section p { color: #475569; font-size: 1.1rem; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-box { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; border-bottom: 3px solid #3b82f6; }
        .stat-box h3 { font-size: 1rem; color: #64748b; margin-bottom: 0.5rem; }
        .stat-box .number { font-size: 2rem; font-weight: bold; color: #0f172a; }
        
        .editor-container { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden; margin-bottom: 2rem; }
        .editor-toolbar { padding: 10px 15px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; }
        .btn-action { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.3s; }
        .btn-action:hover { background: #2563eb; }
        .btn-clear { background: #ef4444; }
        .btn-clear:hover { background: #dc2626; }
        
        textarea { width: 100%; height: 300px; border: none; padding: 1.5rem; font-size: 1.1rem; line-height: 1.6; color: #1e293b; resize: vertical; outline: none; box-sizing: border-box; }
        
        .density-section { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .density-section h2 { font-size: 1.2rem; color: #0f172a; margin-bottom: 1rem; }
        .keyword-list { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 10px; }
        .keyword-item { background: #f1f5f9; padding: 8px 15px; border-radius: 20px; font-size: 0.95rem; color: #334155; display: flex; align-items: center; gap: 8px; border: 1px solid #e2e8f0; }
        .keyword-count { background: #3b82f6; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; font-weight: bold; }
        
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    </style>
</head>
<body>
    <div id="site-header"></div>
    <main class="pro-container">
        <div class="hero-section">
            <h1>Pro Word Counter</h1>
            <p>Advanced SEO Keyword Density & Text Analytics Tool</p>
        </div>

        <div class="stats-grid">
            <div class="stat-box"><h3>Words</h3><div class="number" id="wordCount">0</div></div>
            <div class="stat-box"><h3>Characters</h3><div class="number" id="charCount">0</div></div>
            <div class="stat-box"><h3>Sentences</h3><div class="number" id="sentenceCount">0</div></div>
            <div class="stat-box"><h3>Paragraphs</h3><div class="number" id="paraCount">0</div></div>
            <div class="stat-box"><h3>Reading Time</h3><div class="number" id="readTime">0s</div></div>
            <div class="stat-box"><h3>Speaking Time</h3><div class="number" id="speakTime">0s</div></div>
        </div>

        <div class="editor-container">
            <div class="editor-toolbar">
                <button class="btn-action" onclick="copyText()">Copy Text</button>
                <button class="btn-action btn-clear" onclick="clearText()">Clear</button>
            </div>
            <textarea id="textInput" placeholder="Type or paste your text here to see real-time statistics..."></textarea>
        </div>

        <div class="density-section">
            <h2>Keyword Density (Top 10 Words)</h2>
            <ul class="keyword-list" id="keywordDensity">
                <li style="color: #64748b;">Start typing to see keyword density...</li>
            </ul>
        </div>
    </main>
    <div id="site-footer"></div>
    <script src="../assets/js/common.js"></script>
    <script>
        const input = document.getElementById('textInput');
        const commonWords = new Set(["the","and","a","to","of","in","i","is","that","it","on","you","this","for","but","with","are","have","be","at","or","as","was","so","if","out","not","my","can","do","all","we","your"]);

        function updateStats() {
            let text = input.value;
            let rawText = text.trim();
            
            // Characters
            document.getElementById('charCount').textContent = text.length;
            
            if (rawText === "") {
                document.getElementById('wordCount').textContent = "0";
                document.getElementById('sentenceCount').textContent = "0";
                document.getElementById('paraCount').textContent = "0";
                document.getElementById('readTime').textContent = "0s";
                document.getElementById('speakTime').textContent = "0s";
                document.getElementById('keywordDensity').innerHTML = '<li style="color: #64748b;">Start typing to see keyword density...</li>';
                return;
            }

            // Words
            let words = rawText.match(/\b[-?(\w+)?]+\b/gi) || [];
            document.getElementById('wordCount').textContent = words.length;

            // Sentences
            let sentences = rawText.split(/[.!?]+/).filter(s => s.trim().length > 0);
            document.getElementById('sentenceCount').textContent = sentences.length;

            // Paragraphs
            let paragraphs = rawText.split(/\n+/).filter(p => p.trim().length > 0);
            document.getElementById('paraCount').textContent = paragraphs.length;

            // Reading & Speaking Time
            let rTime = Math.ceil((words.length / 200) * 60); // 200 wpm
            let sTime = Math.ceil((words.length / 130) * 60); // 130 wpm
            document.getElementById('readTime').textContent = rTime > 59 ? Math.floor(rTime/60) + 'm ' + (rTime%60) + 's' : rTime + 's';
            document.getElementById('speakTime').textContent = sTime > 59 ? Math.floor(sTime/60) + 'm ' + (sTime%60) + 's' : sTime + 's';

            // Keyword Density
            let wordMap = {};
            words.forEach(w => {
                let lw = w.toLowerCase();
                if(!commonWords.has(lw) && lw.length > 2) {
                    wordMap[lw] = (wordMap[lw] || 0) + 1;
                }
            });

            let sortedKeywords = Object.keys(wordMap).map(key => [key, wordMap[key]]).sort((a, b) => b[1] - a[1]).slice(0, 10);
            
            let densityHtml = '';
            sortedKeywords.forEach(item => {
                let percentage = ((item[1] / words.length) * 100).toFixed(1);
                densityHtml += `<li class="keyword-item">${item[0]} <span class="keyword-count">${item[1]} (${percentage}%)</span></li>`;
            });
            
            document.getElementById('keywordDensity').innerHTML = densityHtml || '<li style="color: #64748b;">No significant keywords found.</li>';
        }

        input.addEventListener('input', updateStats);

        function clearText() { input.value = ''; updateStats(); input.focus(); }
        function copyText() { 
            input.select(); 
            document.execCommand('copy'); 
            alert("Text copied to clipboard!"); 
        }
    </script>
</body>
</html>
"""

with open(tool_file, 'w', encoding='utf-8') as f:
    f.write(tool_html)
print(f"✅ Created Tool page: {tool_file}")

# 2. Create the SEO Content Guide
content_dir = 'content'
if not os.path.exists(content_dir):
    os.makedirs(content_dir)

content_file = f"{content_dir}/pro-word-counter-guide.html"
content_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pro Word Counter Guide: Optimize Your Content for SEO</title>
    <meta name="description" content="Learn how to use the Pro Word Counter tool to analyze text, check keyword density, and improve your content writing for better SEO rankings.">
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .article-container { max-width: 800px; margin: 4rem auto; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        h1 { color: #1e3a8a; font-size: 2.5rem; margin-bottom: 1.5rem; }
        h2 { color: #2563eb; font-size: 1.8rem; margin-top: 2rem; margin-bottom: 1rem; }
        p { color: #475569; line-height: 1.8; font-size: 1.1rem; margin-bottom: 1.5rem; }
        ul { margin-bottom: 1.5rem; color: #475569; line-height: 1.8; }
        .try-tool-btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 1rem; }
    </style>
</head>
<body>
    <div id="site-header"></div>
    <main class="article-container">
        <h1>How to Optimize Content with Pro Word Counter</h1>
        <p>Writing great content is only half the battle. To rank well on search engines, you need to understand the metrics behind your text. Our Pro Word Counter is designed specifically for SEO professionals, copywriters, and students.</p>
        
        <h2>Why is Keyword Density Important?</h2>
        <p>Keyword density refers to the percentage of times a keyword or phrase appears on a web page compared to the total number of words on the page. Search engines use this metric to determine what a page is about.</p>
        <ul>
            <li><strong>Avoid Keyword Stuffing:</strong> Overusing a keyword can lead to search engine penalties. Our tool helps you keep the density natural (usually around 1-3%).</li>
            <li><strong>Identify Missing Themes:</strong> Sometimes you might forget to include secondary keywords. The analyzer shows you your top 10 most used words instantly.</li>
        </ul>

        <h2>More Than Just a Word Counter</h2>
        <p>Unlike basic tools, Pro Word Counter provides a holistic view of your text:</p>
        <ul>
            <li><strong>Reading Time:</strong> Crucial for blog posts. Know exactly how long it takes an average user to read your article.</li>
            <li><strong>Speaking Time:</strong> Perfect for speechwriters and video creators planning their scripts.</li>
            <li><strong>Paragraph & Sentence Tracking:</strong> Helps you maintain readability by keeping paragraphs short and concise.</li>
        </ul>
        
        <p>All processing happens instantly in your browser, meaning your private documents are never sent to any server.</p>
        <a href="/pro-word-counter/" class="try-tool-btn">Open Pro Word Counter ↗</a>
    </main>
    <div id="site-footer"></div>
    <script src="../assets/js/common.js"></script>
</body>
</html>
"""

with open(content_file, 'w', encoding='utf-8') as f:
    f.write(content_html)
print(f"✅ Created Content Guide page: {content_file}")

# 3. Update Sitemap with both URLs
sitemap_path = 'sitemap.xml'
today = datetime.today().strftime('%Y-%m-%d')
tool_url = 'https://nidartools.com/pro-word-counter/'
content_url = 'https://nidartools.com/content/pro-word-counter-guide/'

if os.path.exists(sitemap_path):
    with open(sitemap_path, 'r', encoding='utf-8') as f:
        sitemap_content = f.read()
        
    entries_to_add = ""
    if tool_url not in sitemap_content:
        entries_to_add += f"\n    <url>\n        <loc>{tool_url}</loc>\n        <lastmod>{today}</lastmod>\n        <changefreq>weekly</changefreq>\n        <priority>0.9</priority>\n    </url>"
    if content_url not in sitemap_content:
        entries_to_add += f"\n    <url>\n        <loc>{content_url}</loc>\n        <lastmod>{today}</lastmod>\n        <changefreq>monthly</changefreq>\n        <priority>0.7</priority>\n    </url>"
        
    if entries_to_add:
        sitemap_content = sitemap_content.replace('</urlset>', f"{entries_to_add}\n</urlset>")
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(sitemap_content)
        print("✅ Added new URLs to sitemap.xml")
    else:
        print("ℹ️ URLs already in sitemap.")
