"use client";

import Link from "next/link";
import { Construction, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="text-center">
        <Construction className="w-20 h-20 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
        <h1 className="text-4xl font-bold mb-2">Coming Soon</h1>
        <p className="text-lg mb-6">This page is under construction. Please check back later!</p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}