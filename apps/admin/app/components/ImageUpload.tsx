/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadService } from "../lib/upload/upload-service"; // fix path if needed

interface ImageUploadProps {
  onUploadSuccess: (urls: string | string[]) => void;
  onUploadError?: (error: Error) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  existingImages?: string[];
  className?: string;
  label?: string;
  required?: boolean;
}

interface UploadingFile {
  file: File;
  preview: string;
  progress: number;
}

export default function ImageUpload({
  onUploadSuccess,
  onUploadError,
  multiple = true,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  existingImages = [],
  className = "",
  label = "Upload Images",
  required = false,
}: ImageUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null); // full response for phone debugging

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      setError(
        `File "${file.name}" is too large. Max size: ${maxSize / (1024 * 1024)}MB`
      );
      return false;
    }
    if (!acceptedTypes.includes(file.type)) {
      setError(
        `File "${file.name}" type not supported. Accepted: ${acceptedTypes.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const currentCount = existingImages.length + uploadingFiles.length;

    if (currentCount + fileArray.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images total.`);
      return;
    }

    const validFiles = fileArray.filter(validateFile);
    if (validFiles.length === 0) return;

    const newUploadingFiles: UploadingFile[] = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);
    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setDebugInfo(null);

    try {
      let uploadedUrls: string[] = [];

      if (multiple && validFiles.length > 1) {
        const response = await uploadService.uploadFiles(validFiles);
        setDebugInfo(JSON.stringify(response, null, 2)); // show full response
        uploadedUrls = Array.isArray(response) ? response : [];
      } else {
        const uploadPromises = validFiles.map(async (file) => {
          const progressInterval = setInterval(() => {
            setUploadingFiles((prev) =>
              prev.map((uf) =>
                uf.file === file
                  ? { ...uf, progress: Math.min(uf.progress + 15, 90) }
                  : uf
              )
            );
          }, 120);

          try {
            const url = await uploadService.uploadFile(file);
            clearInterval(progressInterval);
            setUploadingFiles((prev) =>
              prev.map((uf) =>
                uf.file === file ? { ...uf, progress: 100 } : uf
              )
            );
            return url;
          } catch (err) {
            clearInterval(progressInterval);
            throw err;
          }
        });

        uploadedUrls = (await Promise.all(uploadPromises)).filter(
          Boolean
        ) as string[];
        setDebugInfo(JSON.stringify(uploadedUrls, null, 2));
      }

      const validNewUrls = uploadedUrls.filter(
        (url): url is string => typeof url === "string" && url.trim() !== ""
      );

      if (validNewUrls.length === 0) {
        throw new Error("Upload succeeded but no valid URLs were returned");
      }

      const finalUrls = [...existingImages, ...validNewUrls];
      onUploadSuccess(multiple ? finalUrls : finalUrls[0] || "");

      setSuccess(
        `Successfully uploaded ${validNewUrls.length} image${
          validNewUrls.length > 1 ? "s" : ""
        }`
      );

      setTimeout(() => {
        setUploadingFiles([]);
      }, 600);
    } catch (err: any) {
      const errorMsg =
        err?.message ||
        err?.data?.message ||
        (typeof err === "string" ? err : "Failed to upload image(s)");

      // Show as much detail as possible on screen
      const fullError = {
        message: errorMsg,
        status: err?.status,
        data: err?.data,
      };

      setError(errorMsg);
      setDebugInfo(JSON.stringify(fullError, null, 2));
      onUploadError?.(err as Error);
      setUploadingFiles([]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      uploadFiles(files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    uploadFiles(files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const removeImage = (index: number) => {
    const newUrls = existingImages.filter((_, i) => i !== index);
    onUploadSuccess(multiple ? newUrls : newUrls[0] || "");
  };

  const removeUploading = (index: number) => {
    const fileToRemove = uploadingFiles[index];
    if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const remainingSlots =
    maxFiles - (existingImages.length + uploadingFiles.length);

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && existingImages.length === 0 && (
            <span className="text-red-500 ml-1">*</span>
          )}
          {multiple && (
            <span className="text-xs text-gray-400 ml-2">
              (Max {maxFiles} files)
            </span>
          )}
        </label>
      )}

      {(!multiple || remainingSlots > 0) && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
            isUploading
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(",")}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />

          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 font-medium">
            Click or drag {multiple ? "images" : "an image"} here to upload
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {acceptedTypes
              .map((t) => t.replace("image/", "").toUpperCase())
              .join(", ")}{" "}
            • Max {maxSize / (1024 * 1024)}MB
            {multiple &&
              ` • ${remainingSlots} slot${remainingSlots !== 1 ? "s" : ""} left`}
          </p>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700">Upload failed</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* DEBUG / FULL RESPONSE (very useful on phone) */}
      {debugInfo && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-700 mb-1">
            Debug response:
          </p>
          <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all">
            {debugInfo}
          </pre>
        </div>
      )}

      {(existingImages.length > 0 || uploadingFiles.length > 0) && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-gray-700">
              {existingImages.length} of {maxFiles} image(s) uploaded
            </p>
            {uploadingFiles.length > 0 && (
              <p className="text-xs text-blue-600">
                Uploading {uploadingFiles.length} file(s)...
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.map((url, index) => (
              <div
                key={`uploaded-${index}`}
                className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
              >
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {uploadingFiles.map((file, index) => (
              <div
                key={`uploading-${index}`}
                className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
              >
                <img
                  src={file.preview}
                  alt={`Uploading ${file.file.name}`}
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                    <span className="text-white text-sm font-medium">
                      {file.progress}%
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeUploading(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}