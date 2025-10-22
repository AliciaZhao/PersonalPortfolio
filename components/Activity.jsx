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
          {p.commitCount} commit{p.commitCount === 1 ? "" : "s"} pushed
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
        const r = await fetch("/api/github-activity", { cache: "no-store" });
        const j = await r.json();
        if (!cancelled) {
          r.ok ? setData(j) : setErr(j?.error || "Failed to load");
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

        {/* Scrollable feed */}
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
