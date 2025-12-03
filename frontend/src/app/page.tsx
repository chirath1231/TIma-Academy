"use client";
import  ProtectedRoute from "./components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold mb-4">🏫 Welcome to Tima Academy</h1>
        <p className="text-gray-600 mb-6">You’re logged in successfully.</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-black px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </ProtectedRoute>
  );
}
