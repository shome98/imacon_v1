"use client";
import { useSession } from "next-auth/react";
import ProductUploadForm from "../components/ProductUploadForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Lock, Loader2, Home } from "lucide-react";
import Link from "next/link";

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAdmin = session?.user?.role === "admin";

    useEffect(() => {
    
        if (status === "unauthenticated" || !isAdmin) {
            const timer = setTimeout(() => {
                router.push("/");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isAdmin, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-12 h-12 mx-auto text-gray-600 dark:text-gray-400" />
          <h1 className="text-2xl font-bold mt-4 mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don&apos;t have permission to access this page.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return <ProductUploadForm />;
}