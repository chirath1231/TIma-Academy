export default function ContactPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Contact</h1>
      <form className="space-y-3 max-w-md">
        <label className="block">
          <span className="text-sm">Name</span>
          <input className="mt-1 input" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="text-sm">Email</span>
          <input type="email" className="mt-1 input" placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="text-sm">Message</span>
          <textarea className="mt-1 input" rows={4} placeholder="How can we help?" />
        </label>
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}


