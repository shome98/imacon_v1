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
          price: 10,
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
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl  bg-gray-300 shadow-lg rounded-lg p-6 flex flex-col overflow-auto"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">Upload Product</h2>

        <div className="space-y-4 flex-1 overflow-auto">
          <div>
            <label className="block font-medium mb-1  text-gray-700">Product Name</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none text-gray-700 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Description</label>
            <textarea
              className={`w-full px-3 py-2 border rounded-md focus:outline-none text-gray-700 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex flex-col items-center">
            <label className="block font-medium mb-1 text-gray-700">Product Image</label>
            <FileUpload onSuccess={handleUploadSuccess} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 text-center">Image Variants</h3>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="bg-gray-100 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <button
            type="button"
            onClick={() => append({ type: "SQUARE", price: 10, license: "Personal" })}
            className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-1" /> Add Variant
          </button>
        </div>

        <div className="sticky bottom-0 py-3  flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            disabled={loading}
          >
            {loading && <Loader2 size={18} className="mr-2 animate-spin" />}
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}