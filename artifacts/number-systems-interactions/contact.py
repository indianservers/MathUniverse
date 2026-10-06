from PIL import Image, ImageDraw
from pathlib import Path
root = Path(__file__).parent
files = sorted(root.glob('*-full-experiment.png'))
for start in range(0, len(files), 4):
    sheet = Image.new('RGB', (1600, 1440), '#edf3fb')
    pen = ImageDraw.Draw(sheet)
    for index, file in enumerate(files[start:start+4]):
        picture = Image.open(file).convert('RGB')
        picture.thumbnail((780, 680))
        col, row = index % 2, index // 2
        pen.text((col*800+12, row*720+7), file.stem, fill='#1c335b')
        sheet.paste(picture, (col*800+10, row*720+30))
    sheet.save(root / f'review-{start//4+1}.jpg')
