import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from "firebase/auth";
import { useEffect } from "react";
import { auth, provider } from "../firebase";

export default function LoginButton({ user }) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleLogin = async () => {
    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    // Handle redirect login result (mobile)
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect login error:", error);
    });
  }, []);

  return user ? (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Wyloguj
    </button>
  ) : (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      Zaloguj się
    </button>
  );
}
