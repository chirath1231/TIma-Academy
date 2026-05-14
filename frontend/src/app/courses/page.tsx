
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

type Course = {
  id: string;
  coursename: string;
  description: string;
  price: number;
  slug: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [payments, setPayments] = useState<any[]>([]); // User payments

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);

    // Fetch course list
    fetch("http://localhost:3001/getCoursePriceNames")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((course: any) => ({
          id: course._id,
          coursename: course.coursename,
          description: course.description,
          price: course.price,
          slug: course.coursename.toLowerCase().replace(/\s+/g, "-"),
        }));

        setCourses(
          formatted.sort(
            (a: { price: number }, b: { price: number }) => a.price - b.price
          )
        );
      });

    // Fetch all payments
    fetch("http://localhost:3001/getPayments")
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // ---------------- CHECK IF ALREADY PURCHASED ----------------
  const isPurchased = (coursename: string) => {
    if (!userEmail) return false;
    return payments.some((p: any) =>
      p.email === userEmail &&
      p.coursename
        .toLowerCase()
        .split(",")
        .map((c: string) => c.trim())
        .includes(coursename.toLowerCase())
    );
  };

  // ---------------- ADD TO CART ----------------
  const handleAddToCart = async (course: Course) => {
    if (!userEmail) return alert("Please login");

    const res = await fetch("http://localhost:3001/addToCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        courseId: course.id,
        coursename: course.coursename,
        price: course.price,
      }),
    });

    const data = await res.json();
    alert(data.message);
  };

  // ---------------- BUY BUTTON ----------------
  const handleBuy = async (course: Course) => {
    if (!userEmail) {
      alert("Please login again");
      return;
    }

    if (isPurchased(course.coursename)) {
      alert("You already purchased this course.");
      return;
    }

    const res = await fetch("http://localhost:3001/createPayHerePayment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coursename: course.coursename,
        price: course.price,
        email: userEmail,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert("Payment error");
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://sandbox.payhere.lk/pay/checkout";

    Object.entries(data.paymentData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  // ---------------- UI ----------------
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Courses</h1>

        {loading && <p>Loading courses...</p>}

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => {
            const purchased = isPurchased(course.coursename);
            return (
              <li
                key={course.id}
                className="card p-4 bg-white shadow rounded flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold">{course.coursename}</h2>
                  <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                  <div className="text-lg font-bold mt-3">LKR {course.price}</div>
                  {purchased && (
                    <span className="inline-block mt-2 px-2 py-1 text-white bg-green-500 rounded">
                      Purchased
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleBuy(course)}
                    disabled={purchased}
                    className={`px-4 py-2 rounded text-black ${
                      purchased ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {purchased ? "Purchased" : "Buy Now"}
                  </button>

                  <button
                    onClick={() => handleAddToCart(course)}
                    className="px-4 py-2 rounded text-black bg-yellow-400 hover:bg-yellow-500"
                  >
                    Add to Cart
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </ProtectedRoute>
  );
}
