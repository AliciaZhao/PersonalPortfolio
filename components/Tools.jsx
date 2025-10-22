"use client";

export default function TechStack() {
  const stacks = {
    Frontend: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Lucide Icons",
      "shadcn/ui",
    ],
    Backend: [
      "Node.js",
      "Express.js",
      "FastAPI",
      "Stripe API",
      "Multer",
      "CORS",
    ],
    Database: ["MongoDB", "Mongoose", "PostgreSQL", "MySQL"],
    DevOps: [
      "Docker",
      "Render",
      "Netlify",
      "Vercel",
      "Railway",
      "Grafana / Prometheus",
    ],
    Languages: ["JavaScript", "Python", "Java", "C++", "Rust"],
  };

  return (
    <section className="window">
      {/* title bar */}
      <div className="title">
        <span>tech stack</span>
        <div className="win-btns">
          <i className="win-btn" />
          <i className="win-btn" />
          <i className="win-btn" />
        </div>
      </div>

      {/* content area */}
      <div className="content" style={{ padding: 8 }}>
  
        <div className="sectionSub" style={{ marginBottom: 10 }}>
          Tools, frameworks, and technologies I commonly use.
        </div>

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
                <div key={s} className="pill">
                  {s}
                </div>
              ))}
            </div>
          </div>
        ))}
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
