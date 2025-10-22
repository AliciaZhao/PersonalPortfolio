import { Github, Mail } from "lucide-react";

function Chip({ children }) {
  return <span className="badge">{children}</span>;
}

export default function ProfileCard() {
  return (
    <section className="window">
      {/* boxed title strip */}
      <div className="title">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>bio</span>
        </div>

        {/* tiny window buttons at right (optional) */}
        <div className="win-btns">
          <i className="win-btn" aria-hidden />
          <i className="win-btn" aria-hidden />
          <i className="win-btn" aria-hidden />
        </div>
      </div>

      {/* boxed content strip */}
      <div className="content">
        <div className="profileRow">
          <img className="pfp" src="/catpfp.jpg" alt="Profile" />
          <div>
            <div className="profileName">Alicia Zhao</div>
            <div className="profileRole">Full Stack Developer</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 14,
          }}
        >
          <Chip>English/Mandarin</Chip>
          <Chip>GMT-7</Chip>
          <Chip>Software Engineer</Chip>
          <Chip>Freelancer</Chip>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <a className="btn" href="mailto:alicia.zhao1@gmail.com" aria-label="Email">
            <Mail size={16} style={{ marginRight: 6 }} />
            Hire Me
          </a>
          <a
            className="btn"
            href="https://github.com/AliciaZhao"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Github size={16} style={{ marginRight: 6 }} />
            GitHub
          </a>
        </div>
      </div>

      {/* tiny status blocks (optional) */}
      <div className="status">
        <i></i>
        <i></i>
        <i></i>
      </div>
    </section>
  );
}
