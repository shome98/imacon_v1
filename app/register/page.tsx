"use client";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {  status } = useSession();
  const router = useRouter();

  // Handle email-password registration
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
        setMessage("❌ An error occurred while registering. Try again!");
        console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google registration (auto-signs in)
  const handleGoogleRegister = async () => {
    const googleAuth = await signIn("google", { redirect: true });
    if (googleAuth?.ok) router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-400 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">Register</h1>
        
        {status !== "authenticated" ? (
          <form className="flex flex-col space-y-4" onSubmit={handleRegister}>
            <input
              type="email"
              name="email"
              value={email}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <input
              type="password"
              name="password"
              value={password}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              Register with Google
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h1 className="text-green-600 font-semibold">You are already signed in</h1>
            <button
              onClick={() => router.push("/")}
              className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {message && (
          <p className={`mt-4 text-center font-semibold ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
        
        <p className="mt-4 text-center text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
