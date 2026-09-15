from pathlib import Path
import fitz
source = Path(r'C:\Users\Ghanchi\Downloads\screencapture-kora-framer-media-2026-09-07-16_26_06.pdf')
out = Path(__file__).resolve().parent.parent / 'reference'
out.mkdir(exist_ok=True)
doc = fitz.open(source)
print('Pages:', len(doc))
for i, page in enumerate(doc):
    print(i, page.rect)
    scale = min(1.5, 1440 / page.rect.width)
    height = 1600 / scale
    for part, y in enumerate(range(0, int(page.rect.height), int(height))):
        clip = fitz.Rect(0, y, page.rect.width, min(y + height, page.rect.height))
        page.get_pixmap(matrix=fitz.Matrix(scale, scale), clip=clip).save(out / f'pdf-{i}-{part}.png')
