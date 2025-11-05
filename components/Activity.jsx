"use client";
import { useEffect, useState } from "react";

function ActivityItem({ p }) {
  return (
    <div className="stepRow" style={{ width: "100%", minWidth: 0 }}>
      <div className="stepBody" style={{ flex: 1, minWidth: 0 }}>
        <div className="stepTitle truncate">
          {p.repo} <span style={{ opacity: 0.6 }}>@ {p.branch}</span>
        </div>
        <div className="stepDesc">
          1 commit{p.commitCount === 1 ? "" : "s"} pushed
        </div>

        {p.commits?.length > 0 && (
          <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
            {p.commits.map((c) => (
              <a
                key={c.sha}
                href={c.url || "#"}
                target="_blank"
                rel="noreferrer"
                className="badge"
                style={{
                  borderStyle: "dotted",
                  background: "transparent",
                  color: "var(--window-text)",
                  borderColor: "var(--techclr)",
                  textDecoration: "none",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={c.msg}
              >
                {c.msg}
              </a>
            ))}
          </div>
        )}

        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
          {new Date(p.ts).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default function ActivitiesCard() {
  const [data, setData] = useState({ pushes: [] });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(
          "https://api.github.com/users/AliciaZhao/events/public",
          { headers: { Accept: "application/vnd.github+json" } }
        );
        const events = await r.json();

        if (cancelled) return;
        if (!r.ok) {
          setErr(events?.message || "Failed to load");
        } else {
          const pushes = (events || [])
            .filter((e) => e.type === "PushEvent")
            .map((e) => ({
              id: e.id,
              repo: e.repo?.name || "unknown",
              branch: e.payload?.ref?.split("/").pop() || "main",
              ts: e.created_at,
              commitCount: e.payload?.size || 0,
              commits: (e.payload?.commits || []).map((c) => ({
                sha: c.sha,
                msg: c.message,
                url: `https://github.com/${e.repo?.name}/commit/${c.sha}`,
              })),
            }));
          setData({ pushes });
        }
      } catch (e) {
        if (!cancelled) setErr(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);


  const FEED_HEIGHT = 220; // px

  return (
    <section className="window">
      {/* title bar */}
      <div className="title">
        <span>activities</span>
        <div className="win-btns">
          <i className="win-btn" />
          <i className="win-btn" />
          <i className="win-btn" />
        </div>
      </div>

      {/* content */}
      <div className="content" style={{ padding: 8 }}>
        <div className="sectionSub" style={{ marginBottom: 10 }}>
          Latest commits across my public repos
        </div>

        {err && (
          <div className="stepDesc" style={{ color: "crimson", marginBottom: 8 }}>
            {err}
          </div>
        )}

        <div
          className="stack"
          style={{
            minWidth: 0,
            maxHeight: FEED_HEIGHT,
            overflowY: "auto",
            paddingRight: 4, 
          }}
        >
          {loading && <div className="stepDesc">Loading…</div>}

          {!loading && data.pushes.length === 0 && !err && (
            <div className="stepDesc">No recent pushes found.</div>
          )}

          {data.pushes.map((p) => (
            <ActivityItem key={p.id} p={p} />
          ))}
        </div>
      </div>

      {/* bottom strip */}
      <div className="status">
        <i />
        <i />
        <i />
      </div>
    </section>
  );
}
