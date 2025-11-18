import { Github, Mail } from "lucide-react";

function Chip({ children }) {
  return <span className="badge">{children}</span>;
}

export default function ProfileCard() {
  return (
    <section className="window">
      <div className="title">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span>bio</span>
        </div>
        <div className="win-btns">
          <i className="win-btn" aria-hidden />
          <i className="win-btn" aria-hidden />
          <i className="win-btn" aria-hidden />
        </div>
      </div>

      <div className="content">
        <div className="profileRow">
          <img className="pfp" src="catpfp.jpg" alt="Profile" />
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
          <a className="btn" href="https://www.linkedin.com/in/alicia-zhao-52874a229" aria-label="Email">
            <Mail size={16} style={{ marginRight: 6 }} />
            Linkdin
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

      <div className="status">
        <i></i>
        <i></i>
        <i></i>
      </div>
    </section>
  );
}
