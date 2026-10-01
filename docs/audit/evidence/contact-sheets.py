from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent
for suffix in ('top', 'mid'):
    files = sorted((root / 'screenshots').glob(f'readable-*-{suffix}.png'))
    sheet = Image.new('RGB', (1800, ((len(files) + 3) // 4) * 320), '#e5e5e5')
    draw = ImageDraw.Draw(sheet)
    for i, file in enumerate(files):
        image = Image.open(file).convert('RGB')
        image.thumbnail((440, 275))
        x, y = (i % 4) * 450, (i // 4) * 320
        draw.text((x + 5, y + 4), file.stem.removeprefix('readable-')[:60], fill='#111111')
        sheet.paste(image, (x + 5, y + 30))
    sheet.save(root / f'routes-{suffix}-sheet.png')
    print(f'{suffix}: {len(files)} rendered route screenshots')
