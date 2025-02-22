// "use client";

// import { useRouter } from "next/navigation";

// export default function Home() {
//   const navigate = useRouter();
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-400 p-4">
//       <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm text-center">
//         <h1 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to Imacon</h1>
//         <div className="flex justify-between gap-x-4">
//           <button
//             onClick={() => navigate.push("/login")}
//             className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 flex-1"
//           >
//             Login
//           </button>
//           <button
//             onClick={() => navigate.push("/register")}
//             className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 flex-1"
//           >
//             Register
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import ImageGallery from "./components/ImageGallery";
import { IProduct } from "@/models/Product.model";
import { apiClient } from "@/lib/server_actions";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🛍️ ImaCon Shop
      </h1>

      {loading && (
        <div className="flex justify-center py-10 text-gray-600">
          <span className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10"></span>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 font-medium">{error}</div>
      )}

      {!loading && !error && <ImageGallery products={products} />}
    </main>
  );
}
