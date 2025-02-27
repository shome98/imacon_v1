//product page single
import { IKImage } from "imagekitio-next";
import Link from "next/link";
import { IProduct, IMAGE_VARIANTS } from "@/models/Product.model";
import { Eye, Edit } from "lucide-react";

export default function ProductCard({ product, isAdmin }: { product: IProduct; isAdmin?: boolean }) {
  const lowestPrice = product.variants.reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    product.variants[0]?.price || 0
  );

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
      <figure className="relative">
        <Link href={`/products/${product._id}`} className="relative group block">
          <div className="overflow-hidden relative w-full h-64">
            <IKImage
              path={product.imageUrl}
              alt={product.name}
              loading="eager"
              transformation={[
                {
                  height: IMAGE_VARIANTS.SQUARE.dimensions.height.toString(),
                  width: IMAGE_VARIANTS.SQUARE.dimensions.width.toString(),
                  cropMode: "extract",
                  focus: "center",
                  quality: "80",
                },
              ]}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
        </Link>
      </figure>

      <div className="p-5">
        <Link href={`/products/${product._id}`} className="block hover:opacity-80 transition-opacity">
          <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
        </Link>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-lg font-bold text-blue-600">
              From ₹{lowestPrice.toFixed(2)}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              {product.variants.length} sizes available
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product._id}`}
              className="flex items-center bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
            >
              <Eye className="w-5 h-5 mr-2" />
              View Options
            </Link>
            {isAdmin && (
              <Link
                href={`/admin?edit=${product._id}`}
                className="flex items-center bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
              >
                <Edit className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}