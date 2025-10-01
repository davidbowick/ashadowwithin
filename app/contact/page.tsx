"use client";

import { useState } from "react";
import styles from "./page.module.css"; // create a CSS module for styling
import SignupForm from "@/components/SignupForm"; 
import SocialLinks from "@/components/SocialLinks";
import YouTubeSubscribe from "@/components/YouTubeSubscribe";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setForm({ name: "", email: "", message: "" }); // clear form
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    
    <main className={styles.container}>
      
      <section className={styles.form}>
      <h1>Contact</h1>
      <form onSubmit={handleSubmit} >
        <label className={styles.label} htmlFor="contact-name">
          Name
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label className={styles.label} htmlFor="contact-email">
          Email
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label className={styles.label} htmlFor="contact-message">
          Message
          <textarea
            id="contact-message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={6}
            required
          />
        </label>
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status === "success" && <p className={styles.success}>✅ Message sent successfully!</p>}
      {status === "error" && <p className={styles.error}>❌ Failed to send. Try again later.</p>}

      </section>

      <aside className={styles.sidebar}>
      
      <div className={styles.signupForm}>
        <h2>Subscribe to our Newsletter</h2>
        <SignupForm />
      </div>

      <div className={styles.socials}>
        <h2>Follow Us</h2>
        <SocialLinks/>
      </div>

      <div className={styles.youtube}>
        <YouTubeSubscribe />
      </div>
      </aside>
    </main>
  );
}