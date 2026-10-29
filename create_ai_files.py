import os

# 1. Create llms.txt with H1 header and links
llms_content = """# niDar Tools

Welcome to the niDar Tools AI overview. We provide a suite of free online utilities for everyday tasks.

## Available Tools
- [Pro Image Watermark](https://nidartools.com/image-watermark/)
- [User Guide](https://nidartools.com/user-guide/)
- [NamoCrux](https://nidartools.com/namocrux/)
"""
with open('llms.txt', 'w', encoding='utf-8') as f:
    f.write(llms_content)

# 2. Create ai-catalog.json with valid JSON schema
ai_catalog_content = """{
  "schema_version": "1.0",
  "name": "niDar Tools",
  "description": "Free online tools for image processing, PDF manipulation, calculators, and developer utilities.",
  "contact": {
    "email": "support@nidartools.com"
  },
  "resources": [
    {
      "name": "Pro Image Watermark",
      "url": "https://nidartools.com/image-watermark/",
      "type": "web"
    },
    {
      "name": "NamoCrux",
      "url": "https://nidartools.com/namocrux/",
      "type": "web"
    }
  ]
}"""
with open('ai-catalog.json', 'w', encoding='utf-8') as f:
    f.write(ai_catalog_content)

print("✅ Successfully created llms.txt and ai-catalog.json in the correct format!")
