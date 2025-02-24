"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      const timer = setTimeout(() => {
        router.push("/orders");
      }, 3000);

      return () => clearTimeout(timer); 
    } else {
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

export default function SuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            }
        >
            <SuccessContent />
        </Suspense>
    );
}