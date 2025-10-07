"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const handleConsent = (granted: boolean) => {
    localStorage.setItem("cookieConsent", granted ? "granted" : "denied");

    // only try if gtag is really ready
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: granted ? "granted" : "denied",
        analytics_storage: granted ? "granted" : "denied",
        functionality_storage: granted ? "granted" : "denied",
        personalization_storage: granted ? "granted" : "denied",
        security_storage: "granted",
      });

      // Only then fire config
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: window.location.pathname,
      });
    }

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        color: "white",
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        fontSize: "0.9rem",
        zIndex: 9999,
        maxWidth: "90%",
      }}
    >
      <p style={{ margin: 0, flex: 1 }}>
        We use cookies for analytics to improve your experience. Do you accept?
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => handleConsent(true)}
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Accept
        </button>
        <button
          onClick={() => handleConsent(false)}
          style={{
            background: "transparent",
            border: "1px solid #fff",
            color: "#fff",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}