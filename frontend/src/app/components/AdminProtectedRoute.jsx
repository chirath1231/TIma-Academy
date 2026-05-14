"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProtectedRoute({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const email = localStorage.getItem("userEmail");
      const token = localStorage.getItem("token"); // JWT or session token

      if (!email || !token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:3001/api/check-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!data.isAdmin) {
          router.push("/");
          return;
        }

        setIsChecking(false);
      } catch (err) {
        console.error("Error checking admin:", err);
        router.push("/login");
      }
    };

    checkAdmin();
  }, [router]);

  if (isChecking) return null;

  return <>{children}</>;
}
