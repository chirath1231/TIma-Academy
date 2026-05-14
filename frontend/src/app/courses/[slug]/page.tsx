"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Video = {
  id: string;
  coursename: string;
  videonumber: number;
  videolink: string;
  description: string;
};

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert slug back to actual course name (replace dashes with spaces)
  const coursename = String(slug).replace(/-/g, " ");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Encode the course name to avoid spaces breaking the URL
        const response = await fetch(
          `http://localhost:3001/courses/${encodeURIComponent(coursename)}`
        );

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            `Expected JSON, but got "${contentType}". Status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          setError(data.message || "No videos found for this course.");
          setVideos([]);
        } else {
          // Map to frontend format
          const formatted: Video[] = data.videos.map((v: any) => ({
            id: v._id,
            coursename: v.coursename,
            videonumber: v.videonumber,
            videolink: v.videolink,
            description: v.description,
          }));

          setVideos(formatted);
        }
      } catch (err: any) {
        console.error("Error fetching course details:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [coursename]);

  if (loading) return <p>Loading course videos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{coursename} – Videos</h1>

      {videos.length === 0 ? (
        <p>No videos available for this course.</p>
      ) : (
        <ul className="space-y-4">
          {videos.map((video) => (
            <li
              key={video.id}
              className="p-4 border rounded shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold">Video {video.videonumber}</h2>

              <p className="text-gray-600 mt-2">{video.description}</p>

              <a
                href={video.videolink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-3 inline-block"
              >
                Watch Now
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
