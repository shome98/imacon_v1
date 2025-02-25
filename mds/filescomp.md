```tsx 
//product upload form
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useNotification } from "./NotificationPopup";
import { IMAGE_VARIANTS, ImageVariantType } from "@/models/Product.model";
import { apiClient, ProductFormData } from "@/lib/server_actions";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductUploadFormProps {
  productId?: string;
}

export default function ProductUploadForm({ productId }: ProductUploadFormProps) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!productId);
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      variants: [
        {
          type: "SQUARE" as ImageVariantType,
          price: 10,
          license: "Personal",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const currentImageUrl = watch("imageUrl");

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const product = await apiClient.getProduct(productId);
          reset(product);
          setOldImageUrl(product.imageUrl);
        } catch (error) {
          console.log(error)
          showNotification("Failed to fetch product details", "error");
          router.push("/admin");
        }
      };
      fetchProduct();
    }
  }, [productId, reset, router, showNotification]);

 const handleUploadSuccess = async (response: IKUploadResponse) => {
  // Delete the old image if a new one is uploaded
  if (oldImageUrl && currentImageUrl !== response.filePath) {
    try {
      // Fetch the product to get the fileId

        const product = await apiClient.getProduct(productId);
        const fileId = product.imageUrl; // Use the fileId from the database

      if (!fileId) {
        throw new Error("File ID not found in the database");
      }

      const deleteResponse = await fetch("/api/imagekit/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        console.error("Failed to delete old image:", errorData);
        throw new Error(errorData.error || "Failed to delete old image");
      }

      showNotification("Old image deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete old image:", error);
      showNotification("Failed to delete old image", "error");
    }
  }

  // Set the new image URL
  setValue("imageUrl", response.filePath);
  setOldImageUrl(response.filePath);
  showNotification("Image uploaded successfully!", "success");
};

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    console.log(isEditing);
    try {
      if (isEditing && productId) {
        await apiClient.updateProduct(productId, data);
        showNotification("Product updated successfully!", "success");
      } else {
        await apiClient.createProduct(data);
        showNotification("Product created successfully!", "success");
      }
      router.push("/");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to save product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      // Delete the product image from ImageKit
      if (oldImageUrl) {
        const fileId = oldImageUrl.split("/").pop()?.split(".")[0]; // Extract file ID from URL
        if (fileId) {
          await fetch("/api/imagekit/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileId }),
          });
          showNotification("Product image deleted successfully!", "success");
        }
      }

      // Delete the product from the database
      await apiClient.deleteProduct(productId);
      showNotification("Product deleted successfully!", "success");
      setIsEditing(false);
      router.push("/");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to delete product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl bg-gray-300 shadow-lg rounded-lg p-6 flex flex-col overflow-auto"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">
          {isEditing ? "Edit Product" : "Upload Product"}
        </h2>

        <div className="space-y-4 flex-1 overflow-auto">
          {/* Product Name */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Product Name</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none text-gray-700 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Product Description */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Description</label>
            <textarea
              className={`w-full px-3 py-2 border rounded-md focus:outline-none text-gray-700 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <label className="block font-medium mb-1 text-gray-700">Product Image</label>
            <FileUpload onSuccess={handleUploadSuccess} />
          </div>

          {/* Variants Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 text-center">Image Variants</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="bg-gray-100 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Variant Type */}
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Size & Aspect Ratio</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md text-gray-500"
                      {...register(`variants.${index}.type`)}
                    >
                      {Object.entries(IMAGE_VARIANTS).map(([key, value]) => (
                        <option key={key} value={value.type}>
                          {value.label} ({value.dimensions.width}x{value.dimensions.height})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* License Type */}
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">License</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md text-gray-500"
                      {...register(`variants.${index}.license`)}
                    >
                      <option value="Personal">Personal Use</option>
                      <option value="Commercial">Commercial Use</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Price (₹)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      className="w-full px-3 py-2 border rounded-md text-gray-500"
                      {...register(`variants.${index}.price`, {
                        valueAsNumber: true,
                        required: "Price is required",
                        min: { value: 1, message: "Price must be greater than 0" },
                      })}
                    />
                    {errors.variants?.[index]?.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.variants[index]?.price?.message}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-2 text-red-500 hover:text-red-700 flex items-center"
                >
                  <Trash2 size={16} className="mr-1" /> Remove
                </button>
              </div>
            ))}

            {/* Add Variant Button */}
            <button
              type="button"
              onClick={() => append({ type: "SQUARE", price: 10, license: "Personal" })}
              className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add Variant
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="sticky bottom-0 py-3 flex justify-center gap-4">
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
              disabled={loading}
            >
              {loading && <Loader2 size={18} className="mr-2 animate-spin" />}
              Delete Product
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            disabled={loading}
          >
            {loading && <Loader2 size={18} className="mr-2 animate-spin" />}
            {isEditing ? "Update Product" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

```tsx
//admin page
"use client";
import { useSession } from "next-auth/react";
import ProductUploadForm from "../components/ProductUploadForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock, Loader2, Home } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Admin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState<string | null>(null);

  const isAdmin = session?.user?.role === "Admin";

  useEffect(() => {
    if (status === "unauthenticated" || !isAdmin) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }

    const editProductId = searchParams.get("edit");
    if (editProductId) {
      setProductId(editProductId);
    }
  }, [isAdmin, status, router, searchParams]);

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

  return <ProductUploadForm productId={productId||undefined} />;
}
```

```tsx
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
                <Edit className="w-5 h-5 mr-2" />
                Edit
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```