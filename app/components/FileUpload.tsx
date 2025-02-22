"use client";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { Loader2, UploadCloud, AlertCircle } from "lucide-react";

export default function FileUpload({
  onSuccess,
}: {
  onSuccess: (res: IKUploadResponse) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (err: { message: string }) => {
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    setUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

    return (
        <div className="flex flex-col items-center gap-4 bg-white shadow-md rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800">Upload Your Image</h2>

            <div className="w-full">
                <IKUpload
                    id="file-upload"
                    fileName="product-image.jpg"
                    onError={onError}
                    onSuccess={handleSuccess}
                    onUploadStart={handleStartUpload}
                    className="hidden"
                    validateFile={(file: File) => {
                        const validTypes = ["image/jpeg", "image/png", "image/webp"];
                        if (!validTypes.includes(file.type)) {
                            setError("❌ Please upload a valid image (JPEG, PNG, or WebP)");
                            return false;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                            setError("⚠️ File size must be less than 5MB");
                            return false;
                        }
                        return true;
                    }}
                />

                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex items-center gap-2 justify-center bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                >
                    <UploadCloud className="w-5 h-5" />
                    Choose File
                </label>
            </div>

            {uploading && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
