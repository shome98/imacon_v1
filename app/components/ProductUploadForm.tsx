"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useNotification } from "./NotificationPopup";
import { IMAGE_VARIANTS, ImageVariantType } from "@/models/Product.model";
import { apiClient, ProductFormData } from "@/lib/server_actions";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function ProductUploadForm() {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      variants: [
        {
          type: "SQUARE" as ImageVariantType,
          price: 9.99,
          license: "Personal",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("imageUrl", response.filePath);
    showNotification("Image uploaded successfully!", "success");
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await apiClient.createProduct(data);
      showNotification("Product created successfully!", "success");

      // Reset form after submission
      setValue("name", "");
      setValue("description", "");
      setValue("imageUrl", "");
      setValue("variants", [
        {
          type: "SQUARE" as ImageVariantType,
          price: 9.99,
          license: "Personal",
        },
      ]);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to create product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
      <div>
        <label className="block font-medium mb-1">Product Name</label>
        <input
          type="text"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block font-medium mb-1">Product Image</label>
        <FileUpload onSuccess={handleUploadSuccess} />
      </div>

      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold">Image Variants</h3>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="bg-gray-100 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Size & Aspect Ratio</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                {...register(`variants.${index}.type`)}
              >
                {Object.entries(IMAGE_VARIANTS).map(([key, value]) => (
                  <option key={key} value={value.type}>
                    {value.label} ({value.dimensions.width}x{value.dimensions.height})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">License</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                {...register(`variants.${index}.license`)}
              >
                <option value="personal">Personal Use</option>
                <option value="commercial">Commercial Use</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="w-full px-3 py-2 border rounded-md"
                {...register(`variants.${index}.price`, {
                  valueAsNumber: true,
                  required: "Price is required",
                  min: { value: 0.01, message: "Price must be greater than 0" },
                })}
              />
              {errors.variants?.[index]?.price && (
                <p className="text-red-500 text-sm mt-1">{errors.variants[index]?.price?.message}</p>
              )}
            </div>

            <div className="flex items-end">
              <button
                type="button"
                className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md flex items-center gap-2"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md flex items-center gap-2"
        onClick={() =>
          append({
            type: "SQUARE",
            price: 9.99,
            license: "Personal",
          })
        }
      >
        <Plus className="w-4 h-4" />
        Add Variant
      </button>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md flex justify-center items-center gap-2"
        disabled={loading}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Submitting..." : "Submit Product"}
      </button>
    </form>
  );
}
