export default function CoursesPage() {
  const courses = [
    { slug: "math-foundations", title: "Math Foundations", summary: "Algebra, geometry, problem solving." },
    { slug: "science-essentials", title: "Science Essentials", summary: "Physics, chemistry, and biology basics." },
    { slug: "exam-prep", title: "Exam Prep", summary: "Targeted practice and mock tests." },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Courses</h1>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course, i) => (
          <li key={course.slug} className="card">
            <a href={`/courses/${course.slug}`} className="block space-y-2">
              <div className="text-lg font-medium gradient-text">{course.title}</div>
              <div className="text-sm muted">{course.summary}</div>
              <span className="btn btn-secondary">View details</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}


