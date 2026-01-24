"use client";

import { useEffect, useState } from "react";
import VerificationStage from "./sections/VerificationStage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

type VerificationResponse = {
  id: string;
  productTitle: string;
  description: string;
  status: string; // raw from API
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

// Optional: keep this helper so status is clean for the UI
function normalizeStatus(status: string): "pending" | "approved" | "rejected" {
  if (status === "pending" || status === "approved" || status === "rejected") {
    return status;
  }
  return "pending";
}

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
          console.log("API_BASE_URL:", baseUrl);
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

  // ------- NEW: centralised API handlers -------

  async function handleApproveApi() {
    if (!data) return;

    const baseUrl = API_BASE_URL;
    if (!baseUrl) {
      throw new Error("API_BASE_URL is not configured");
    }

    const res = await fetch(`${baseUrl}/verifications/public/${verificationId}/approve`, {
      method: "POST", // change to PATCH if your backend uses that
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      let message = "Failed to approve verification.";
      try {
        const json = await res.json();
        if (json?.message) message = json.message;
      } catch {
        // ignore JSON parse error and keep default message
      }
      // 🔴 IMPORTANT: throw so VerificationStage knows it failed
      throw new Error(message);
    }

    // ✅ backend success – keep local state in sync
    setData((prev) => (prev ? { ...prev, status: "approved" } : prev));
  }

  async function handleRejectApi(payload: { reason: string; comment?: string }) {
    if (!data) return;

    const baseUrl = API_BASE_URL;
    if (!baseUrl) {
      throw new Error("API_BASE_URL is not configured");
    }

    const res = await fetch(`${baseUrl}/verifications/public/${verificationId}/reject`, {
      method: "POST", // change to PATCH if needed
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason: payload.reason,
        comment: payload.comment ?? null,
      }),
    });

    if (!res.ok) {
      let message = "Failed to reject verification.";
      try {
        const json = await res.json();
        if (json?.message) message = json.message;
      } catch {
        // ignore JSON parse error
      }
      throw new Error(message);
    }

    setData((prev) => (prev ? { ...prev, status: "rejected" } : prev));
  }

  // --------------------------------------------

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

  // Build the object we pass to the UI
  const verificationForUi = {
    ...data,
    status: normalizeStatus(data.status),
  };

  return (
    <VerificationStage
      escrowEnabled={verificationForUi.escrowEnabled}
      verification={verificationForUi as any}
      onApprove={handleApproveApi}
      onReject={handleRejectApi}
    />
  );
}