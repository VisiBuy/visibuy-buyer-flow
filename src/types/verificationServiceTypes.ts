export interface CreateVerificationRequest {
  productTitle: string;
  description: string;
  price: number;
  escrowEnabled: boolean;
  expiresAt: string;
  files: File[];
}

export interface VerificationResponse {
  id: string;
  verificationNumber: string;
  status: 'pending' | 'verified' | 'rejected';
  productTitle: string;
  description: string;
  price: number;
  escrowEnabled: boolean;
  expiresAt: string;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}