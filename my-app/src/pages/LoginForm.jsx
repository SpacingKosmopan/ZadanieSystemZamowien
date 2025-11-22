import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function LoginForm({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;

      if (isRegister) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }

      setUser(result.user);
    } catch (error) {
      if (
        error == "FirebaseError: Firebase: Error (auth/email-already-in-use)."
      )
        window.alert("Ten email jest już używany. Zaloguj się zamiast tego.");
      if (error == "FirebaseError: Firebase: Error (auth/invalid-credential).")
        window.alert("Nieprawidłowe dane logowania. Spróbuj ponownie.");

      //console.error("Auth error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow-md rounded space-y-4"
    >
      <h2 className="text-xl font-bold">
        {isRegister ? "Rejestracja" : "Logowanie"}
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Hasło"
        className="w-full border px-3 py-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {isRegister ? "Zarejestruj" : "Zaloguj"}
      </button>

      <p className="text-center text-sm text-gray-600">
        {isRegister ? (
          <>
            Masz już konto?{" "}
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className="text-blue-600 underline"
            >
              Zaloguj się
            </button>
          </>
        ) : (
          <>
            Nie masz konta?{" "}
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className="text-blue-600 underline"
            >
              Zarejestruj
            </button>
          </>
        )}
      </p>
    </form>
  );
}
