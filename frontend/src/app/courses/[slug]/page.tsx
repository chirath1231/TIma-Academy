import Link from "next/link";

type CourseData = {
  title: string;
  summary: string;
  syllabus: string[];
  price: number;
};

const COURSES: Record<string, CourseData> = {
  "math-foundations": {
    title: "Math Foundations",
    summary: "Algebra, geometry, and problem solving from basics to intermediate.",
    syllabus: ["Numbers & Operations", "Algebra Basics", "Geometry Essentials", "Word Problems"],
    price: 19,
  },
  "science-essentials": {
    title: "Science Essentials",
    summary: "Core physics, chemistry, and biology explained simply.",
    syllabus: ["Mechanics", "Chemical Reactions", "Cells & Systems", "Labs & Safety"],
    price: 39,
  },
  "exam-prep": {
    title: "Exam Prep",
    summary: "Targeted practice, strategies, and mock tests to boost scores.",
    syllabus: ["Time Management", "Question Strategies", "Mock Tests", "Review & Feedback"],
    price: 49,
  },
};

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = COURSES[params.slug];

  if (!course) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Course not found</h1>
        <p className="opacity-80">The course you are looking for does not exist.</p>
        <Link className="underline" href="/courses">Back to courses</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <span className="badge">Popular</span>
      <h1 className="text-3xl font-semibold gradient-text">{course.title}</h1>
      <p className="muted">{course.summary}</p>

      <section>
        <h2 className="font-medium mb-2">Syllabus</h2>
        <ul className="list-disc pl-5 space-y-1">
          {course.syllabus.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>

      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold">${course.price}</span>
        <a href="/cart" className="btn">Add to cart</a>
        <a href="/checkout" className="btn btn-primary">Buy now</a>
      </div>

      <Link className="underline text-sm" href="/courses">← Back to all courses</Link>
    </div>
  );
}


