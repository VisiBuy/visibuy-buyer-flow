// In your types/verificationServiceTypes.ts file

export interface VerificationResponse {
  id: string;
  verificationNumber: string;
  status: 'pending' | 'verified' | 'rejected' | 'approved' | 'payment_pending' | 'completed';
  productTitle: string;
  description: string;
  price: number; // Price in cents
  escrowEnabled: boolean;
  expiresAt: string;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
  
  // Seller information
  sellerName?: string;
  sellerImage?: string;
  sellerEmail?: string;
  
  // Seller metrics
  trustScore?: number; // e.g., 98/100
  totalSales?: number;
  responseTime?: string; // e.g., "2 hours"
  
  // Payment information
  paymentStatus?: 'pending' | 'secured' | 'released' | 'paid';
  paymentUrl?: string;
  paymentMethod?: string;
  
  // Shipping information
  shippingStatus?: 'not_shipped' | 'shipped' | 'delivered';
  shippingAddress?: string;
  shippingDate?: string;
  deliveryDate?: string;
  
  // Dispute information
  disputeStatus?: 'none' | 'open' | 'resolved';
  disputeReason?: string;
  
  // Buyer information (for escrow verifications)
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
  buyerCountry?: string;
  
  // Security features
  requiresVerificationCode?: boolean;
  verificationCodeSent?: boolean;
  
  // Additional metadata
  category?: string;
  condition?: string;
  location?: string;
  tags?: string[];
  
  // Flags for UI
  isPaymentSecured?: boolean;
  isSellerNotified?: boolean;
  isItemShipped?: boolean;
  isItemDelivered?: boolean;
  isPaymentReleased?: boolean;
  isSellerPaid?: boolean;
}

export interface CreateVerificationRequest {
  productTitle: string;
  description: string;
  price: number;
  escrowEnabled: boolean;
  expiresAt: string;
  files: File[];
}

export interface ApiError {
  message: string;
  statusCode: number;
  errorCode?: string;
  timestamp?: string;
  path?: string;
  method?: string;
  requestId?: string;
}