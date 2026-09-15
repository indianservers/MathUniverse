import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { activityLink, joinActivity, makeClassCode, pauseActivity, pushSnapshot, startActivity, type ClassroomActivity } from "./studioClassroom";

export function ClassroomBar() {
  const [params, setParams] = useSearchParams();
  const [code, setCode] = useState(params.get("class") ?? "");
  const [nick, setNick] = useState("Ada");
  const [status, setStatus] = useState("");
  const [joined, setJoined] = useState<ClassroomActivity | null>(null);

  useEffect(() => {
    const fromUrl = params.get("class");
    if (fromUrl) setCode(fromUrl.toUpperCase());
  }, [params]);

  useEffect(() => {
    setJoined(code ? joinActivity(code) : null);
  }, [code]);

  const start = () => {
    const next = makeClassCode();
    const href = typeof window === "undefined" ? "/" : window.location.pathname + window.location.search;
    startActivity(next, href, nick);
    pushSnapshot(href.includes("class=") ? href : activityLink(href, next), `Room ${next}`);
    setCode(next);
    setParams((prev) => {
      const copy = new URLSearchParams(prev);
      copy.set("class", next);
      return copy;
    }, { replace: true });
    setStatus(`Room ${next} · students join with this code`);
  };

  const join = () => {
    const found = joinActivity(code);
    setJoined(found);
    if (!found) {
      setStatus("No room with that code yet.");
      return;
    }
    setStatus(found.paused ? "Teacher paused. Wait." : `Joined ${found.nickname}'s room`);
    if (found.href && typeof window !== "undefined" && !found.paused) {
      window.history.replaceState(window.history.state, "", found.href.includes("class=") ? found.href : activityLink(found.href, code));
    }
  };

  return (
    <div className="msk-classroom" role="group" aria-label="Classroom activity">
      <button type="button" className="msk-soft" onClick={start}>Start activity</button>
      <input aria-label="Room code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Room code" />
      <input aria-label="Nickname" value={nick} onChange={(e) => setNick(e.target.value)} placeholder="Nickname" />
      <button type="button" className="msk-soft" onClick={join}>Join</button>
      {code ? (
        <button type="button" className="msk-soft" onClick={() => { pauseActivity(code, !(joined?.paused)); setJoined(joinActivity(code)); setStatus("Pause/push sent"); }}>
          {joined?.paused ? "Push" : "Pause"}
        </button>
      ) : null}
      {status ? <small>{status}</small> : <small>Anonymous nicknames. Share ?class= and ?fig=.</small>}
    </div>
  );
}
