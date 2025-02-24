"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // Display the order number for 3 seconds, then redirect to /orders
      const timer = setTimeout(() => {
        router.push("/orders");
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer
    } else {
      // If no session_id is provided, redirect to home
      router.push("/");
    }
  }, [sessionId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-900 dark:text-gray-100">
      <div className="text-center">
        <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-600 dark:text-green-400" />
        <h1 className="text-4xl font-bold mb-2">Order Successful!</h1>
        <p className="text-lg mb-6">
          Your order number is: <span className="font-mono font-bold">{sessionId}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Redirecting to orders page in 3 seconds...
        </p>
      </div>
    </div>
  );
}