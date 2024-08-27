// app/hooks/useAuth.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, checkAuth } from "@/appwrite/Services/authServices";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const isAuthenticated = await checkAuth();
        if (isAuthenticated) {
          const currentUser = await getCurrentUser();
          if (!currentUser.team) {
            console.error("User team is null or undefined:", currentUser);
            router.push("/login"); // Redirect to login if team is not defined
          } else {
            setUser(currentUser);
          }
        } else {
          router.push("/login"); // Redirect to login if not authenticated
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/login"); // Redirect to login if there's an error
      } finally {
        setLoading(false);
      }
    };

    authenticateUser();
  }, [router]);

  return { user, loading };
};

export default useAuth;
