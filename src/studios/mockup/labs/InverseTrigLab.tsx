import { useState } from "react";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { useLabMode } from "../studioLabKit";
import InverseTrigTargetLesson265 from "../../../modules/lessons/adapters/InverseTrigTargetLesson265";

export function InverseTrigLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const [resetToken, setResetToken] = useState(0);

  return (
    <>
      <nav className="msk-tabs trig-target-tabs inv-target-tabs" aria-label="Inverse trigonometry modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>
            {item}
          </button>
        ))}
      </nav>
      <div className="msk-lab trig-target-lab inv-target-lab is-git-target" data-lab-mode={mode} data-mode-canvas={mode} data-inv-mode={mode}>
        <InverseTrigTargetLesson265 resetToken={resetToken} onInteraction={() => setResetToken((n) => n + 1)} />
        <p className="inv-target-sr">Unit Circle Mapping · arcsin(sin θ) is not the identity</p>
      </div>
      <div className="trig-target-footer inv-target-footer">
        <MockupLearningStrip page={page} mode={mode} />
      </div>
    </>
  );
}

export default InverseTrigLab;
