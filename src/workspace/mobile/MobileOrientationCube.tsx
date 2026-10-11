export default function MobileOrientationCube({ onOrient }: { onOrient?: () => void }) {
  return <nav className="mws-orientation-cube" aria-label="3D orientation cube">
    {['Top', 'Front', 'Right', 'Left', 'Back', 'Bottom'].map(face => <button key={face} type="button" className={`mws-cube-${face.toLowerCase()}`} aria-label={`View ${face.toLowerCase()} face`} onClick={() => { onOrient?.(); window.dispatchEvent(new CustomEvent('mws-orient-solid', { detail: face })); }}>{face}</button>)}
  </nav>;
}
