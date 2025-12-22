// services/verificationService.ts
import {
  ApiError,
  CreateVerificationRequest,
  VerificationResponse,
} from "@/types/verificationServiceTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Define but don't export here
interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class VerificationService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use default message
      }

      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error("Invalid response from server");
    }
  }

  async createVerification(
    data: CreateVerificationRequest,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<VerificationResponse> {
    const formData = new FormData();

    // Append text fields
    formData.append("productTitle", data.productTitle);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("escrowEnabled", data.escrowEnabled.toString());
    formData.append("expiresAt", data.expiresAt);

    // Append files
    data.files.forEach((file, index) => {
      formData.append("files", file, file.name);
    });

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.open("POST", `${API_BASE_URL}/verifications`);

        xhr.setRequestHeader("Accept", "application/json");

        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (onProgress && event.lengthComputable) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(
                new Error(
                  errorData.message ||
                    `Request failed with status ${xhr.status}`
                )
              );
            } catch {
              reject(new Error(`Request failed with status ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network error occurred"));
        };

        xhr.ontimeout = () => {
          reject(new Error("Request timed out"));
        };

        // Set timeout to 2 minutes (120000 ms)
        xhr.timeout = 120000;

        xhr.send(formData);
      });
    } catch (error) {
      console.error("Error creating verification:", error);
      throw error;
    }
  }

  async getVerification(id: string): Promise<VerificationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/verifications/${id}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      return await this.handleResponse<VerificationResponse>(response);
    } catch (error) {
      console.error("Error fetching verification:", error);
      throw error;
    }
  }

  async uploadAdditionalMedia(
    verificationId: string,
    files: File[],
    onProgress?: (progress: UploadProgress) => void
  ): Promise<VerificationResponse> {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append("files", file, file.name);
    });

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.open(
          "POST",
          `${API_BASE_URL}/verifications/${verificationId}/media`
        );

        xhr.setRequestHeader("Accept", "application/json");

        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (onProgress && event.lengthComputable) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(
                new Error(
                  errorData.message ||
                    `Request failed with status ${xhr.status}`
                )
              );
            } catch {
              reject(new Error(`Request failed with status ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network error occurred"));
        };

        xhr.ontimeout = () => {
          reject(new Error("Request timed out"));
        };

        // Set timeout to 2 minutes (120000 ms)
        xhr.timeout = 120000;

        xhr.send(formData);
      });
    } catch (error) {
      console.error("Error uploading additional media:", error);
      throw error;
    }
  }

  async submitBuyerInfo(
    verificationId: string,
    buyerInfo: {
      fullName: string;
      email: string;
      phoneNumber: string;
      address: string;
      date: string;
      country: string;
    }
  ): Promise<VerificationResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/verifications/${verificationId}/buyer-info`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buyerInfo),
        }
      );

      return await this.handleResponse<VerificationResponse>(response);
    } catch (error) {
      console.error("Error submitting buyer info:", error);
      throw error;
    }
  }

  async rejectVerification(
    verificationId: string,
    rejectionData: {
      reason: string;
      comment?: string;
    }
  ): Promise<VerificationResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/verifications/${verificationId}/reject`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rejectionData),
        }
      );

      return await this.handleResponse<VerificationResponse>(response);
    } catch (error) {
      console.error("Error rejecting verification:", error);
      throw error;
    }
  }

  async approveVerification(
    verificationId: string
  ): Promise<VerificationResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/verifications/${verificationId}/approve`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      return await this.handleResponse<VerificationResponse>(response);
    } catch (error) {
      console.error("Error approving verification:", error);
      throw error;
    }
  }
}

export const verificationService = new VerificationService();
export type { CreateVerificationRequest, VerificationResponse, UploadProgress };