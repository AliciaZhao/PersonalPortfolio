"use client";

export default function TechStackCard() {
  const stack = [
    "React",
    "Tailwind CSS",
    "Express.js",
    "MongoDB",
    "Docker",
    "Stripe API",
  ];

  const stats = [
    { label: "Projects", value: "15+" },
    { label: "Technologies", value: "10+" },
    { label: "Yrs Experience", value: "4+" },
  ];

  return (
    <section className="window">
      {/* title bar */}
      <div className="title">
        <span>Favorite Tools</span>
        <div className="win-btns">
          <i className="win-btn" />
          <i className="win-btn" />
          <i className="win-btn" />
        </div>
      </div>

      {/* content */}
      <div className="content" style={{ padding: 8 }}>
        <div className="sectionTitle" style={{ marginBottom: 6 }}>
        </div>
        <div className="sectionSub" style={{ marginBottom: 10 }}>
          Favorite tools I use across projects
        </div>

        {/* tech badges */}
        <div className="grid three" style={{ marginBottom: 10 }}>
          {stack.map((x) => (
            <div
              key={x}
              className="pill"
              style={{
                textAlign: "center"
              }}
              title={x}
            >
              {x}
            </div>
          ))}
        </div>

        {/* stats */}
        <div className="grid three" style={{ gap: 6 }}>
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <div className="value">{s.value}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 12,
          }}
        >
          <div className="sectionSub">Let’s work together</div>

          <div style={{ display: "flex", gap: 8 }}>
            {/* fixed-color Email button */}
            <a
              className="btn"
              href="mailto:you@example.com"
              style={{
                background: "var(--btnleft)",
                color: "var(--btnlefttext)",
                border: "1px solid var(--edge)",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--btnleft)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--btnleft)";
              }}
            >
              Email Me
            </a>

            {/* ghost View Projects button */}
            <a
              className="btn ghost"
              href="#projects"
              style={{
                background: "var(--btnright)",
                border: "1px solid var(--outline)",
                color: "var(--btnrighttext)",
              }}
            >
              View Projects
            </a>
          </div>
        </div>
      </div>

      {/* bottom status strip */}
      <div className="status">
        <i></i>
        <i></i>
        <i></i>
      </div>
    </section>
  );
}
