"use client";
import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="flex flex-row gap-3 max-w-sm mx-auto">
      <input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 rounded bg-white text-black"
      />
      <button
        type="submit"
        disabled={loading}
        className="border-gray-600 bg-black text-white focus:ring-red-600 p-2 rounded"
      >
        {loading ? "Signing up..." : "Subscribe"}
      </button>
      {message && <p className="text-sm text-center mt-3">{message}</p>}
    </form>
  );
}