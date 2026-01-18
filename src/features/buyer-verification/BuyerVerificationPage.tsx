"use client";

import { useEffect, useState } from "react";
import VerificationStage from "./sections/VerificationStage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

type VerificationResponse = {
  id: string;
  productTitle: string;
  description: string;
  status: string;
  publicToken: string;
  escrowEnabled: boolean;
  price: string;
  createdAt: string;
  expiresAt: string | null;
  media: {
    id: string;
    type: "image" | "video";
    storagePath: string;
    thumbnailPath: string;
    hash: string;
    watermarkVersion: string | null;
    uploadedAt: string;
    processedAt: string | null;
    verificationId: string;
    disputeId: string | null;
  }[];
  seller: {
    id: string;
    name: string;
    trustScore: number;
    approvalRate: number;
    image: string | null;
  } | null;
};

export default function BuyerVerificationPage({
  verificationId,
}: {
  verificationId: string;
}) {
  const [data, setData] = useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVerification() {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = API_BASE_URL;
        if (!baseUrl) {
          console.log(baseUrl)
          throw new Error("API_BASE_URL is not configured");
        }

        const res = await fetch(
          `${baseUrl}/verifications/public/${verificationId}`
        );

        if (!res.ok) {
          throw new Error("Failed to load verification");
        }

        const json = (await res.json()) as VerificationResponse;
        setData(json);
      } catch (err: any) {
        console.error("Error loading verification:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadVerification();
  }, [verificationId]);

  if (loading) {
    return (
      <div className="py-24 text-center text-sm">
        Loading verification…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-24 text-center text-sm text-red-600">
        Verification not found
      </div>
    );
  }

  return (
    <VerificationStage
      // escrowEnabled={data.escrowEnabled}
      verification={data}
    />
  );
}
