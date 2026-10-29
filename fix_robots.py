import os

robots_content = """User-agent: *
Allow: /

# Block internal content folders, APIs, and broken paths from being crawled
Disallow: /content/
Disallow: /*/content/
Disallow: /api/
Disallow: /100
Disallow: /privacy$  # Blocks the unclean URL without trailing slash

Sitemap: https://nidartools.com/sitemap.xml
"""

with open('robots.txt', 'w', encoding='utf-8') as f:
    f.write(robots_content)

print("✅ Successfully updated robots.txt to block bad URLs!")
