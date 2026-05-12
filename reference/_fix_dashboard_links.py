import re
from pathlib import Path

p = Path(__file__).resolve().parent / "dashboard" / "_dashboard-body.html"
t = p.read_text(encoding="utf-8")
subs = [
    (
        r'onclick="\s*showPage\(\'keuangan\',[\s\S]*?\[3\]\)\s*"',
        'onclick="location.href=\'../keuangan/index.html\'"',
    ),
    (
        r'onclick="\s*showPage\(\'stok\',[\s\S]*?\[4\]\)\s*"',
        'onclick="location.href=\'../stock/index.html\'"',
    ),
    (
        r'onclick="\s*showPage\(\'checklist\',[\s\S]*?\[5\]\)\s*"',
        'onclick="location.href=\'../panduan/index.html\'"',
    ),
    (
        r'onclick="\s*showPage\(\'iklan\',[\s\S]*?\[1\]\)\s*"',
        'onclick="location.href=\'../iklan/index.html\'"',
    ),
    (
        r'onclick="showPage\(\'stok\',[^\)]+\)"',
        'onclick="location.href=\'../stock/index.html\'"',
    ),
    (
        r'onclick="\s*showPage\(\'keuangan\',[^\)]+\)\s*"',
        'onclick="location.href=\'../keuangan/index.html\'"',
    ),
]
for pat, sub in subs:
    t = re.sub(pat, sub, t)
p.write_text(t, encoding="utf-8")
print("fixed")
