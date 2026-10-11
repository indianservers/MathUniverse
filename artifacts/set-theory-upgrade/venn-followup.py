from pathlib import Path
p=Path('src/modules/set-theory/premium/VennCanvas.tsx');s=p.read_text()
needle='  const history = useRef<Snapshot[]>([]),'
s=s.replace(needle,'''  useEffect(()=>{if(selectionActive&&inspected!==null)setRegion(membership(store,inspected));},[selectionActive,inspected,store.setA,store.setB,store.setC]);
'''+needle)
s=s.replace('setRegion: selectRegion,','setRegion: (mask)=>{setInspected(null);selectRegion(mask);},')
s=s.replace('    setBeginner(false);\n    setCircles(defaultCircles);','    setBeginner(false);\n    setSelectionActive(false);\n    setInspected(null);\n    setCircles(defaultCircles);')
p.write_text(s)
