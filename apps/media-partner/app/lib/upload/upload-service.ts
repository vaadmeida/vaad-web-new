// app/lib/services/upload-service.ts
import { apiClient } from "@/app/lib/api/client";

export interface SingleUploadResponse {
  fileUrl: string;
}

export interface MultipleUploadResponse {
  fileUrls: string[];
}

export class UploadService {
  private readonly baseUrl = '/files';

  // Single file upload - FIXED to return the actual URL string
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<SingleUploadResponse>(
      `${this.baseUrl}/uploads`,
      formData
    );

    // Extract the URL from the object
    return response.fileUrl || "";
  }

  // Multiple files upload
  async uploadFiles(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await apiClient.post<MultipleUploadResponse>(
      `${this.baseUrl}/uploads/many`,
      formData
    );

    return response.fileUrls || [];
  }

  // Delete file (optional)
  async deleteFile(fileKey: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`${this.baseUrl}/uploads/${fileKey}`);
  }
}

export const uploadService = new UploadService();