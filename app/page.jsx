"use client";

import ProfileCard from "../components/ProfileCard";
import Tools from "../components/Tools";
import RecentWork from "../components/RecentWork";

import Activity from "../components/Activity";
import Footer from "../components/Footer";
import ThemeCard from "../components/ThemeToggle";
import MusicCard from "../components/MusicCard";
import Confetti from "../components/Halloween/confetti";
import Character from "../components/Halloween/character";
import GlobalChat from "../components/Chat";

export default function Home() {
  return (
    <main className="page">
      <div className="container">
        <div className="cols">
          {/* LEFT */}
          <div className="col col-left">
            <ProfileCard />
            <MusicCard />
            <ThemeCard />
            <GlobalChat />
          </div>

          {/* MIDDLE */}
          <div className="col col-mid">
            <RecentWork />
            <Activity />
            <Confetti />
          </div>

          {/* RIGHT */}
          <div className="col col-right">
            <Tools />
            <Character />
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
