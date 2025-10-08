"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("✅ Login successful!");
        window.location.href = "/";
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto mt-12">
      <h1 className="text-3xl font-semibold gradient-text text-center">
        Welcome back
      </h1>
      <p className="text-center text-gray-500">Log in to continue learning.</p>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="mt-1 input w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm">Password</span>
          <input
            type="password"
            className="mt-1 input w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-center">
        New here?{" "}
        <a href="/register" className="underline text-blue-600">
          Create an account
        </a>
      </p>
    </div>
  );
}
