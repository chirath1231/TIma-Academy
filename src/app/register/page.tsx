export default function RegisterPage() {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h1 className="text-3xl font-semibold gradient-text">Create your account</h1>
      <p className="muted">Join EduCommerce and start your learning journey.</p>
      <form className="space-y-3">
        <label className="block">
          <span className="text-sm">Full name</span>
          <input className="mt-1 input" placeholder="Jane Doe" />
        </label>
        <label className="block">
          <span className="text-sm">Email</span>
          <input type="email" className="mt-1 input" placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input type="password" className="mt-1 input" placeholder="••••••••" />
        </label>
        <button type="submit" className="btn btn-primary w-full">Create account</button>
      </form>
      <p className="text-sm">Already have an account? <a className="underline" href="/login">Log in</a></p>
    </div>
  );
}


