import { useState } from "react";
import { Card } from "./components";
import { useSetTheoryStore } from "../setTheoryStore";
import { expressions, setText, type Expression } from "./math";
import { membership, regionName, regionMeaning } from "./vennLearningEngine";
import type { VennApi } from "./VennCanvas";
import { operationHelp, operationPartition } from "./vennClarityModel";
export function RadiusControls({ api }: { api: VennApi }) {
  return (
    <section className="vu-radii" aria-label="Circle radius controls">
      <h3>Resize every set</h3>
      <p>
        Radius changes the drawing, not the number of members. Arrange keeps
        membership; Explore can change it.
      </p>
      {api.circles.map((c, i) => (
        <div
          className="vu-radius"
          key={c.id}
          style={{ borderLeftColor: ["#189aff", "#ef49d6", "#00cba3"][i] }}
        >
          <label>
            Set {c.id} radius
            <input
              aria-label={`Set ${c.id} radius`}
              type="range"
              aria-valuetext={`${Math.round(c.r)} diagram units`}
              min="60"
              max="185"
              value={c.r}
              disabled={api.beginner && c.id === "C"}
              onChange={(e) =>
                api.setCircleRadius(c.id, Number(e.target.value))
              }
            />
          </label>
          <input
            type="number"
            aria-label={`Set ${c.id} radius value`}
            min="60"
            max="185"
            value={Math.round(c.r)}
            disabled={api.beginner && c.id === "C"}
            onChange={(e) => {
              if (e.target.value && Number.isFinite(Number(e.target.value)))
                api.setCircleRadius(
                  c.id,
                  Math.max(60, Math.min(185, Number(e.target.value))),
                );
            }}
          />
          <button
            aria-label={`Reset Set ${c.id} radius`}
            disabled={api.beginner && c.id === "C"}
            onClick={() => api.setCircleRadius(c.id, 143)}
          >
            Reset
          </button>
        </div>
      ))}
      {api.beginner && <small>C is hidden in the two-set beginner view.</small>}
    </section>
  );
}
export function VennClarity({
  api,
  expression,
  setExpression,
}: {
  api: VennApi;
  expression: Expression;
  setExpression: (v: Expression) => void;
}) {
  const s = useSetTheoryStore(),
    [probe, Probe] = useState(""),
    [showExcluded, Excluded] = useState(false),
    [glossary, Glossary] = useState(false);
  const { included, excluded } = operationPartition(expression, s),
    help = operationHelp[expression];
  const choose = (v: Expression) => {
    setExpression(v);
    api.setOverride(null);
    api.setPaint(false);
    api.setConcealed(false);
    api.clearSelection();
  };
  return (
    <>
      <Card
        title="Understand the operation"
        description="Choose a rule, then follow the highlighted members."
      >
        <div className="vu-operation-grid">
          {expressions.map((v) => (
            <button
              key={v}
              aria-pressed={expression === v}
              onClick={() => choose(v)}
            >
              <b>{v}</b>
              <small>{operationHelp[v].name}</small>
            </button>
          ))}
        </div>
        <div className="vu-read">
          <b>Read aloud: {help.read}</b>
          <p>{help.rule}</p>
          <small>{help.tip}</small>
        </div>
        <div className="vu-counts">
          <span>
            <b>{s.universe.length}</b> in U
          </span>
          <span>
            <b>{included.length}</b> included
          </span>
          <span>
            <b>{excluded.length}</b> excluded
          </span>
        </div>
        <div
          className="vu-coverage"
          role="meter"
          aria-label="Result coverage of universe"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={
            s.universe.length
              ? Math.round((100 * included.length) / s.universe.length)
              : 0
          }
        >
          <i
            style={{
              width: `${s.universe.length ? (100 * included.length) / s.universe.length : 0}%`,
            }}
          />
        </div>
        <p>
          {s.universe.length
            ? `${Math.round((100 * included.length) / s.universe.length)}% of the universe satisfies this rule.`
            : "The universe is empty. Add elements in Explore → Live linked representations."}
        </p>
        <div className="vu-chips" aria-label="Included elements">
          {included.map((x) => (
            <button
              key={x}
              aria-pressed={api.inspected === x}
              onClick={() => api.setInspected(x)}
            >
              {x}
            </button>
          ))}
          {!included.length && <span>∅ · No elements satisfy the rule.</span>}
        </div>
        <button
          onClick={() => Excluded((v) => !v)}
          aria-expanded={showExcluded}
        >
          {showExcluded ? "Hide" : "Show"} excluded elements
        </button>
        {showExcluded && (
          <div className="vu-chips vu-excluded">
            {excluded.map((x) => (
              <button
                key={x}
                aria-pressed={api.inspected === x}
                onClick={() => api.setInspected(x)}
              >
                {x}
              </button>
            ))}
            {!excluded.length && (
              <span>Every universe element is included.</span>
            )}
          </div>
        )}
        <label className="vu-probe">
          Test one element
          <input
            aria-label="Test element membership"
            value={probe}
            placeholder="e.g. 3"
            onChange={(e) => Probe(e.target.value)}
          />
        </label>
        {probe && (
          <p role="status">
            {!s.universe.includes(probe)
              ? `${probe} is outside U. Add it to U before testing.`
              : `${probe}: ${regionMeaning(membership(s, probe))}. ${included.includes(probe) ? "Included" : "Excluded"} by ${expression}.`}
          </p>
        )}
        <button aria-expanded={glossary} onClick={() => Glossary((v) => !v)}>
          Symbol dictionary
        </button>
        {glossary && (
          <dl className="vu-dictionary">
            {[
              ["∪", "Union: in either set, including both."],
              ["∩", "Intersection: in both sets."],
              ["−", "Difference: in the first set but not the second."],
              ["ᶜ", "Complement: in U but outside this set."],
              ["△", "Symmetric difference: in exactly one set."],
              ["∅", "Empty set: no members."],
              ["|A|", "Cardinality: number of distinct members."],
            ].map(([symbol, meaning]) => (
              <div key={symbol}>
                <dt>{symbol}</dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>
        )}
      </Card>
      <Card
        title="Region navigator"
        description="Select an exact region. Inspection glow and purple result shading have different roles."
      >
        <div className="vu-region-grid">
          {Array.from({ length: api.beginner ? 4 : 8 }, (_, mask) => {
            const members = s.universe.filter((x) => membership(s, x) === mask);
            return (
              <button
                key={mask}
                aria-pressed={api.selectionActive && api.region === mask}
                onClick={() => api.setRegion(mask)}
              >
                <b>{regionName(mask)}</b>
                <span>
                  {members.length} {members.length === 1 ? "member" : "members"}
                </span>
                <small>{regionMeaning(mask)}</small>
              </button>
            );
          })}
        </div>
        {api.selectionActive && (
          <div className="vu-read">
            <b>{regionName(api.region)}</b>
            <p>
              {setText(
                s.universe.filter((x) => membership(s, x) === api.region),
              )}
            </p>
            <button onClick={api.clearSelection}>Clear region highlight</button>
          </div>
        )}
        <p className="vu-key">
          <i /> Glow = inspected region <em /> Purple = operation result
        </p>
      </Card>
    </>
  );
}
