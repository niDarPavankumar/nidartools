import os

wm_path = 'image-watermark/index.html'
schema_code = """
  <!-- SEO Schema Markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Pro Image Watermark",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Add custom text watermarks to your photos instantly in your browser. 100% private, free, and secure."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is the Pro Image Watermark tool free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our tool is available completely free of cost for everyone. No hidden charges."
            }
          },
          {
            "@type": "Question",
            "name": "Are my photos uploaded to a server?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, our tool runs entirely in your browser using Client-Side processing. Your photos are never uploaded to any server, ensuring absolute privacy."
            }
          }
        ]
      }
    ]
  }
  </script>
"""

if os.path.exists(wm_path):
    with open(wm_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    if 'application/ld+json' not in html:
        html = html.replace('</head>', schema_code + '</head>')
        with open(wm_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print("✅ Successfully added Schema Markup (SEO) to Pro Image Watermark!")
    else:
        print("⚠️ Schema Markup already exists.")
else:
    print("❌ File not found.")
