import os

sitemap_file = 'sitemap.xml'
if os.path.exists(sitemap_file):
    with open(sitemap_file, 'r', encoding='utf-8') as f:
        sitemap_data = f.read()

    if "compound-interest-calculator-guide" not in sitemap_data:
        new_urls = """
    <url>
        <loc>https://nidartools.com/content/compound-interest-calculator-guide/</loc>
        <lastmod>2026-10-24</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>"""
        sitemap_data = sitemap_data.replace('</urlset>', new_urls)
        with open(sitemap_file, 'w', encoding='utf-8') as f:
            f.write(sitemap_data)
        print("✅ Sitemap successfully updated with FIRE Calculator Guide!")
    else:
        print("⚡ Sitemap already contains this URL.")
else:
    print("❌ sitemap.xml not found in the current directory.")
