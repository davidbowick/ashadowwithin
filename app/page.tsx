import Image from "next/image";
import SocialLinks from "./components/SocialLinks";
import styles from "./page.module.css";
import { client } from "./lib/sanity";
import { videoCoverStyles } from "./lib/videoCover";
import SignupForm from "./components/SignupForm";
import Header from "./components/Header";
import TextureOverlay from "./components/TextureOverlay";

async function getVideoBackground() {
  return client.fetch(`*[_type == "videoBackground" && active == true][0]{
    youtubeId,
    width,
    height
  }`);
}

export default async function Home() {
  const video = await getVideoBackground();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <Header />

        <SocialLinks />
        <SignupForm />
      </main>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        {video && (
          <iframe
            className="video-background"
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${video.youtubeId}&controls=0&showinfo=0&modestbranding=1`}
            frameBorder="0"
            allow="autoplay; fullscreen"
            width={video.width}
            height={video.height}
            allowFullScreen
            style={videoCoverStyles(video.width, video.height).style}
          />
        )}
      </div>
      <TextureOverlay />
    </div>
  );
}
