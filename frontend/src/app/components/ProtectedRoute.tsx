"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if we're in the browser
        if (typeof window !== "undefined") {
          const token = sessionStorage.getItem("authToken");
          const userEmail = sessionStorage.getItem("userEmail");
          
          if (token && userEmail) {
            setIsAuthenticated(true);
            setIsChecking(false);
          } else {
            router.replace("/login");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}