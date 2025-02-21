"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const navigate = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-400 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to Imacon</h1>
        <div className="flex justify-between gap-x-4">
          <button
            onClick={() => navigate.push("/login")}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 flex-1"
          >
            Login
          </button>
          <button
            onClick={() => navigate.push("/register")}
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 flex-1"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}