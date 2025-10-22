import "./styles.css";


export const metadata = {
  title: "Alicia Zhao",
  description: "Personal portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add the chattable script here */}
        <script src="https://iframe.chat/scripts/main.min.js" async></script>
      </head>
      <body>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="bg-video"
        >
          <source src="/bg.mp4" type="video/mp4" />
        </video>

        <div className="page-overlay">{children}</div>
      </body>
    </html>
  );
}
