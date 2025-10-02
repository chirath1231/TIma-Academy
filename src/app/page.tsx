export default function Home() {
  return (
    <div className="space-y-8">
      <div className="section gradient-bg">
        <span className="badge">New</span>
        <h1 className="text-5xl font-semibold gradient-text mt-3">Learn better with colorful tuition classes</h1>
        <p className="muted max-w-2xl mt-2">Browse courses, pick a plan, and start learning today.</p>
        <div className="flex gap-3 mt-4">
          <a href="/courses" className="btn btn-primary">Browse courses</a>
          <a href="/pricing" className="btn btn-secondary">See pricing</a>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-lg font-medium">Live Mentors</div>
          <p className="muted text-sm mt-1">Get help from experts when you need it.</p>
        </div>
        <div className="card">
          <div className="text-lg font-medium">Mock Tests</div>
          <p className="muted text-sm mt-1">Practice exams to build confidence.</p>
        </div>
        <div className="card">
          <div className="text-lg font-medium">Progress Tracking</div>
          <p className="muted text-sm mt-1">Visualize your improvement over time.</p>
        </div>
      </div>
    </div>
  );
}
