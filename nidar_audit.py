#!/usr/bin/env python3
import os, re, sys, subprocess, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

SITE = "https://nidartools.com"
os.chdir(os.path.expanduser("~/nidartools"))
LIVE = "--live" in sys.argv

NON_TOOLS = {"about","ai-career-tools","calculators","contact","developer-tools",
 "faq","image-tools","pdf-tools","privacy-policy","support","terms","text-tools",
 "user-guide","archive","content","functions","assets","backups"}
GUIDE_ALIAS = {"icon-kit-generator":["favicon-generator"],
               "image-converter":["image-format-converter"]}

def has_page(d): return os.path.isfile(os.path.join(d, "index.html"))

tools = sorted(d for d in os.listdir(".") if os.path.isdir(d)
               and d not in NON_TOOLS and not d.startswith(".") and has_page(d))

def guide_names(t): return [t] + GUIDE_ALIAS.get(t, [])

def guide_file(t):
    for n in guide_names(t):
        for c in (f"content/{n}/index.html", f"content/{n}.html",
                  f"content/{n}-guide/index.html", f"content/{n}-guide.html"):
            if os.path.isfile(c): return c
    return None

sm_urls = re.findall(r"<loc>\s*([^<]+?)\s*</loc>", open("sitemap.xml", encoding="utf-8").read())
sm_paths = [u.replace(SITE, "").strip("/") for u in sm_urls]
sm_set = set(sm_paths)
dups = sorted({p for p in sm_paths if sm_paths.count(p) > 1})

def local_for(path):
    if path == "": return "index.html" if os.path.isfile("index.html") else None
    for c in (f"{path}/index.html", f"{path}.html"):
        if os.path.isfile(c): return c
    return None

home = open("index.html", encoding="utf-8").read()
home_links = set(re.findall(r'href="(?:https://nidartools\.com)?/([^"/#?]+)/?"', home))

def guide_in_sitemap(t):
    for n in guide_names(t):
        if f"content/{n}" in sm_set or f"content/{n}-guide" in sm_set: return True
    return False

print(f"\n== TOTAL ==\nTool folders: {len(tools)} | Sitemap URLs: {len(sm_urls)}")
bad = 0
print("\n== TOOLS: समस्या ==")
for t in tools:
    p = []
    if t not in home_links: p.append("होमपेजवर कार्ड नाही")
    if t not in sm_set: p.append("sitemap मध्ये नाही")
    if not guide_file(t): p.append("guide फाइल नाही")
    elif not guide_in_sitemap(t): p.append("guide sitemap मध्ये नाही")
    if p:
        bad += 1; print(f"❌ {t}: " + ", ".join(p))
print("✅ सर्व ठीक" if not bad else f"-> {bad} टूल्समध्ये समस्या")

print("\n== SITEMAP URL, पण लोकल फाइल नाही ==")
miss = [p for p in sm_set if local_for(p) is None]
for p in sorted(miss): print("❌", "/" + p + "/")
if not miss: print("✅ काही नाही")
if dups: print("\n== SITEMAP मध्ये डुप्लिकेट ==\n" + "\n".join("⚠️ /" + d + "/" for d in dups))

print("\n== GUIDE, पण sitemap मध्ये नाही ==")
c_files = set()
for f in os.listdir("content") if os.path.isdir("content") else []:
    c_files.add(f[:-5] if f.endswith(".html") else f)
nm = sorted(n for n in c_files if f"content/{n}" not in sm_set and f"content/{n}/" not in sm_set)
for n in nm: print("⚠️ content/" + n)
if not nm: print("✅ काही नाही")

print("\n== GIT ==")
def sh(c):
    r = subprocess.run(c, shell=True, capture_output=True, text=True); return r.stdout.strip()
st = sh("git status --short | grep -v '\\.bak' | head -20")
print(("⚠️ कमिट न केलेले बदल:\n" + st) if st else "✅ कमिट न केलेले बदल नाहीत")
ahead = sh("git log @{u}..HEAD --oneline 2>/dev/null")
print(("⚠️ GitHub वर पुश न झालेले:\n" + ahead) if ahead else "✅ सर्व पुश झाले आहे")

if LIVE:
    print("\n== LIVE तपासणी (थोडा वेळ लागेल) ==")
    urls = sorted(set(sm_urls) | {f"{SITE}/{t}/" for t in tools} | {SITE + "/"})
    def chk(u):
        try:
            r = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=20)
            code = r.getcode(); body = r.read(30000).decode("utf-8", "ignore")
        except urllib.error.HTTPError as e: return u, e.code, ""
        except Exception as e: return u, str(e)[:40], ""
        m = re.search(r"<title>([^<]*)", body, re.I)
        t = (m.group(1) if m else "").lower()
        if "404" in t or "not found" in t: return u, "SOFT-404", t
        return u, code, t
    with ThreadPoolExecutor(8) as ex: res = list(ex.map(chk, urls))
    errs = [r for r in res if r[1] != 200]
    for u, c, _ in errs: print(f"❌ {c} {u}")
    print(f"✅ {len(res)-len(errs)}/{len(res)} URL ठीक")
else:
    print("\n(लाइव तपासणीसाठी: python3 nidar_audit.py --live)")
