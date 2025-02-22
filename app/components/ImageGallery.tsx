import { IProduct } from "@/models/Product.model";
import ProductCard from "./ProductCard";

interface ImageGalleryProps {
  products: IProduct[];
}

export default function ImageGallery({ products }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id?.toString()} product={product} />
      ))}

      {products.length === 0 && (
        <div className="col-span-full text-center py-16">
          <p className="text-gray-500 text-lg">🛒 No products found. Please check back later!</p>
        </div>
      )}
    </div>
  );
}
