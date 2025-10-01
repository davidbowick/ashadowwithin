"use client";

import { useEffect, useState } from "react";

export default function YouTubeSubscribe() {
  const [subCount, setSubCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSubs() {
      try {
        const res = await fetch("/api/youtube-subs");
        if (!res.ok) throw new Error("API failed");

        const data = await res.json();
        setSubCount(data.subCount);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSubs();
  }, []);

  return (
    <div className="yt-subscribe-banner flex">
    <a
      href="https://www.youtube.com/channel/UCf0NfJDnlxehjazWIcBPeJg?sub_confirmation=1"
      target="_blank"
      id="yt-subscribe"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="w-5 h-5"
      >
        <path d="M23.5 6.2s-.2-1.7-.9-2.5c-.9-.9-1.9-.9-2.4-1-3.4-.2-8.6-.2-8.6-.2h-.1s-5.2 0-8.6.2c-.5.1-1.5.1-2.4 1-.7.8-.9 2.5-.9 2.5S0 8.1 0 10v1.9c0 1.9.2 3.8.2 3.8s.2 1.7.9 2.5c.9.9 2 .9 2.5 1 1.8.2 7.9.2 7.9.2s5.2 0 8.6-.2c.5-.1 1.5-.1 2.4-1 .7-.8.9-2.5.9-2.5s.2-1.9.2-3.8V10c0-1.9-.2-3.8-.2-3.8zM9.6 14.7V8.3l6.3 3.2-6.3 3.2z" />
      </svg>

      <span>Subscribe</span>
      {subCount !== null && (
        <span className="ml-2 text-sm opacity-80">
          {subCount < 10000
            ? subCount.toLocaleString("en-US") // adds commas like 9,380
            : Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(subCount)}{" "}
          subs
        </span>
      )}
    </a>
    {/* <span className="yt-banner-text">Join the {subCount} people who are tuning in</span> */}
    </div>
  );
}