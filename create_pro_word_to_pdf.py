import os
from datetime import datetime

# 1. Create the Tool Folder and File
tool_dir = 'pro-word-to-pdf'
if not os.path.exists(tool_dir):
    os.makedirs(tool_dir)

tool_file = f"{tool_dir}/index.html"
tool_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pro Word to PDF Converter - 100% Free & Secure</title>
    <meta name="description" content="Convert Microsoft Word (DOCX) files to PDF instantly in your browser. 100% free, secure, and private. No files are uploaded to any server.">
    <link rel="stylesheet" href="../assets/css/style.css">
    <!-- Required Libraries for Client-Side Conversion -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <style>
        .pro-container { max-width: 800px; margin: 4rem auto; padding: 0 1.5rem; text-align: center; }
        .hero-section h1 { font-size: 2.5rem; color: #1e293b; margin-bottom: 1rem; }
        .hero-section p { color: #475569; font-size: 1.1rem; margin-bottom: 2rem; }
        
        .upload-area { border: 3px dashed #3b82f6; border-radius: 12px; padding: 4rem 2rem; background: #f8fafc; cursor: pointer; transition: all 0.3s ease; position: relative; }
        .upload-area:hover { background: #eff6ff; border-color: #2563eb; }
        .upload-icon { font-size: 4rem; margin-bottom: 1rem; }
        .upload-text { font-size: 1.2rem; color: #334155; font-weight: 500; }
        .upload-subtext { color: #64748b; font-size: 0.9rem; margin-top: 0.5rem; }
        
        input[type="file"] { position: absolute; width: 100%; height: 100%; top: 0; left: 0; opacity: 0; cursor: pointer; }
        
        .file-info { margin-top: 2rem; display: none; background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .file-name { font-size: 1.1rem; color: #0f172a; font-weight: 600; margin-bottom: 1rem; }
        
        .btn-action { background: #10b981; color: white; border: none; padding: 12px 28px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1.1rem; transition: background 0.3s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-action:hover { background: #059669; }
        .btn-action:disabled { background: #94a3b8; cursor: not-allowed; }
        
        .status-message { margin-top: 1rem; font-weight: 500; color: #2563eb; }
        
        /* Hidden div to render HTML before PDF generation */
        #render-container { display: none; }
        
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 4rem; text-align: left; }
        .feature-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .feature-card h3 { font-size: 1.1rem; color: #1e293b; margin-bottom: 0.5rem; }
        .feature-card p { font-size: 0.95rem; color: #64748b; }
    </style>
</head>
<body>
    <div id="site-header"></div>
    <main class="pro-container">
        <div class="hero-section">
            <h1>Pro Word to PDF Converter</h1>
            <p>Convert your DOCX files to PDF directly in your browser. 100% Secure & Private.</p>
        </div>

        <div class="upload-area" id="dropZone">
            <div class="upload-icon">📄</div>
            <div class="upload-text">Drag & Drop your Word file here</div>
            <div class="upload-subtext">or click to browse (Only .docx files)</div>
            <input type="file" id="fileInput" accept=".docx">
        </div>

        <div class="file-info" id="fileInfo">
            <div class="file-name" id="fileName">No file selected</div>
            <button class="btn-action" id="convertBtn">Convert to PDF</button>
            <div class="status-message" id="statusMessage"></div>
        </div>
        
        <div id="render-container"></div>

        <div class="features-grid">
            <div class="feature-card">
                <h3>🔒 100% Private</h3>
                <p>Your files are converted in your device. We never upload them to any server.</p>
            </div>
            <div class="feature-card">
                <h3>⚡ Lightning Fast</h3>
                <p>No waiting in queues. Conversion happens instantly using your device's power.</p>
            </div>
            <div class="feature-card">
                <h3>🆓 Completely Free</h3>
                <p>No hidden limits, no sign-ups, and no watermarks on your documents.</p>
            </div>
        </div>
    </main>
    <div id="site-footer"></div>
    
    <script src="../assets/js/common.js"></script>
    <script>
        const fileInput = document.getElementById('fileInput');
        const fileInfo = document.getElementById('fileInfo');
        const fileNameDisplay = document.getElementById('fileName');
        const convertBtn = document.getElementById('convertBtn');
        const statusMessage = document.getElementById('statusMessage');
        const renderContainer = document.getElementById('render-container');

        let currentFile = null;

        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                currentFile = e.target.files[0];
                if (currentFile.name.toLowerCase().endsWith('.docx')) {
                    fileNameDisplay.textContent = currentFile.name;
                    fileInfo.style.display = 'block';
                    statusMessage.textContent = '';
                    convertBtn.disabled = false;
                } else {
                    alert('Please select a valid .docx file.');
                    fileInput.value = '';
                    fileInfo.style.display = 'none';
                }
            }
        });

        convertBtn.addEventListener('click', function() {
            if (!currentFile) return;
            
            convertBtn.disabled = true;
            statusMessage.textContent = '⏳ Reading Word Document...';
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const arrayBuffer = event.target.result;
                
                mammoth.convertToHtml({arrayBuffer: arrayBuffer})
                    .then(function(result) {
                        statusMessage.textContent = '⏳ Generating PDF... Please wait.';
                        const htmlContent = result.value;
                        
                        // Prepare content for PDF
                        renderContainer.innerHTML = '<div style="padding: 20px; font-family: Arial, sans-serif; line-height: 1.6;">' + htmlContent + '</div>';
                        
                        const opt = {
                            margin:       10,
                            filename:     currentFile.name.replace('.docx', '.pdf'),
                            image:        { type: 'jpeg', quality: 0.98 },
                            html2canvas:  { scale: 2 },
                            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                        };
                        
                        html2pdf().set(opt).from(renderContainer).save().then(() => {
                            statusMessage.textContent = '✅ Conversion Complete! Your PDF is downloading.';
                            convertBtn.disabled = false;
                            // Clean up
                            setTimeout(() => { renderContainer.innerHTML = ''; }, 2000);
                        }).catch(err => {
                            console.error(err);
                            statusMessage.textContent = '❌ Error generating PDF.';
                            convertBtn.disabled = false;
                        });
                        
                    })
                    .catch(function(err) {
                        console.error(err);
                        statusMessage.textContent = '❌ Error reading the DOCX file. Make sure it is a valid Word document.';
                        convertBtn.disabled = false;
                    });
            };
            
            reader.readAsArrayBuffer(currentFile);
        });
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

content_file = f"{content_dir}/pro-word-to-pdf-guide.html"
content_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Securely Convert Word to PDF: The Ultimate Guide - niDar Tools</title>
    <meta name="description" content="Learn how to convert Word documents to PDF securely without uploading them to remote servers. Client-side processing explained.">
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .article-container { max-width: 800px; margin: 4rem auto; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        h1 { color: #1e3a8a; font-size: 2.5rem; margin-bottom: 1.5rem; }
        h2 { color: #2563eb; font-size: 1.8rem; margin-top: 2rem; margin-bottom: 1rem; }
        p { color: #475569; line-height: 1.8; font-size: 1.1rem; margin-bottom: 1.5rem; }
        ul { margin-bottom: 1.5rem; color: #475569; line-height: 1.8; }
        .try-tool-btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 1rem; }
    </style>
</head>
<body>
    <div id="site-header"></div>
    <main class="article-container">
        <h1>How to Securely Convert Word Documents to PDF</h1>
        <p>In the digital age, the Portable Document Format (PDF) is the universal standard for sharing documents. It preserves formatting across different devices and prevents unauthorized editing. However, when converting sensitive business contracts or personal documents from Microsoft Word (DOCX) to PDF, privacy is a major concern.</p>
        
        <h2>The Privacy Problem with Online Converters</h2>
        <p>Most free online converters require you to upload your files to their cloud servers. This means your private data is stored remotely, often on servers with unknown security protocols. For sensitive information like financial reports or legal documents, this is a massive security risk.</p>
        
        <h2>The Client-Side Solution</h2>
        <p>Our Pro Word to PDF tool is built differently. We utilize advanced client-side processing (using JavaScript within your browser). Here is why this matters:</p>
        <ul>
            <li><strong>Zero Uploads:</strong> Your document never leaves your phone or computer.</li>
            <li><strong>Instant Processing:</strong> Without the need to upload and download large files from a server, the conversion is significantly faster.</li>
            <li><strong>100% Privacy Guarantee:</strong> Since we never receive your files, there is zero risk of data breaches or leaks on our end.</li>
        </ul>

        <h2>Best Practices for Conversion</h2>
        <p>While our tool handles standard text, headings, and lists perfectly, remember that highly complex Word layouts (like overlapping shapes or 3D WordArt) are best exported directly from Microsoft Office. For standard essays, reports, and contracts, our browser-based tool is the safest and fastest option available online.</p>
        
        <a href="/pro-word-to-pdf/" class="try-tool-btn">Convert Word to PDF Securely ↗</a>
    </main>
    <div id="site-footer"></div>
    <script src="../assets/js/common.js"></script>
</body>
</html>
"""

with open(content_file, 'w', encoding='utf-8') as f:
    f.write(content_html)
print(f"✅ Created Content Guide page: {content_file}")

# 3. Update Sitemap
sitemap_path = 'sitemap.xml'
today = datetime.today().strftime('%Y-%m-%d')
tool_url = 'https://nidartools.com/pro-word-to-pdf/'
content_url = 'https://nidartools.com/content/pro-word-to-pdf-guide/'

if os.path.exists(sitemap_path):
    with open(sitemap_path, 'r', encoding='utf-8') as f:
        sitemap_content = f.read()
        
    entries_to_add = ""
    if tool_url not in sitemap_content:
        entries_to_add += f"\n    <url>\n        <loc>{tool_url}</loc>\n        <lastmod>{today}</lastmod>\n        <changefreq>monthly</changefreq>\n        <priority>0.9</priority>\n    </url>"
    if content_url not in sitemap_content:
        entries_to_add += f"\n    <url>\n        <loc>{content_url}</loc>\n        <lastmod>{today}</lastmod>\n        <changefreq>monthly</changefreq>\n        <priority>0.7</priority>\n    </url>"
        
    if entries_to_add:
        sitemap_content = sitemap_content.replace('</urlset>', f"{entries_to_add}\n</urlset>")
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(sitemap_content)
        print("✅ Added new URLs to sitemap.xml")
    else:
        print("ℹ️ URLs already in sitemap.")
