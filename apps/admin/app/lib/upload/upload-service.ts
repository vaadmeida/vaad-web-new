// app/lib/services/upload-service.ts  (or wherever it actually lives)
import { apiClient } from "@/app/lib/api/client";

export interface SingleUploadResponse {
  fileUrl: string;
}

export interface MultipleUploadResponse {
  fileUrls: string[];
}

export class UploadService {
  // Single source of truth for the path
  private readonly singleUploadPath = "/files/uploads";
  private readonly multipleUploadPath = "/files/uploads/many";

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<SingleUploadResponse>(
      this.singleUploadPath,
      formData
    );

    return response?.fileUrl ?? "";
  }

  async uploadFiles(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await apiClient.post<MultipleUploadResponse>(
      this.multipleUploadPath,
      formData
    );

    return response?.fileUrls ?? [];
  }

  async deleteFile(fileKey: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/files/uploads/${fileKey}`);
  }
}

export const uploadService = new UploadService();