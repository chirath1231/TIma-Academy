export default function LoginPage() {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h1 className="text-3xl font-semibold gradient-text">Welcome back</h1>
      <p className="muted">Log in to continue learning.</p>
      <form className="space-y-3">
        <label className="block">
          <span className="text-sm">Email</span>
          <input type="email" className="mt-1 input" placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input type="password" className="mt-1 input" placeholder="••••••••" />
        </label>
        <button type="submit" className="btn btn-primary w-full">Log in</button>
      </form>
      <p className="text-sm">New here? <a className="underline" href="/register">Create an account</a></p>
    </div>
  );
}


