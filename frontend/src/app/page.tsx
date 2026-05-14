"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "./components/ProtectedRoute";

type Course = {
  _id: string;
  coursename: string;
  price: number;
  description: string;
};

export default function HomePage() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [paidCourses, setPaidCourses] = useState<string[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read logged-in email
    const storedEmail = localStorage.getItem("userEmail");
    setEmail(storedEmail);

    if (!storedEmail) {
      setLoading(false);
      return;
    }

    // Fetch all course details
    fetch("http://localhost:3001/getCoursePriceNames")
      .then((res) => res.json())
      .then((json) => setAllCourses(json));

    // Fetch payment records
    fetch("http://localhost:3001/getPayments")
      .then((res) => res.json())
      .then((payments) => {
        const myPayments = payments.filter(
          (p: any) => p.email === storedEmail
        );

        let courses: string[] = [];

        myPayments.forEach((p: any) => {
          if (p.coursename) {
            const splitNames = p.coursename
              .split(",")
              .map((c: string) => c.trim());
            courses.push(...splitNames);
          }
        });

        courses = [...new Set(courses)];
        setPaidCourses(courses);
      })
      .finally(() => setLoading(false));
  }, []);

  const goToCourse = (coursename: string) => {
    const slug = coursename.toLowerCase().replace(/ /g, "-");
    router.push(`/courses/${slug}`);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-6">
          🏫 Welcome to Tima Academy
        </h1>

        <p className="text-gray-700 text-center mb-8">
          Logged in as: <b>{email ?? "User"}</b>
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Your Purchased Courses
        </h2>

        {loading && <p className="text-center">Loading your courses...</p>}

        {!loading && paidCourses.length === 0 && (
          <p className="text-center">No purchased courses yet.</p>
        )}

        {/* Paid course cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {paidCourses.map((courseName) => {
            const courseData = allCourses.find(
              (c) => c.coursename === courseName
            );

            return (
              <div
                key={courseName}
                onClick={() => goToCourse(courseName)}
                className="cursor-pointer bg-white border rounded-lg p-5 shadow-md hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-bold mb-2">{courseName}</h3>

                <p className="text-gray-600">
                  {courseData?.description ?? "No description available."}
                </p>

                <div className="mt-3 text-blue-600 font-semibold">
                  View Course →
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}
