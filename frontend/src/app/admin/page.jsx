// 
"use client";

import { useEffect, useState } from "react";
import AdminProtectedRoute from "../components/AdminProtectedRoute";

export default function AdminPage() {
  // ---------------- COURSE STATES ----------------
  const [allCourses, setAllCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDesc, setCourseDesc] = useState("");

  // ---------------- VIDEO STATES ----------------
  const [selectedCourse, setSelectedCourse] = useState("");
  const [videonumber, setVideoNumber] = useState("");
  const [videolink, setVideoLink] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [allVideos, setAllVideos] = useState([]);

  // ---------------- PAYMENT STATES ----------------
  const [payments, setPayments] = useState([]);

  // ---------------- FETCH COURSES ----------------
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:3001/getCoursePriceNames");
      const data = await res.json();
      setAllCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  // ---------------- FETCH VIDEOS ----------------
  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:3001/getAllVideos");
      const data = await res.json();
      setAllVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    }
  };

  // ---------------- FETCH PAYMENTS ----------------
  const fetchPayments = async () => {
    try {
      const res = await fetch("http://localhost:3001/getPayments");
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchVideos();
    fetchPayments();
  }, []);

  // ---------------- ADD NEW COURSE ----------------
  const handleAddNewCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/addCoursePrice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coursename: courseName,
          price: coursePrice,
          description: courseDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("New Course Created!");
        setCourseName("");
        setCoursePrice("");
        setCourseDesc("");
        fetchCourses();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- ADD VIDEO ----------------
  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/courses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coursename: selectedCourse,
          videonumber,
          videolink,
          description: videoDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Course Video Added!");
        setVideoNumber("");
        setVideoLink("");
        setVideoDesc("");
        fetchVideos();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- DELETE COURSE ----------------
  const handleDeleteCourse = async (id, coursename) => {
    if (!confirm(`Delete course "${coursename}" and all its videos?`)) return;
    try {
      await fetch(`http://localhost:3001/deleteCourse/${id}`, {
        method: "DELETE",
      });
      fetchCourses();
      fetchVideos();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- DELETE VIDEO ----------------
  const handleDeleteVideo = async (id) => {
    if (!confirm("Delete this video?")) return;
    try {
      await fetch(`http://localhost:3001/courses/delete/${id}`, {
        method: "DELETE",
      });
      fetchVideos();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- DELETE PAYMENT ----------------
  const handleDeletePayment = async (id) => {
    if (!confirm("Delete this payment record?")) return;
    try {
      await fetch(`http://localhost:3001/deletePayment/${id}`, { method: "DELETE" });
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- GROUP VIDEOS BY COURSE ----------------
  const videosByCourse = allCourses.map((course) => ({
    ...course,
    videos: allVideos.filter((v) => v.coursename === course.coursename),
  }));

  return (
    <AdminProtectedRoute>
      <div className="p-6 space-y-10">

        {/* ---------------- COURSES ---------------- */}
        <div className="border p-4 rounded-lg bg-gray-100 shadow">
          <h2 className="text-2xl font-bold mb-3">Courses</h2>

          <form className="space-y-4" onSubmit={handleAddNewCourse}>
            <input
              type="text"
              placeholder="Course Name"
              className="w-full border p-2 rounded"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Course Price"
              className="w-full border p-2 rounded"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              required
            />
            <textarea
              placeholder="Course Description"
              className="w-full border p-2 rounded"
              value={courseDesc}
              onChange={(e) => setCourseDesc(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-black p-2 rounded w-full"
            >
              Create Course
            </button>
          </form>

          <h3 className="mt-6 font-semibold text-lg">Existing Courses:</h3>
          <ul className="mt-2">
            {allCourses.map((course) => (
              <li
                key={course._id}
                className="flex justify-between items-center border p-2 my-1 rounded"
              >
                <span>
                  {course.coursename} - LKR {course.price}
                </span>
                <button
                  onClick={() => handleDeleteCourse(course._id, course.coursename)}
                  className="bg-red-500 text-black px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- VIDEOS ---------------- */}
        <div className="border p-4 rounded-lg bg-gray-100 shadow">
          <h2 className="text-2xl font-bold mb-3">Videos</h2>

          <select
            className="w-full border p-2 rounded mb-4"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">Select Course</option>
            {allCourses.map((course) => (
              <option key={course._id} value={course.coursename}>
                {course.coursename}
              </option>
            ))}
          </select>

          <form className="space-y-4" onSubmit={handleAddVideo}>
            <input
              type="number"
              placeholder="Content Number"
              className="w-full border p-2 rounded"
              value={videonumber}
              onChange={(e) => setVideoNumber(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Resource Link (Zoom/Video)"
              className="w-full border p-2 rounded"
              value={videolink}
              onChange={(e) => setVideoLink(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded"
              value={videoDesc}
              onChange={(e) => setVideoDesc(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-black p-2 rounded w-full"
            >
              Add
            </button>
          </form>

          <h3 className="mt-6 font-semibold text-lg">Existing Videos By Course:</h3>
          {videosByCourse.map((course) => (
            <div key={course._id} className="mb-4">
              <h4 className="font-semibold">{course.coursename}</h4>
              {course.videos.length === 0 ? (
                <p className="ml-2 text-gray-600">No videos yet.</p>
              ) : (
                <ul className="ml-2 mt-2">
                  {course.videos.map((video) => (
                    <li
                      key={video._id}
                      className="flex justify-between items-center border p-2 my-1 rounded"
                    >
                      <span>
                        Video {video.videonumber}: {video.description}
                      </span>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        className="bg-red-500 text-black px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* ---------------- PAYMENTS ---------------- */}
        <div className="border p-4 rounded-lg bg-gray-100 shadow">
          <h2 className="text-2xl font-bold mb-3">Remove Access from users</h2>

          {payments.length === 0 ? (
            <p>No payments found.</p>
          ) : (
            <ul className="mt-2">
              {payments.map((payment) => (
                <li
                  key={payment._id}
                  className="flex justify-between items-center border p-2 my-1 rounded"
                >
                  <span>
                    {payment.email} - {payment.coursename} - LKR {payment.amount} -{" "}
                    {payment.status}
                  </span>
                  <button
                    onClick={() => handleDeletePayment(payment._id)}
                    className="bg-red-500 text-black px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove Access
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
