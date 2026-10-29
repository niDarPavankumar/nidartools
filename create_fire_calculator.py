import os

# 1. Create Tool Page
tool_dir = 'compound-interest-calculator'
if not os.path.exists(tool_dir):
    os.makedirs(tool_dir)

tool_file = f"{tool_dir}/index.html"
tool_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compound Interest & FIRE Calculator - Plan Early Retirement</title>
    <meta name="description" content="Free SIP and Compound Interest calculator. Find your FIRE (Financial Independence, Retire Early) target number instantly.">
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .pro-container { max-width: 800px; margin: 3rem auto; padding: 0 1rem; }
        .hero-section { text-align: center; margin-bottom: 2rem; }
        .hero-section h1 { font-size: 2.2rem; color: #1e293b; margin-bottom: 0.5rem; }
        .hero-section p { color: #475569; font-size: 1.1rem; }
        .calculator-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 2rem; }
        .input-group { margin-bottom: 1.2rem; }
        .input-group label { display: block; font-weight: 600; color: #334155; margin-bottom: 0.5rem; }
        .input-group input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; }
        .btn-calculate { width: 100%; background: #10b981; color: white; border: none; padding: 14px; font-size: 1.1rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        .btn-calculate:hover { background: #059669; }
        .results-section { display: none; background: #f8fafc; padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem; border-left: 5px solid #3b82f6; }
        .result-item { margin-bottom: 1rem; font-size: 1.1rem; }
        .result-item span { font-weight: bold; font-size: 1.2rem; color: #0f172a; float: right; }
        .fire-target { background: #fee2e2; border-left: 5px solid #ef4444; padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem; }
        .fire-target h3 { margin-top: 0; color: #991b1b; }
        .fire-target h2 { color: #991b1b; font-size: 2rem; margin: 0.5rem 0 0 0; }
    </style>
</head>
<body>
    <div id="site-header"></div>
    <main class="pro-container">
        <div class="hero-section">
            <h1>Compound Interest & FIRE Calculator</h1>
            <p>Track your wealth growth and calculate your early retirement target.</p>
        </div>

        <div class="calculator-card">
            <div class="input-group">
                <label>Initial Investment (₹)</label>
                <input type="number" id="principal" value="100000">
            </div>
            <div class="input-group">
                <label>Monthly Investment / SIP (₹)</label>
                <input type="number" id="monthly" value="10000">
            </div>
            <div class="input-group">
                <label>Expected Annual Return (%)</label>
                <input type="number" id="rate" value="12">
            </div>
            <div class="input-group">
                <label>Time Period (Years)</label>
                <input type="number" id="years" value="15">
            </div>
            <div class="input-group">
                <label>Monthly Expenses for Retirement (₹)</label>
                <input type="number" id="expenses" value="50000" placeholder="Used to calculate FIRE Target">
            </div>
            <button class="btn-calculate" onclick="calculateFIRE()">Calculate Wealth & FIRE Target</button>
            
            <div id="results" class="results-section">
                <div class="result-item">Total Invested Amount: <span id="resInvested">₹ 0</span></div>
                <div class="result-item">Estimated Wealth Gains: <span id="resGains">₹ 0</span></div>
                <div class="result-item" style="border-top: 1px solid #cbd5e1; padding-top: 1rem; margin-top: 1rem;">
                    Total Corpus Value: <span id="resTotal" style="color: #10b981; font-size: 1.5rem;">₹ 0</span>
                </div>
            </div>

            <div id="fireResults" class="fire-target" style="display: none;">
                <h3>🔥 Your FIRE Target (4% Rule)</h3>
                <p>To safely retire with ₹<span id="fireExp"></span> monthly expenses, your target corpus should be:</p>
                <h2 id="fireNumber">₹ 0</h2>
            </div>
        </div>
    </main>
    <div id="site-footer"></div>
    <script src="../assets/js/common.js"></script>
    <script>
        function formatCurrency(num) {
            return "₹ " + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
        }

        function calculateFIRE() {
            const P = parseFloat(document.getElementById('principal').value) || 0;
            const PMT = parseFloat(document.getElementById('monthly').value) || 0;
            const r = parseFloat(document.getElementById('rate').value) || 0;
            const t = parseFloat(document.getElementById('years').value) || 0;
            const exp = parseFloat(document.getElementById('expenses').value) || 0;

            const i = r / 100 / 12; 
            const n = t * 12; 
            
            let futureValueP = P * Math.pow(1 + (r/100), t); 
            let futureValueSIP = PMT * ((Math.pow(1 + i, n) - 1) / i) * (1 + i); 
            
            const totalCorpus = futureValueP + futureValueSIP;
            const totalInvested = P + (PMT * n);
            const totalGains = totalCorpus - totalInvested;

            document.getElementById('resInvested').innerText = formatCurrency(totalInvested);
            document.getElementById('resGains').innerText = formatCurrency(totalGains);
            document.getElementById('resTotal').innerText = formatCurrency(totalCorpus);
            document.getElementById('results').style.display = 'block';

            if (exp > 0) {
                const fireTarget = exp * 12 * 25;
                document.getElementById('fireExp').innerText = exp.toLocaleString('en-IN');
                document.getElementById('fireNumber').innerText = formatCurrency(fireTarget);
                document.getElementById('fireResults').style.display = 'block';
            } else {
                document.getElementById('fireResults').style.display = 'none';
            }
        }
    </script>
</body>
</html>
"""
with open(tool_file, 'w', encoding='utf-8') as f:
    f.write(tool_html)
print(f"✅ Created Tool page: {tool_file}")

# 2. Create SEO Guide
content_dir = 'content'
if not os.path.exists(content_dir):
    os.makedirs(content_dir)

content_file = f"{content_dir}/compound-interest-calculator-guide.html"
content_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compound Interest & FIRE Planning Guide - niDar Tools</title>
    <meta name="description" content="Understand the power of compound interest in SIPs and learn how to calculate your FIRE number using the 4% rule.">
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .article-container { max-width: 800px; margin: 4rem auto; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        h1 { color: #1e3a8a; font-size: 2.2rem; }
        h2 { color: #2563eb; font-size: 1.6rem; margin-top: 2rem; }
        p, ul { color: #475569; line-height: 1.8; font-size: 1.1rem; }
        .try-btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 1rem; }
    </style>
</head>
<body>
    <div id="site-header"></div>
    <main class="article-container">
        <h1>Mastering Compound Interest & FIRE Target</h1>
        <p>Compound interest accelerates your wealth growth because you earn returns not just on your initial investment, but also on the accumulated interest from previous periods.</p>
        
        <h2>What is the FIRE Movement?</h2>
        <p>FIRE stands for <strong>Financial Independence, Retire Early</strong>. The goal is to build a sufficient investment corpus so you can live off the returns without needing a traditional job. This is typically calculated using the <strong>4% Rule</strong>.</p>
        
        <h2>How to Calculate Your FIRE Number</h2>
        <ul>
            <li><strong>Step 1:</strong> Determine your expected monthly expenses in retirement.</li>
            <li><strong>Step 2:</strong> Multiply by 12 to find your annual expenses.</li>
            <li><strong>Step 3:</strong> Multiply the annual expenses by 25. This final number is your target FIRE corpus.</li>
        </ul>

        <a href="/compound-interest-calculator/" class="try-btn">Use the FIRE Calculator ↗</a>
    </main>
    <div id="site-footer"></div>
    <script src="../assets/js/common.js"></script>
</body>
</html>
"""
with open(content_file, 'w', encoding='utf-8') as f:
    f.write(content_html)
print(f"✅ Created Guide page: {content_file}")
