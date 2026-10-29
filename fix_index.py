import os

file_path = 'index.html'
if os.path.exists(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Fix Pro Image Watermark classes
    old_watermark = """<a href="/image-watermark/" class="tool-card" data-category="image">
                <div class="tool-icon">©️</div>
                <div class="tool-info">
                    <h3>Pro Image Watermark <span class="badge badge-new" style="background:#dc2626;">NEW</span></h3>
                    <p>Protect your photos instantly by adding custom text watermarks securely.</p>
                </div>
                <div class="tool-arrow">↗</div>
            </a>"""
            
    new_watermark = """<a href="/image-watermark/" class="nidar-tool-card" data-category="image" style="position: relative;">
                    <div style="position: absolute; top: 10px; right: 10px; background: #dc2626; color: white; font-size: 0.7rem; padding: 3px 8px; border-radius: 12px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">NEW</div>
                    <div class="nidar-tool-icon">©️</div>
                    <div class="nidar-tool-card-content"><h3>Pro Image Watermark</h3><p>Protect your photos instantly by adding custom text watermarks securely.</p></div>
                    <span class="nidar-tool-arrow">↗</span>
                </a>"""
    
    html = html.replace(old_watermark, new_watermark)

    # 2. Move FIRE Calculator to the top and add NEW badge
    old_fire = """<a href="/compound-interest-calculator/" class="nidar-tool-card" data-category="calculator">
                    <div class="nidar-tool-icon">📈</div>
                    <div class="nidar-tool-card-content"><h3>Compound Interest & FIRE</h3><p>Calculate investment growth and plan your early financial independence.</p></div>
                    <span class="nidar-tool-arrow">↗</span>
                </a>"""
                
    new_fire = """<a href="/compound-interest-calculator/" class="nidar-tool-card" data-category="calculator" style="position: relative;">
                    <div style="position: absolute; top: 10px; right: 10px; background: #dc2626; color: white; font-size: 0.7rem; padding: 3px 8px; border-radius: 12px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">NEW</div>
                    <div class="nidar-tool-icon">📈</div>
                    <div class="nidar-tool-card-content"><h3>Compound Interest & FIRE</h3><p>Calculate investment growth and plan your early financial independence.</p></div>
                    <span class="nidar-tool-arrow">↗</span>
                </a>"""

    # Remove old FIRE card from its current position
    html = html.replace(old_fire, "")
    
    # Insert new FIRE card right after the <div class="nidar-tools-grid">
    insert_point = '<div class="nidar-tools-grid">'
    html = html.replace(insert_point, f"{insert_point}\n\n                {new_fire}")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("✅ Successfully fixed UI classes and moved FIRE Calculator to the top!")
else:
    print("❌ index.html not found.")
