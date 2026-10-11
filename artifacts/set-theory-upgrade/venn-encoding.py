from pathlib import Path
p=Path('src/modules/set-theory/premium/VennCanvas.tsx');s=p.read_text(encoding='utf-8').replace('\ufffd',' / ');p.write_text(s,encoding='utf-8')
p=Path('src/modules/set-theory/premium/Venn.tsx');s=p.read_text(encoding='utf-8').replace('\ufffd','"');p.write_text(s,encoding='utf-8')
