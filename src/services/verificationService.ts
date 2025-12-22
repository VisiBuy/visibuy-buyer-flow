// services/verificationService.ts
import {
  ApiError,
  CreateVerificationRequest,
  VerificationResponse,
} from "@/types/verificationServiceTypes";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://visibuy-staging-api.onrender.com/api/v1";

console.log("API_BASE_URL:", API_BASE_URL);

export interface UploadProgress {
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
        console.error("API Error:", errorData);
      } catch {
        console.error("Failed to parse error response");
      }

      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error("Failed to parse response:", error);
      throw new Error("Invalid response from server");
    }
  }

  // GET verification by public token (NO AUTH NEEDED)
  async getVerificationByToken(
    publicToken: string
  ): Promise<VerificationResponse> {
    try {
      const url = `${API_BASE_URL}/verifications/public/${publicToken}`;
      console.log("Fetching verification from URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      return await this.handleResponse<VerificationResponse>(response);
    } catch (error) {
      console.error("Error fetching verification:", error);
      throw error;
    }
  }

  // Approve verification (public endpoint)
  async approveVerification(
    publicToken: string
  ): Promise<VerificationResponse> {
    try {
      const url = `${API_BASE_URL}/verifications/public/${publicToken}/approve`;
      console.log("Approving verification:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      return await this.handleResponse<VerificationResponse>(response);
    } catch (error) {
      console.error("Error approving verification:", error);
      throw error;
    }
  }

  // Reject verification (public endpoint)
  async rejectVerification(
    publicToken: string,
    rejectionData: {
      reason: string;
      comment?: string;
    }
  ): Promise<VerificationResponse> {
    try {
      const url = `${API_BASE_URL}/verifications/public/${publicToken}/reject`;
      console.log("Rejecting verification:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rejectionData),
      });

      return await this.handleResponse<VerificationResponse>(response);
    } catch (error) {
      console.error("Error rejecting verification:", error);
      throw error;
    }
  }

  // Submit buyer info for escrow (public endpoint)
  async submitBuyerInfo(
    publicToken: string,
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
      const url = `${API_BASE_URL}/verifications/public/${publicToken}/buyer-info`;
      console.log("Submitting buyer info:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buyerInfo),
      });

      return await this.handleResponse<VerificationResponse>(response);
    } catch (error) {
      console.error("Error submitting buyer info:", error);
      throw error;
    }
  }

  // Request payment (for escrow) - public endpoint
  async requestPayment(
    publicToken: string,
    paymentData?: any
  ): Promise<{ paymentUrl: string }> {
    try {
      const url = `${API_BASE_URL}/verifications/public/${publicToken}/request-payment`;
      console.log("Requesting payment:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: paymentData ? JSON.stringify(paymentData) : undefined,
      });

      return await this.handleResponse<{ paymentUrl: string }>(response);
    } catch (error) {
      console.error("Error requesting payment:", error);
      throw error;
    }
  }

  // Upload additional media (public endpoint)
  async uploadAdditionalMedia(
    publicToken: string,
    files: File[],
    onProgress?: (progress: UploadProgress) => void
  ): Promise<VerificationResponse> {
    const formData = new FormData();

    files.forEach((file, index) => {
      console.log(
        `Appending additional file ${index}:`,
        file.name,
        file.type,
        file.size
      );
      formData.append("files", file, file.name);
    });

    try {
      const xhr = new XMLHttpRequest();

      const url = `${API_BASE_URL}/verifications/public/${publicToken}/media`;
      console.log("POST URL for additional media:", url);

      return new Promise((resolve, reject) => {
        xhr.open("POST", url);

        xhr.setRequestHeader("Accept", "application/json");

        xhr.upload.onprogress = (event) => {
          console.log(
            "Additional media upload progress:",
            event.loaded,
            "of",
            event.total
          );
          if (onProgress && event.lengthComputable) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            });
          }
        };

        xhr.onload = () => {
          console.log("Response status for additional media:", xhr.status);

          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              console.log("Additional media success:", response);
              resolve(response);
            } catch (error) {
              console.error(
                "Failed to parse additional media response:",
                error
              );
              reject(new Error("Failed to parse response from server"));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              console.error("Additional media error:", errorData);
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
          console.error("Additional media XHR error");
          reject(new Error("Network error occurred"));
        };

        xhr.ontimeout = () => {
          console.error("Additional media XHR timeout");
          reject(new Error("Request timed out"));
        };

        xhr.timeout = 120000;

        console.log("Sending additional media request...");
        xhr.send(formData);
      });
    } catch (error) {
      console.error("Error uploading additional media:", error);
      throw error;
    }
  }
}

export const verificationService = new VerificationService();
export type { CreateVerificationRequest, VerificationResponse, };
