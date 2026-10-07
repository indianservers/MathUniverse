import { useId } from 'react';

/** A small vector companion: all artwork and animation are bundled offline. */
export default function MathRobot({ thinking = false, awake = false }: { thinking?: boolean; awake?: boolean }) {
  const id = useId().replace(/:/g, '');
  return <svg className={`math-robo ${thinking ? 'is-thinking' : ''} ${awake ? 'is-awake' : ''}`} viewBox="0 0 140 160" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-shell`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".45" stopColor="#e9f0f3"/><stop offset=".8" stopColor="#a2b4bf"/><stop offset="1" stopColor="#f8fafc"/></linearGradient>
      <linearGradient id={`${id}-visor`} x2="0" y2="1"><stop stopColor="#182932"/><stop offset="1" stopColor="#030b12"/></linearGradient>
      <radialGradient id={`${id}-light`}><stop stopColor="#67e8f9" stopOpacity=".5"/><stop offset="1" stopColor="#22d3ee" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse cx="70" cy="149" rx="42" ry="8" fill={`url(#${id}-light)`}/>
    <g className="robo-body">
      <g stroke="#526672" strokeWidth="1.5">
        <path d="M49 116l-4 18q0 9 17 8l6-24M77 117l3 19q1 8 17 6l-6-26" fill={`url(#${id}-shell)`}/>
        <path d="M43 136q-9 7-7 11h29v-7M81 139v8h28q0-10-17-11" fill={`url(#${id}-shell)`}/>
        <rect x="44" y="79" width="54" height="43" rx="20" fill={`url(#${id}-shell)`}/>
        <path d="M47 104q25 14 48 0" fill="none"/>
        <rect x="61" y="113" width="20" height="6" rx="3" fill="#172b35"/>
        <g className="robo-arm"><circle cx="100" cy="86" r="7" fill="#172b35"/><path d="M102 85q14 2 13 18l-8 5-9-16" fill={`url(#${id}-shell)`}/><path d="M110 105l9-9 8 4-7 12-11-1" fill={`url(#${id}-shell)`}/><path d="M123 102l9-5m-9 8 11-1m-13 4 10 2" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round"/></g>
        <circle cx="41" cy="87" r="7" fill="#172b35"/><path d="M35 88q-9 10-8 25l9 3 11-25" fill={`url(#${id}-shell)`}/><rect x="26" y="112" width="12" height="13" rx="5" fill="#213844"/>
      </g>
      <circle cx="72" cy="97" r="7" fill="#102a36"/><path d="M67 97h10m-5-5v10" stroke="#67e8f9" strokeWidth="2"/>
      <g className="robo-head">
        <rect x="58" y="69" width="27" height="13" rx="6" fill="#10232d"/>
        <ellipse cx="72" cy="43" rx="48" ry="36" fill={`url(#${id}-shell)`} stroke="#5c707c" strokeWidth="1.5"/>
        <ellipse cx="72" cy="13" rx="29" ry="7" fill="#5b6f79" opacity=".8"/>
        <ellipse cx="25" cy="45" rx="6" ry="15" fill="#112b38" stroke="#22d3ee" strokeWidth="2"/>
        <rect x="35" y="29" width="77" height="35" rx="17" fill={`url(#${id}-visor)`} stroke="#22d3ee" strokeWidth="2"/>
        <path d="M46 47q9-18 19 0M80 47q9-18 19 0" className="robo-eyes" fill="none" stroke="#67e8f9" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M66 54q8 6 16 0" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M44 32h24l-9 8H40" fill="#fff" opacity=".13"/>
      </g>
    </g>
  </svg>;
}
