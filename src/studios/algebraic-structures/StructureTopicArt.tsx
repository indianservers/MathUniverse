import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import './structureTopicArt.css';

export default function StructureTopicArt({ topic, index }: { topic: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false));
    observer.observe(node); return () => observer.disconnect();
  }, []);
  const tilt = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === 'touch' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--structure-rx', `${(0.5 - (event.clientY - rect.top) / rect.height) * 14}deg`);
    event.currentTarget.style.setProperty('--structure-ry', `${((event.clientX - rect.left) / rect.width - 0.5) * 18}deg`);
  };
  const reset = () => { ref.current?.style.setProperty('--structure-rx', '0deg'); ref.current?.style.setProperty('--structure-ry', '0deg'); };
  return <span ref={ref} className={`structure-topic-art ${visible ? 'is-visible' : ''}`} style={{ '--structure-delay': `${index * -.6}s` } as CSSProperties} aria-hidden="true" onPointerMove={tilt} onPointerLeave={reset} onPointerCancel={reset}>
    <span className="structure-art-glow" /><span className="structure-art-tilt"><img src={`/assets/algebraic-structures/topic-icons/${topic}.png`} width="250" height="250" alt="" loading="lazy" decoding="async" draggable={false} /></span><span className="structure-art-sparkle" />
  </span>;
}
