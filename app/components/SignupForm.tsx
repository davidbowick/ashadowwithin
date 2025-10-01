"use client";
import { useState } from "react";
import styles from "./SignupForm.module.css";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMessage("🎉 Thanks for signing up!");
      setEmail("");
    } else {
      const errorData = await res.json();
      // errorData might look like { error: { message: "blah" } }
      const errMsg =
        errorData?.error?.message ||
        errorData?.message ||
        "Something went wrong.";
      setMessage(errMsg);
    }
  } catch {
    setMessage("Network error, try again.");
  }

  setLoading(false);
}

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="newsletter-email" className="visually-hidden">
        Email Address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Enter your email"
        className={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Signing up..." : "Sign up"}
      </button>
      {message && <p className="text-sm text-center mt-3">{message}</p>}
    </form>
  );
}