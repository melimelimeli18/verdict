#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FOOTER = (ROOT / "_footer.html").read_text(encoding="utf-8")

NAV = [
    ("dashboard", "Dashboard"),
    ("iklan", "Iklan"),
    ("keuangan", "Keuangan"),
    ("stock", "Stok"),
    ("panduan", "Panduan"),
    ("product", "Produk"),
]

PROGRESS = """    <div class="sticky-progress">
      <div class="sp-bar">
        <div class="sp-fill" id="sp-fill" style="width: 0%"></div>
      </div>
      <div class="sp-text" id="sp-text">0 / 0 selesai</div>
    </div>
"""


def nav_html(active_key: str) -> str:
    links = []
    for key, label in NAV:
        href = f"../{key}/index.html"
        cls = "nav-tab active" if key == active_key else "nav-tab"
        links.append(f'          <a class="{cls}" href="{href}">{label}</a>')
    return "\n".join(links)


def page_template(
    *,
    key: str,
    title: str,
    css_name: str,
    js_name: str,
    show_progress: bool,
    main_inner: str,
    wrap_panduan: bool,
) -> str:
    prog = PROGRESS if show_progress else ""
    if wrap_panduan:
        main_block = f'    <main>\n    <div id="page-checklist">\n{main_inner}\n    </div>\n    </main>'
    else:
        main_block = f"    <main>\n{main_inner}\n    </main>"
    return f"""<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
      rel="stylesheet" />
    <link rel="stylesheet" href="../global.css" />
    <link rel="stylesheet" href="{css_name}" />
  </head>
  <body>
    <header>
      <div class="header-inner">
        <a href="../dashboard/index.html" class="logo">Verdict</a>
        <nav class="nav-tabs">
{nav_html(key)}
        </nav>
      </div>
    </header>
{prog}{main_block}
{FOOTER}
    <script src="../global.js"></script>
    <script src="{js_name}"></script>
  </body>
</html>
"""


def main():
    pages = [
        ("dashboard", "Verdict — Dashboard", "dashboard.css", "dashboard.js", False, False),
        ("iklan", "Verdict — Iklan", "iklan.css", "iklan.js", False, False),
        ("keuangan", "Verdict — Keuangan", "keuangan.css", "keuangan.js", False, False),
        ("stock", "Verdict — Stok", "stock.css", "stock.js", False, False),
        ("panduan", "Verdict — Panduan", "panduan.css", "panduan.js", True, True),
        ("product", "Verdict — Produk", "product.css", "product.js", False, False),
    ]
    for key, title, css, js, prog, wrap in pages:
        body_path = ROOT / key / f"_{key}-body.html"
        inner = body_path.read_text(encoding="utf-8").rstrip("\n")
        html = page_template(
            key=key,
            title=title,
            css_name=css,
            js_name=js,
            show_progress=prog,
            main_inner=inner,
            wrap_panduan=wrap,
        )
        (ROOT / key / "index.html").write_text(html + "\n", encoding="utf-8")
        print("wrote", key)


if __name__ == "__main__":
    main()
