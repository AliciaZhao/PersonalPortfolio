"use client";

export default function TechStackMerged({
  email = "you@example.com",
  viewHref = "#projects",
  stats = [
    { label: "Projects", value: "15+" },
    { label: "Technologies", value: "10+" },
    { label: "Yrs Experience", value: "4+" },
  ],
  stacks = {
    Frontend: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Lucide Icons", "shadcn/ui"],
    Backend: ["Node.js", "Express.js", "FastAPI", "Stripe API", "Multer", "CORS"],
    Database: ["MongoDB", "Mongoose", "PostgreSQL", "MySQL"],
    DevOps: ["Docker", "Render", "Netlify", "Vercel", "Railway", "Grafana / Prometheus"],
    Languages: ["JavaScript", "Python", "Java", "C++", "Rust"],
  },
}) {
  return (
    <section className="window">
      {/* title bar */}
      <div className="title">
        <span>Tech Stack & Tools</span>
        <div className="win-btns">
          <i className="win-btn" />
          <i className="win-btn" />
          <i className="win-btn" />
        </div>
      </div>

      {/* content */}
      <div className="content" style={{ padding: 8 }}>
        {/* Tools / Frameworks first */}
        <div className="sectionSub" style={{ marginBottom: 10 }}>
          Tools, frameworks, and technologies I commonly use.
        </div>

        {/* stats */}
          <div className="grid three" style={{ gap: 6, marginBottom: 12 }}>
            {stats.map((s) => (
              <div key={s.label} className="stat" aria-label={`${s.label}: ${s.value}`}>
                <div className="value">{s.value}</div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </div>

        {/* Categorized Stack */}
        {Object.entries(stacks).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 12 }}>
            <div
              className="sectionSub"
              style={{
                fontWeight: 600,
                marginBottom: 6,
                fontSize: "1.3rem",
                opacity: 0.9,
                color: "var(--techclr)",
              }}
            >
              {category}
            </div>
            <div className="grid three">
              {items.map((s) => (
                <div key={s} className="pill" title={s}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 18 }}>
          

          {/* CTA row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginTop: 8,
            }}
          >
            <div className="sectionSub">Let’s work together</div>

            <div style={{ display: "flex", gap: 8 }}>
              {/* fixed-color Email button */}
              <a
                className="btn"
                href={`mailto:${email}`}
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
                href={viewHref}
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
