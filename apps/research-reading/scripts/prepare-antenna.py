"""Extract the supplied paper without changing the source PDF."""
import json
from pathlib import Path
import shutil
import pdfplumber
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[1]
source = root.parent / '文件1-论文PDF.pdf'
out = root / 'public' / 'antenna'
out.mkdir(exist_ok=True)
shutil.copyfile(source, out / 'paper.pdf')
pdf = pdfium.PdfDocument(str(source))
with pdfplumber.open(source) as document:
    pages = []
    for i, page in enumerate(document.pages):
        pdf[i].render(scale=1.5).to_pil().save(out / f'page-{i+1}.png')
        words = page.extract_words(x_tolerance=2, y_tolerance=3)
        # Keep each column continuous so phrase searches do not interleave columns.
        words.sort(key=lambda w: (0 if i == 0 and w['top'] < page.height*.23 else (1 if w['x0'] < page.width*.5 else 2), round(w['top']/3), w['x0']))
        pages.append({'page': i+1, 'width': page.width, 'height': page.height,
                      'words': [{'text': w['text'], 'x': w['x0']/page.width,
                                 'y': w['top']/page.height,
                                 'width': (w['x1']-w['x0'])/page.width,
                                 'height': (w['bottom']-w['top'])/page.height} for w in words]})
    (out / 'index.json').write_text(json.dumps(pages, ensure_ascii=False), encoding='utf-8')
print('Extracted 3 pages and word coordinates.')
from PIL import Image
boxes = [(1,.51,.72,.42,.185),(2,.07,.065,.415,.205),(2,.51,.065,.42,.19),
         (2,.51,.47,.42,.19),(2,.51,.67,.42,.24),(3,.075,.065,.41,.23),
         (3,.075,.48,.41,.17),(3,.075,.67,.41,.22)]
for n,(page,x,y,w,h) in enumerate(boxes,1):
    image = Image.open(out / f'page-{page}.png')
    image.crop((int(x*image.width),int(y*image.height),int((x+w)*image.width),int((y+h)*image.height))).save(out / f'figure-{n}.png')
