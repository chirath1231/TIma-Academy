"use client";

import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Map frontend name to backend field "fullname"
      const payload = {
        fullname: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post("http://localhost:3001/register", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data && response.data.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        // optionally store minimal user info
        localStorage.setItem("user", JSON.stringify(response.data.user || {}));

        // clear form
        setFormData({ fullName: "", email: "", password: "" });

        // redirect to login
        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
      } else {
        setError(response.data?.message || "Registration failed");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during registration. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto mt-12">
      <h1 className="text-3xl font-semibold gradient-text text-center">Create your account</h1>
      <p className="text-center text-gray-500">Join Tima Academy and start learning today.</p>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm">Full name</span>
          <input
            name="fullName"
            className="mt-1 input w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Jane Doe"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
          />
        </label>

        <label className="block">
          <span className="text-sm">Email</span>
          <input
            name="email"
            type="email"
            className="mt-1 input w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </label>

        <label className="block">
          <span className="text-sm">Password</span>
          <input
            name="password"
            type="password"
            className="mt-1 input w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-center">
        Already have an account? <a href="/login" className="underline text-blue-600">Log in</a>
      </p>
    </div>
  );
}
