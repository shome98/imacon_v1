import { IProduct } from "@/models/Product.model";
import ProductCard from "./ProductCard";
import { useSession } from "next-auth/react";

interface ImageGalleryProps {
  products: IProduct[];
  isAdmin?: boolean;
}


export default function ImageGallery({ products,isAdmin }: ImageGalleryProps) {
  const { data: session } = useSession();
  isAdmin = session?.user?.role === "Admin";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id?.toString()} product={product} isAdmin={isAdmin} />
      ))}
      {products.length === 0 && (
        <div className="col-span-full text-center py-16">
          <p className="text-gray-500 text-lg">🛒 No products found. Please check back later!</p>
        </div>
      )}
    </div>
  );
}
