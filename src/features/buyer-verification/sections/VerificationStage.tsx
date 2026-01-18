"use client";

import { useState } from "react";

import { BuyerTopNav } from "../components/BuyerTopNav";
import { VerificationStepper } from "../components/VerificationStepper";
import { SellerCard } from "../components/SellerCard";
import { MediaGallery } from "../components/MediaGallery";
import { ProductSummary } from "../components/ProductSummary";
import { EscrowInfo } from "../components/EscrowInfo";
import { VerificationActions } from "../components/VerificationActions";

import { ViewFullMediaModal } from "../modals/ViewFullMediaModal";
import { VerificationCompleteModal } from "../modals/VerificationCompleteModal";
import { RejectVerificationModal } from "../modals/RejectVerificationModal";
import { EscrowPaymentPromptModal } from "../modals/EscrowPaymentPromptModal";
import { BuyerInfoModal } from "../modals/BuyerInfoModal";
import { BuyerOrderModal } from "../modals/BuyerOrderModal";
import { FlutterwavePaymentModal } from "../modals/FlutterwavePaymentModal";
import { ReleasePaymentCodeModal } from "../modals/ReleasePaymentCodeModal";
import { OpenDisputeModal } from "../modals/OpenDisputeModal";
import { BuyerFooter } from "../components/BuyerFooter";
import { ConsentBanner } from "../components/ConsentBanner";

type VerificationMedia = {
  id: string;
  type: "image" | "video";
  storagePath: string;
  thumbnailPath: string;
  uploadedAt?: string;
};

type VerificationSeller = {
  id: string;
  name: string;
  trustScore: number;
  approvalRate: number;
  image: string | null;
};

type VerificationPublicResponse = {
  id: string;
  productTitle: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  publicToken: string;
  escrowEnabled: boolean;
  price: string;
  createdAt: string;
  expiresAt: string | null;
  media: VerificationMedia[];
  seller: VerificationSeller;
};

type VerificationStageProps = {
  verification: VerificationPublicResponse;
  escrowEnabled?: boolean; // keep this so you can override if you want
};

type Status = "verifying" | "approved" | "rejected";
type StepKey = "verification" | "payment" | "confirmation";

type EscrowFlow = "unpaid" | "secured" | "released" | "disputed_under_review";

export default function VerificationStage({
  verification,
  escrowEnabled,
}: VerificationStageProps) {
  const escrowOn = escrowEnabled ?? verification.escrowEnabled;

  const [status, setStatus] = useState<Status>(() =>
    mapApiStatusToUi(verification.status)
  );

  const [viewFullOpen, setViewFullOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false); // non-escrow approval
  const [rejectOpen, setRejectOpen] = useState(false);
  const [escrowPromptOpen, setEscrowPromptOpen] = useState(false);

  // 2-step buyer flow
  const [buyerStep1Open, setBuyerStep1Open] = useState(false);
  const [buyerStep2Open, setBuyerStep2Open] = useState(false);
  const [buyerDraft, setBuyerDraft] = useState<
    Record<string, FormDataEntryValue> | null
  >(null);

  // Flutterwave modal + escrow flow state
  const [flutterwaveOpen, setFlutterwaveOpen] = useState(false);
  const [escrowTxRef, setEscrowTxRef] = useState<string | null>(null);
  const [escrowFlow, setEscrowFlow] = useState<EscrowFlow>("unpaid");

  // Release payment + dispute
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeInfo, setDisputeInfo] = useState<null | {
    reason?: string;
    details?: string;
    evidenceCount?: number;
  }>(null);

  // Payment context once buyer/order info is collected
  const [paymentContext, setPaymentContext] = useState<null | {
    buyer: { fullName: string; email: string; phone: string };
    order: {
      amount: number;
      currency: "NGN";
      verificationId: string;
      title: string;
      description: string;
      productTitle: string;
      productDescription: string;
    };
  }>(null);

  const [rejectionInfo, setRejectionInfo] = useState<{
    reason: string;
    comment?: string;
  } | null>(null);

  // ===== DATA WIRED FROM API (NO CSS CHANGES) =====
  const itemName = verification.productTitle;
  const itemColour = ""; // keep for now (you don’t have it in the API body)
  const verificationId = shortCodeFromToken(verification.publicToken);
  const price = String(verification.price ?? "0"); // numeric string
  const currency: "NGN" = "NGN";

  const priceDisplay = `₦${Number(price).toLocaleString()}`;

  const timestamp = formatStampDDMMYYYY(verification.createdAt);

  const { mainMedia, thumbnails } = buildMediaForGallery(verification.media);

  /** STEP LOGIC **/
  const activeStep: StepKey = (() => {
    if (!escrowOn) {
      if (status === "verifying") return "verification";
      return "confirmation";
    }

    // escrow enabled
    if (status === "verifying") return "verification";
    if (status === "rejected") return "confirmation";

    // escrow enabled + approved
    if (status === "approved") {
      // once escrow is released or dispute submitted → go to confirmation step
      if (escrowFlow === "released" || escrowFlow === "disputed_under_review") {
        return "confirmation";
      }
      return "payment";
    }

    return "verification";
  })();

  /** ACTION HANDLERS **/
  const handleApprove = () => {
    if (escrowOn) {
      setEscrowPromptOpen(true);
    } else {
      setStatus("approved");
      setCompleteOpen(true);
    }
  };

  const handleRejectClick = () => setRejectOpen(true);

  const handleRejectConfirm = (payload: { reason: string; comment?: string }) => {
    setRejectionInfo(payload);
    setStatus("rejected");
    setRejectOpen(false);
  };

  const handleEscrowContinue = () => {
    setEscrowPromptOpen(false);
    setStatus("approved"); // move into payment step
    setEscrowFlow("unpaid");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <BuyerTopNav />

      <VerificationStepper escrowEnabled={escrowOn} activeStep={activeStep} />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-24">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)] lg:items-start">
          <section className="space-y-6 rounded-2xl bg-white p-4 sm:p-6 lg:p-7 shadow-sm">
            <MediaGallery
              mainMedia={mainMedia}
              thumbnails={thumbnails}
              timestamp={timestamp}
              onViewFullMedia={() => setViewFullOpen(true)}
            />

            <ProductSummary
              title={itemName}
              verificationNumber={verificationId}
              price={priceDisplay}
            />

            <EscrowInfo escrowEnabled={escrowOn} />

            {status === "verifying" ? (
              <VerificationActions
                onApprove={handleApprove}
                onReject={handleRejectClick}
              />
            ) : escrowOn && status === "approved" ? (
              // ESCROW PATH (approved)
              paymentContext ? (
                escrowFlow === "secured" ? (
                  <EscrowPostPaymentPanel
                    amount={paymentContext.order.amount}
                    currency={paymentContext.order.currency}
                    escrowFeeRate={0.025}
                    buyerName={paymentContext.buyer.fullName}
                    buyerEmail={paymentContext.buyer.email}
                    txRef={escrowTxRef ?? undefined}
                    onRelease={() => setReleaseModalOpen(true)}
                    onDispute={() => setDisputeOpen(true)}
                  />
                ) : escrowFlow === "released" ? (
                  <EscrowConfirmationPanel kind="released" />
                ) : escrowFlow === "disputed_under_review" ? (
                  <EscrowConfirmationPanel kind="disputed" />
                ) : (
                  <EscrowPaymentSummary onProceed={() => setBuyerStep1Open(true)} />
                )
              ) : (
                <EscrowPaymentSummary onProceed={() => setBuyerStep1Open(true)} />
              )
            ) : (
              // NON-ESCROW + REJECTED PATHS
              <ConfirmationSummary status={status} rejectionInfo={rejectionInfo} />
            )}
          </section>

          <SellerCard
            name={verification.seller?.name ?? "Seller"}
            trustScore={`${verification.seller?.trustScore ?? 0}/100`}
            // totalApprovals={`${verification.seller?.approvalRate ?? 0}%`}
          />
        </div>
      </main>

      <BuyerFooter />
      <ConsentBanner />

      {/* View full media */}
      <ViewFullMediaModal
        open={viewFullOpen}
        onClose={() => setViewFullOpen(false)}
        mainMedia={mainMedia}
        thumbnails={thumbnails}
      />

      {/* Non-escrow approval modal */}
      <VerificationCompleteModal
        open={completeOpen}
        onClose={() => setCompleteOpen(false)}
      />

      {/* Reject flow */}
      <RejectVerificationModal
        open={rejectOpen}
        onCancel={() => setRejectOpen(false)}
        onConfirm={handleRejectConfirm}
        itemName={itemName}
        colour={itemColour}
        verificationId={verificationId}
      />

      {/* Escrow prompt modal */}
      <EscrowPaymentPromptModal
        open={escrowPromptOpen}
        onCancel={() => setEscrowPromptOpen(false)}
        onContinue={handleEscrowContinue}
      />

      {/* Buyer Step 1 */}
      <BuyerInfoModal
        open={buyerStep1Open}
        onCancel={() => {
          setBuyerStep1Open(false);
          setBuyerDraft(null);
        }}
        onNext={(payload) => {
          setBuyerDraft(payload);
          setBuyerStep1Open(false);
          setBuyerStep2Open(true);
        }}
      />

      {/* Buyer Step 2 */}
      <BuyerOrderModal
        open={buyerStep2Open}
        onCancel={() => {
          setBuyerStep2Open(false);
          setBuyerDraft(null);
        }}
        onBack={() => {
          setBuyerStep2Open(false);
          setBuyerStep1Open(true);
        }}
        productTitle={itemName}
        productDescription={verification.description}
        amount={price}
        onSubmit={(orderPayload) => {
          const fullPayload = {
            ...(buyerDraft ?? {}),
            ...orderPayload,
          };

          const buyer = {
            fullName: String(fullPayload.fullName ?? ""),
            email: String(fullPayload.email ?? ""),
            phone: String(fullPayload.phone ?? ""),
          };

          const order = {
            amount: Number(fullPayload.amount ?? price),
            currency,
            verificationId,
            title: "Visibuy Escrow Payment",
            description: "Payment is held securely until you confirm delivery.",
            productTitle: String(fullPayload.productTitle ?? itemName),
            productDescription: String(
              fullPayload.productDescription ?? verification.description
            ),
          };

          setPaymentContext({ buyer, order });

          setBuyerStep2Open(false);
          setFlutterwaveOpen(true);
        }}
      />

      {/* Flutterwave modal */}
      {paymentContext && (
        <FlutterwavePaymentModal
          open={flutterwaveOpen}
          onClose={() => setFlutterwaveOpen(false)}
          buyer={paymentContext.buyer}
          order={paymentContext.order}
          onSuccess={(resp) => {
            console.log("Flutterwave response:", resp);
            const txRef =
              (resp as any)?.tx_ref ?? (resp as any)?.transaction_id ?? null;

            setEscrowTxRef(txRef);
            setEscrowFlow("secured"); // 🔐 secured view
            setFlutterwaveOpen(false);
          }}
        />
      )}

      {/* Release payment verification code (sent to email) */}
      {paymentContext && (
        <ReleasePaymentCodeModal
          open={releaseModalOpen}
          email={String(paymentContext.buyer.email ?? "")}
          onCancel={() => setReleaseModalOpen(false)}
          onConfirm={(code) => {
            // simulate verification code
            if (String(code).trim() !== "123456") {
              window.alert('Invalid code. Use "123456" to simulate success.');
              return;
            }

            console.log("Release payment verified with code:", code);

            setReleaseModalOpen(false);
            setEscrowFlow("released"); // ✅ go to confirmation step
          }}
        />
      )}

      {/* Open Dispute Modal */}
      {paymentContext && escrowFlow === "secured" && (
        <OpenDisputeModal
          open={disputeOpen}
          onCancel={() => setDisputeOpen(false)}
          onSubmit={(payload) => {
            const p = payload as any;
            setDisputeInfo({
              reason: p?.reason ?? p?.disputeReason,
              details: p?.details ?? p?.comment ?? p?.description,
              evidenceCount: Array.isArray(p?.evidence)
                ? p.evidence.length
                : undefined,
            });

            console.log("Dispute submitted:", {
              payload,
              itemName,
              verificationId,
              amount: paymentContext.order.amount,
              currency: paymentContext.order.currency,
            });

            setDisputeOpen(false);
            setEscrowFlow("disputed_under_review");
          }}
          itemName={itemName}
          verificationId={verificationId}
          amount={paymentContext.order.amount}
          currency={paymentContext.order.currency}
        />
      )}
    </div>
  );
}

/** Confirmation block shown after approve (non-escrow) or reject (both) */
function ConfirmationSummary({
  status,
  rejectionInfo,
}: {
  status: Status;
  rejectionInfo: { reason: string; comment?: string } | null;
}) {
  if (status === "approved") {
    return (
      <div className="mt-4 rounded-2xl border border-slate-100 bg-[#F9FBFF] px-4 py-3 text-sm text-slate-700">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#28A745]/10 text-xs text-[#28A745]">
            ✓
          </span>
          <span className="font-semibold">Verification completed</span>
        </div>
        <p className="text-xs text-slate-500">
          You approved this item on <span className="font-medium">11 Oct 2025</span>.
          The seller has been notified and this order is now marked as completed on
          Visibuy.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-red-100 bg-[#FEF2F2] px-4 py-3 text-sm text-slate-700">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F87171]/20 text-xs text-[#B91C1C]">
          ✕
        </span>
        <span className="font-semibold text-[#B91C1C]">Verification rejected</span>
      </div>
      <p className="text-xs text-slate-600">
        You rejected this item on <span className="font-medium">11 Oct 2025</span>.
        Your reason has been recorded as:{" "}
        <span className="font-medium">
          {humanizeReason(rejectionInfo?.reason ?? "other")}
        </span>
        .
      </p>
      {rejectionInfo?.comment && (
        <p className="mt-2 text-xs text-slate-500">
          Additional details: <span className="italic">{rejectionInfo.comment}</span>
        </p>
      )}
    </div>
  );
}

/** Escrow payment step summary (before paying) */
function EscrowPaymentSummary({ onProceed }: { onProceed: () => void }) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-100 bg-[#EFF6FF] px-4 py-3 text-sm text-slate-700">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#007BFF]/10 text-xs text-[#007BFF]">
          ⓘ
        </span>
        <span className="font-semibold">Proceed to payment</span>
      </div>
      <p className="text-xs text-slate-600">
        You&apos;ve approved this verification. The next step is to complete payment so
        funds can be securely held in escrow until you confirm delivery.
      </p>
      <button
        type="button"
        onClick={onProceed}
        className="mt-3 h-9 rounded-lg bg-[#007BFF] px-4 text-xs font-semibold text-white hover:bg-[#0065d6]"
      >
        Proceed to Payment
      </button>
    </div>
  );
}

/** Escrow view AFTER payment is secured (show release/dispute buttons) */
function EscrowPostPaymentPanel({
  amount,
  currency,
  escrowFeeRate,
  buyerName,
  buyerEmail,
  txRef,
  onRelease,
  onDispute,
}: {
  amount: number;
  currency: "NGN";
  escrowFeeRate: number; // e.g. 0.025 = 2.5%
  buyerName: string;
  buyerEmail: string;
  txRef?: string;
  onRelease: () => void;
  onDispute: () => void;
}) {
  const fee = amount * escrowFeeRate;
  const total = amount + fee;

  const fmt = (value: number) =>
    `₦${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="mt-4 space-y-4 rounded-2xl border border-slate-100 bg-[#F9FBFF] px-4 py-4 text-sm text-slate-700">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          Payment secured via escrow
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Your payment is now locked in Visibuy escrow. Release it only after you have
          received and inspected the item.
        </p>
      </div>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <div className="space-y-1 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">Transaction Summary</p>
          <div className="flex justify-between">
            <span>Amount</span>
            <span className="font-medium">{fmt(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Escrow fee (2.5%)</span>
            <span className="font-medium">{fmt(fee)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-slate-100 pt-1">
            <span>Total</span>
            <span className="font-semibold text-slate-900">{fmt(total)}</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Status: <span className="font-semibold text-[#16A34A]">Locked</span>
            {txRef && (
              <>
                {" "}
                • Ref: <span className="font-mono">{txRef}</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">Buyer Details</p>
          <p className="font-medium text-slate-900">{buyerName || "—"}</p>
          <p>{buyerEmail || "—"}</p>

          <div className="mt-3 rounded-lg bg-[#E3F7E9] px-3 py-2 text-[11px] text-[#1F6B34]">
            <span className="font-semibold">Tip:</span> If there’s any issue with the
            item, open a dispute instead of releasing payment.
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={onRelease}
          className="h-11 w-full rounded-lg bg-[#007BFF] text-sm font-semibold text-white hover:bg-[#0065d6]"
        >
          Release Payment
        </button>
        <button
          type="button"
          onClick={onDispute}
          className="h-11 w-full rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Open Dispute
        </button>
      </div>
    </div>
  );
}

/** Escrow confirmation state after release OR after dispute submit */
function EscrowConfirmationPanel({
  kind,
}: {
  kind: "released" | "disputed";
}) {
  const approvedAt = "11 Oct 2025";
  const releasedAt = "11 Oct 2025 at 2:30 PM";

  return (
    <div className="mt-4 rounded-2xl border border-slate-100 bg-[#F9FBFF] px-4 py-3 text-sm text-slate-700">
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
            kind === "released"
              ? "bg-[#28A745]/10 text-[#28A745]"
              : "bg-[#F97373]/20 text-[#B91C1C]"
          }`}
        >
          {kind === "released" ? "✓" : "!"}
        </span>
        <span
          className={`font-semibold ${
            kind === "released" ? "text-slate-900" : "text-[#B91C1C]"
          }`}
        >
          {kind === "released" ? "Payment released" : "Dispute submitted"}
        </span>
      </div>

      <p className="text-xs text-slate-600">
        You approved this item on{" "}
        <span className="font-medium">{approvedAt}</span>. The seller was
        notified and the order was secured in Visibuy escrow.
      </p>

      {kind === "released" ? (
        <p className="mt-2 text-xs text-slate-600">
          You released payment on{" "}
          <span className="font-medium">{releasedAt}</span>. Funds have been paid
          out from escrow to the seller and this transaction is now marked as{" "}
          <span className="font-medium">completed on Visibuy</span>.
        </p>
      ) : (
        <p className="mt-2 text-xs text-slate-600">
          A dispute was opened for this transaction. A Visibuy human review will
          step in within <span className="font-medium">24 hours</span> to help
          resolve the issue.
        </p>
      )}
    </div>
  );
}

function humanizeReason(code: string): string {
  switch (code) {
    case "media_mismatch":
      return "Item does not match verification media";
    case "condition_issue":
      return "Item condition differs from description";
    case "missing_accessories":
      return "Missing or wrong accessories";
    case "suspicious_or_fake":
      return "Suspicious / likely counterfeit";
    default:
      return "Other";
  }
}

function mapApiStatusToUi(apiStatus: string): Status {
  // API: approved/rejected/pending
  if (apiStatus === "approved") return "approved";
  if (apiStatus === "rejected") return "rejected";
  return "verifying";
}

function shortCodeFromToken(token: string): string {
  // keeps your UI looking like a short “verification number”
  if (!token) return "—";
  return token.replace(/-/g, "").slice(0, 7).toUpperCase();
}

function formatStampDDMMYYYY(iso: string): string {
  // returns "06-01-2026" (dd-mm-yyyy)
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
}

function buildMediaForGallery(media: VerificationMedia[]) {
  const safe = Array.isArray(media) ? media : [];

  // prefer an image as main if available, otherwise first item
  const main =
    safe.find((m) => m.type === "image") ??
    safe[0] ??
    ({
      id: "main",
      type: "image",
      storagePath: "/placeholder-main.jpg",
      thumbnailPath: "/placeholder-main.jpg",
    } as VerificationMedia);

  const mainMedia = {
    id: main.id ?? "main",
    src: main.storagePath ?? "/placeholder-main.jpg",
    alt: "Verified product",
  };

  const thumbs = safe
    .filter((m) => m.id !== main.id)
    .map((m, idx) => ({
      id: m.id ?? `t${idx + 1}`,
      src: m.thumbnailPath || m.storagePath,
      alt: `Thumbnail ${idx + 1}`,
    }));

  // If backend returns only 1 item, keep at least an empty array (your UI can handle it)
  return { mainMedia, thumbnails: thumbs };
}
