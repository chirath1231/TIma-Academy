export default function EnrollPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Enroll</h1>
      <form className="space-y-3 max-w-md">
        <label className="block">
          <span className="text-sm">Full name</span>
          <input className="mt-1 input" placeholder="Jane Doe" />
        </label>
        <label className="block">
          <span className="text-sm">Email</span>
          <input type="email" className="mt-1 input" placeholder="jane@example.com" />
        </label>
        <label className="block">
          <span className="text-sm">Course</span>
          <select className="mt-1 input">
            <option>Math Foundations</option>
            <option>Science Essentials</option>
            <option>Exam Prep</option>
          </select>
        </label>
        <button type="submit" className="btn btn-primary">Continue</button>
      </form>
    </div>
  );
}


