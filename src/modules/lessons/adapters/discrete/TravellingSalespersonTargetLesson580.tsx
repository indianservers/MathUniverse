import { Check, Lightbulb, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./TravellingSalespersonTargetLesson580.css";

type City = { id: string; x: number; y: number };
const cities: City[] = [
  { id: "A", x: 85, y: 145 },
  { id: "B", x: 250, y: 55 },
  { id: "C", x: 455, y: 130 },
  { id: "D", x: 145, y: 325 },
  { id: "E", x: 395, y: 330 },
];
const weights: Record<string, number> = {
  AB: 2,
  AC: 6,
  AD: 1,
  AE: 7,
  BC: 3,
  BD: 4,
  BE: 7,
  CD: 6,
  CE: 4,
  DE: 5,
};
const ids = cities.map((city) => city.id),
  key = (a: string, b: string) => [a, b].sort().join(""),
  dist = (a: string, b: string) => weights[key(a, b)];
function length(route: string[], closed = true) {
  const open = route
    .slice(1)
    .reduce((sum, city, i) => sum + dist(route[i], city), 0);
  return closed && route.length === ids.length
    ? open + dist(route.at(-1)!, route[0])
    : open;
}
function permutations(items: string[]): string[][] {
  if (items.length < 2) return [items];
  return items.flatMap((item) =>
    permutations(items.filter((x) => x !== item)).map((rest) => [
      item,
      ...rest,
    ]),
  );
}
const tours = permutations(ids.slice(1)).map((rest) => ["A", ...rest]),
  optimum = Math.min(...tours.map((tour) => length(tour))),
  optimal = tours.find((tour) => length(tour) === optimum)!,
  nearest = (() => {
    const route = ["A"];
    while (route.length < ids.length) {
      const choices = ids
        .filter((city) => !route.includes(city))
        .sort((a, b) => dist(route.at(-1)!, a) - dist(route.at(-1)!, b));
      route.push(choices[0]);
    }
    return route;
  })();

export default function TravellingSalespersonTargetLesson580({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [points, setPoints] = useState(cities),
    [route, setRoute] = useState(["A", "B", "C", "E", "D"]),
    [closed, setClosed] = useState(true),
    [labels, setLabels] = useState(true),
    [dragging, setDragging] = useState<string | null>(null),
    [tab, setTab] = useState("Interact"),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const total = length(route, closed),
    complete = route.length === ids.length,
    active = route.slice(1).map((city, i) => key(route[i], city));
  if (complete && closed) active.push(key(route.at(-1)!, route[0]));
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    reset = () => {
      setPoints(cities);
      setRoute(["A", "B", "C", "E", "D"]);
      setClosed(true);
      setLabels(true);
      setDragging(null);
      setTab("Interact");
      setAnswer("");
      setGraded(null);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const choose = (city: string) =>
      act(() => {
        if (!route.includes(city) && route.length < ids.length) {
          setRoute((r) => [...r, city]);
          setClosed(false);
        }
      }),
    move = (event: PointerEvent<SVGSVGElement>) => {
      if (!dragging) return;
      const box = event.currentTarget.getBoundingClientRect(),
        x = ((event.clientX - box.left) / box.width) * 540,
        y = ((event.clientY - box.top) / box.height) * 400;
      setPoints((list) =>
        list.map((city) =>
          city.id === dragging
            ? {
                ...city,
                x: Math.max(28, Math.min(512, x)),
                y: Math.max(28, Math.min(372, y)),
              }
            : city,
        ),
      );
      onInteraction();
    },
    parse = (value: string) =>
      value
        .toUpperCase()
        .split(/[^A-E]+/)
        .filter(Boolean),
    routeText = (r: string[]) => [...r, r[0]].join(" -> ");
  return (
    <section
      className="tsp580-page cs378-page"
      data-testid="discrete-mockup-0637"
      data-object-model="dedicated-exhaustive-hamiltonian-weighted-tour-model"
      data-route={route.join(",")}
      data-closed={closed}
      data-complete={complete}
      data-distance={total}
      data-optimum={optimum}
      data-suggestion={nearest.join(",")}
      data-suggestion-distance={length(nearest)}
      data-positions={points
        .map((c) => `${c.id}:${Math.round(c.x)},${Math.round(c.y)}`)
        .join(";")}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="tsp580-hero">
        <div>
          <span>DISCRETE AND APPLIED MATHEMATICS</span>
          <span>COMBINATORICS, GRAPH THEORY AND LOGIC</span>
          <h1>580. Travelling Salesperson</h1>
          <p>
            Find the shortest closed tour that visits each city exactly once and
            returns to the start.
          </p>
        </div>
        <dl>
          <span>
            Level: <b>Intermediate-Advanced</b>
          </span>
          <span>
            Topic: <b>Discrete Optimization</b>
          </span>
          <span>
            Time: <b>15-20 min</b>
          </span>
          <span>
            Mode: <b>Interactive</b>
          </span>
          <span>
            Skills: <b>Graphs, Paths, Optimization</b>
          </span>
        </dl>
      </header>
      <nav className="tsp580-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="tsp580-note">
          <b>{tab}:</b> A TSP tour is a minimum-weight Hamiltonian cycle.
        </p>
      )}
      <section className="tsp580-lab">
        <main>
          <header>
            <div>
              <b>MANIPULATE - Plan a closed tour</b>
              <p>Click cities on the map in the order you want to visit.</p>
            </div>
            <button onClick={() => act(reset)}>
              <RotateCcw /> Reset tour
            </button>
          </header>
          <div className="tsp580-map">
            <svg
              viewBox="0 0 540 400"
              role="img"
              aria-label={`Five-city weighted map with tour distance ${total}`}
              onPointerMove={move}
              onPointerUp={() => setDragging(null)}
              onPointerLeave={() => setDragging(null)}
            >
              {Object.entries(weights).map(([edge, weight]) => {
                const a = points.find((c) => c.id === edge[0])!,
                  b = points.find((c) => c.id === edge[1])!;
                return (
                  <g
                    key={edge}
                    className={active.includes(edge) ? "active" : ""}
                  >
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                    {labels && (
                      <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 7}>
                        {weight}
                      </text>
                    )}
                  </g>
                );
              })}
              {points.map((city) => (
                <g
                  key={city.id}
                  data-testid={`tsp-city-${city.id}`}
                  onClick={() => choose(city.id)}
                  onPointerDown={(event) => {
                    setDragging(city.id);
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                >
                  <circle cx={city.x} cy={city.y} r="23" />
                  <text x={city.x} y={city.y + 5}>
                    {city.id}
                  </text>
                </g>
              ))}
            </svg>
            <label>
              Edge weights{" "}
              <input
                aria-label="Edge weights"
                type="checkbox"
                checked={labels}
                onChange={() => act(() => setLabels((v) => !v))}
              />{" "}
              On
            </label>
          </div>
        </main>
        <aside>
          <h4>YOUR TOUR (CLICK ORDER)</h4>
          <div className="tsp580-route">
            {route.map((city, i) => (
              <span key={city}>
                {i > 0 && <i>-&gt;</i>}
                <b>{city}</b>
              </span>
            ))}
            {closed && (
              <span>
                <i>-&gt;</i>
                <b>{route[0]}</b>
              </span>
            )}
          </div>
          <h3>Total distance</h3>
          <strong>
            {total} <small>units</small>
          </strong>
          <p>Route length calculation</p>
          <p>
            {route
              .slice(1)
              .map((city, i) => `${route[i]}${city} (${dist(route[i], city)})`)
              .join(" + ")}
            {complete && closed
              ? ` + ${route.at(-1)}${route[0]} (${dist(route.at(-1)!, route[0])}) = ${total}`
              : ""}
          </p>
          <div className="tsp580-actions">
            <button
              onClick={() =>
                act(() => {
                  setRoute([]);
                  setClosed(false);
                })
              }
            >
              Clear order
            </button>
            <button
              disabled={!complete}
              onClick={() => act(() => setClosed(true))}
            >
              <Check /> Close tour
            </button>
          </div>
          <section>
            <h4>NEAREST-NEIGHBOUR SUGGESTION</h4>
            <p>{routeText(nearest)}</p>
            <b>Distance: {length(nearest)} units</b>
            <button
              onClick={() =>
                act(() => {
                  setRoute(nearest);
                  setClosed(true);
                })
              }
            >
              Use this tour
            </button>
          </section>
          <section className="tsp580-best">
            <h4>BEST POSSIBLE</h4>
            <strong>
              <Trophy /> {optimum} <small>units</small>
            </strong>
            <p>Tour: {routeText(optimal)}</p>
          </section>
        </aside>
      </section>
      <p className="tsp580-objective">
        <b>Objective:</b> Model a small city as a weighted graph and find a
        minimum-length closed tour.
      </p>
      <section className="tsp580-theory">
        <article>
          <h4>NOTICE THE PATTERN</h4>
          <p>Changing the order changes the total distance.</p>
          <p>Good tours use more short edges and avoid long edges.</p>
          <aside>
            <b>Misconception check</b>
            <p>It is not always best to pick the nearest city next.</p>
          </aside>
          <aside>
            <Lightbulb />
            <b>Try this</b>
            <p>Find a tour shorter than {length(nearest)} units.</p>
          </aside>
        </article>
        <article>
          <h4>UNDERSTAND THE RULE</h4>
          <section>
            <b>Travelling Salesperson Problem (TSP)</b>
            <p>
              Find a minimum-distance closed tour that visits each city exactly
              once and returns to the starting city.
            </p>
          </section>
          <aside>
            <b>Key idea</b>
            <p>
              Test possible orders, compute total distance, and keep the best.
            </p>
          </aside>
        </article>
        <article>
          <h4>WORKED EXAMPLE</h4>
          <p>One optimal tour:</p>
          <p>{routeText(optimal)}</p>
          <ul>
            {optimal.map((city, i) => (
              <li key={city}>
                {city}
                {optimal[(i + 1) % optimal.length]} ={" "}
                {dist(city, optimal[(i + 1) % optimal.length])}
              </li>
            ))}
          </ul>
          <hr />
          <p>
            <b>Total = {optimum} units</b>
          </p>
          <p>This is the minimum for this map.</p>
        </article>
      </section>
      <section className="tsp580-practice">
        <header>
          <h4>TRY INDEPENDENTLY - Your challenge</h4>
          <p>Find a closed tour with total distance at most {optimum} units.</p>
        </header>
        <div className="tsp580-mini">
          <svg
            viewBox="0 0 540 400"
            role="img"
            aria-label="Independent five-city weighted graph"
          >
            {Object.entries(weights).map(([edge, weight]) => {
              const a = cities.find((city) => city.id === edge[0])!,
                b = cities.find((city) => city.id === edge[1])!;
              return (
                <g key={edge}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                  <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 7}>
                    {weight}
                  </text>
                </g>
              );
            })}
            {cities.map((city) => (
              <g key={city.id}>
                <circle cx={city.x} cy={city.y} r="22" />
                <text x={city.x} y={city.y + 5}>
                  {city.id}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const r = parse(answer),
              valid =
                r.length === 6 &&
                r[0] === r.at(-1) &&
                new Set(r.slice(0, -1)).size === 5 &&
                r.slice(0, -1).every((city) => ids.includes(city));
            act(() => setGraded(valid && length(r.slice(0, -1)) === optimum));
          }}
        >
          <label>
            Your answer
            <input
              aria-label="TSP challenge route"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="A -> B -> C -> E -> D -> A"
            />
          </label>
          <p>
            Total distance:{" "}
            <b>
              {parse(answer).length === 6
                ? length(parse(answer).slice(0, -1))
                : "-"}
            </b>{" "}
            units
          </p>
          <button>Check answer</button>
        </form>
        <aside className={graded ? "correct" : graded === false ? "wrong" : ""}>
          <b>One correct answer</b>
          <p>A -&gt; B -&gt; C -&gt; E -&gt; D -&gt; A</p>
          <strong>
            {optimum} <small>units</small>
          </strong>
          {graded && <span>Correct</span>}
          {graded === false && <span>Try another complete closed tour.</span>}
        </aside>
      </section>
      <nav className="tsp580-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/579-network-flow">
          &lt;-{" "}
          <span>
            Previous<b>Network Flow</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/581-adjacency-matrix">
          <span>
            Next<b>Adjacency Matrix</b>
          </span>{" "}
          -&gt;
        </a>
      </nav>
    </section>
  );
}
