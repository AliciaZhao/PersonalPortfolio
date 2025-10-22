"use client";
import { useEffect } from "react";

export default function GlobalChat() {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://iframe.chat/scripts/main.min.js";
    s.async = true;
    s.onload = () => {
      if (window.chattable?.initialize) {
        window.chattable.initialize({ stylesheet: "/chattable.css" });
      }
    };
    document.head.appendChild(s);
  }, []);

  return (
    <section
      className="window"
      style={{
        height: 560,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div className="title">
        <span>chat</span>
        <div className="win-btns">
          <i className="win-btn" /><i className="win-btn" /><i className="win-btn" />
        </div>
      </div>

      <div
        className="content"
        style={{
          padding: 0,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <iframe
          id="chattable"
          src="https://iframe.chat/embed?chat=94979238"
          title="Chat"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          allow="clipboard-write *; microphone *; camera *; autoplay *"
          style={{
            border: "none",
            width: "100%",
            flex: 1,
            minHeight: 0,
            background: "var(--window-inner)",
          }}
        />
      </div>

      <div className="status"><i/><i/><i/></div>
    </section>
  );
}
