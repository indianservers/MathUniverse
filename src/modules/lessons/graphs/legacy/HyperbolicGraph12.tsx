/** Retained original renderer until all lesson 12 graph checks pass. */
const fmt = (value: number) => Number(value.toFixed(3)).toString();
const graphY = (value: number) => 300 - 225 * (1 - Math.exp(-value / 3));
export function LegacyHyperbolicGraph12({x}: {x:number}) {
 const positive=Math.exp(x),negative=Math.exp(-x);
 const curves=Array.from({length:81},(_,i)=>{const sample=-2.5+i/16;return {px:15+i*7.1,positive:graphY(Math.exp(sample)),negative:graphY(Math.exp(-sample))};});
 const px=15+(x+2.5)*113.6,pyPositive=graphY(positive),pyNegative=graphY(negative);
 return (              <svg
                viewBox="0 0 600 360"
                aria-label="Hyperbolic exponential graph"
              >
                <line x1="15" y1="300" x2="585" y2="300" />
                <line x1="160" y1="340" x2="160" y2="15" />
                {[70, 145, 220].map((lineY) => (
                  <line
                    className="graph-grid"
                    x1="15"
                    y1={lineY}
                    x2="585"
                    y2={lineY}
                    key={lineY}
                  />
                ))}
                <line
                  className="guide"
                  x1={px}
                  y1="300"
                  x2={px}
                  y2={pyPositive}
                />
                <line
                  className="difference"
                  x1={px}
                  y1={pyPositive}
                  x2={px}
                  y2={pyNegative}
                />
                <text
                  className="difference-label"
                  x={px - 7}
                  y={(pyPositive + pyNegative) / 2}
                >
                  ↕
                </text>
                <polyline
                  className="positive"
                  points={curves.map((p) => `${p.px},${p.positive}`).join(" ")}
                />
                <polyline
                  className="negative"
                  points={curves.map((p) => `${p.px},${p.negative}`).join(" ")}
                />
                <circle
                  className="positive-dot"
                  cx={px}
                  cy={pyPositive}
                  r="7"
                />
                <circle
                  className="negative-dot"
                  cx={px}
                  cy={pyNegative}
                  r="7"
                />
                <text x="535" y="55">
                  y = eˣ
                </text>
                <text className="violet" x="540" y="260">
                  y = e⁻ˣ
                </text>
                <text x={px + 12} y={pyPositive + 15}>
                  eˣ ≈ {fmt(positive)}
                </text>
                <text className="violet" x={px + 12} y={pyNegative - 8}>
                  e⁻ˣ ≈ {fmt(negative)}
                </text>
                <text x="580" y="315">
                  x
                </text>
                <text x="150" y="14">
                  y
                </text>
                <text className="axis-label" x="58" y="318">
                  −2
                </text>
                <text className="axis-label" x="148" y="318">
                  0
                </text>
                <text className="axis-label" x="260" y="318">
                  1
                </text>
                <text className="axis-label" x="374" y="318">
                  2
                </text>
                <text className="axis-label" x="488" y="318">
                  3
                </text>
                <text className="axis-label" x="145" y="225">
                  1
                </text>
                <text className="axis-label" x="145" y="150">
                  2
                </text>
                <text className="axis-label" x="145" y="75">
                  3
                </text>
              </svg>);
}
