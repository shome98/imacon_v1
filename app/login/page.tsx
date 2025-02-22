"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      console.log(session?.user);
    }
  }, [status, session]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const signinCred = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log(signinCred);
  };

  const handleGoogle = async (e: FormEvent) => {
    e.preventDefault();
    const signAuth = await signIn("google", { redirect: true });
    if (signAuth?.ok) router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">Login</h1>
        {status !== "authenticated" ? (
          <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              value={email}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
            <input
              type="password"
              name="password"
              value={password}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Login
            </button>
            <button
              onClick={handleGoogle}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              Sign in with Google
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h1 className="text-green-600 font-semibold">You are signed in</h1>
            <button
              onClick={() => signOut()}
              className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}