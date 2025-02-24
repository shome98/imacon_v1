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
