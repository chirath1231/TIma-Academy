"use client";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("http://localhost:3001/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Contact</h1>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <label className="block">
          <span className="text-sm">Name</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 input"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 input"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-sm">Message</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="mt-1 input"
            rows={4}
            placeholder="How can we help?"
          />
        </label>
        <button type="submit" className="btn btn-primary">Send</button>
        {status && <p className="mt-2">{status}</p>}
      </form>
    </div>
  );
}
