/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useImageUpload.ts
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/app/contexts/toast-context";
import { uploadService } from "../lib/upload/upload-service";

interface UseImageUploadOptions {
  maxSize?: number;
  acceptedTypes?: string[];
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

interface UseImageUploadReturn {
  upload: (file: File) => Promise<string | null>;
  isUploading: boolean;
  progress: number;
  error: string | null;
  clearError: () => void;
  reset: () => void;
  validateFile: (file: File) => boolean;
  previewUrl: string | null;
  clearPreview: () => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const {
    maxSize = 5 * 1024 * 1024,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    onSuccess,
    onError,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { showToast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    if (file.size > maxSize) {
      const errorMsg = `File "${file.name}" is too large. Max size: ${maxSize / (1024 * 1024)}MB`;
      setError(errorMsg);
      showToast?.({ type: 'error', message: errorMsg, duration: 3000 });
      return false;
    }

    if (!acceptedTypes.includes(file.type)) {
      const errorMsg = `File "${file.name}" type not supported. Accepted: ${acceptedTypes.join(', ')}`;
      setError(errorMsg);
      showToast?.({ type: 'error', message: errorMsg, duration: 3000 });
      return false;
    }

    return true;
  }, [maxSize, acceptedTypes, showToast]);

  const createPreview = useCallback((file: File): string => {
    return URL.createObjectURL(file);
  }, []);

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const upload = useCallback(async (file: File): Promise<string | null> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setError(null);
    setProgress(0);
    clearPreview();

    if (!validateFile(file)) return null;
    
    const preview = createPreview(file);
    setPreviewUrl(preview);

    setIsUploading(true);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const url = await uploadService.uploadFile(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      showToast?.({ type: 'success', message: 'Image uploaded successfully!', duration: 3000 });
      onSuccess?.(url);
      
      return url;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to upload image';
      setError(errorMsg);
      showToast?.({ type: 'error', message: errorMsg, duration: 3000 });
      onError?.(err);
      clearPreview();
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [validateFile, createPreview, clearPreview, showToast, onSuccess, onError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setProgress(0);
    setIsUploading(false);
    clearPreview();
  }, [clearPreview]);

  useEffect(() => {
    return () => {
      clearPreview();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [clearPreview]);

  return {
    upload,
    isUploading,
    progress,
    error,
    clearError,
    reset,
    validateFile,
    previewUrl,
    clearPreview,
  };
}