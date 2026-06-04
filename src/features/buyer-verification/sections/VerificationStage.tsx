"use client";

import { BrandLogo } from "@/shared/components/ui/BrandLogo";

import { MediaGallery } from "../components/MediaGallery";
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
};

export default function VerificationStage({
verification,
}: VerificationStageProps) {
const verificationShortId = shortCodeFromToken(
verification.publicToken
);

const priceDisplay = `₦${Number(
    verification.price ?? 0
  ).toLocaleString()}`;

const verifiedAtLabel = formatVerificationTimestamp(
verification.createdAt
);

const { mainMedia } = buildMediaForGallery(
verification.media
);

return ( <div className="min-h-screen bg-[#F5F7FB] text-slate-900"> <main className="min-h-screen"> <section className="relative"> <div className="absolute left-4 top-4 z-20"> <BrandLogo
           size={110}
           showTagline={false}
           className="drop-shadow-sm"
         /> </div>

      <MediaGallery
        mainMedia={mainMedia}
      />
    </section>

    <section className="relative z-10 -mt-6 rounded-t-[32px] bg-white px-5 py-6 shadow-sm">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#28A745]/10 text-[#28A745]">
            ✓
          </span>

          <span className="font-semibold text-slate-900">
            Verified Before Payment
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          This recording was created by the seller
          to show the exact item available before
          payment.
        </p>

        <div className="mt-4 space-y-2">
          <p className="text-sm">
            <span className="font-medium">
              Recorded:
            </span>{" "}
            {verifiedAtLabel}
          </p>

          <p className="text-sm">
            <span className="font-medium">
              Seller:
            </span>{" "}
            {verification.seller?.name ??
              "Seller"}
          </p>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <h2 className="text-lg font-semibold">
            {verification.productTitle}
          </h2>

          <p className="mt-1 text-2xl font-bold">
            {priceDisplay}
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Verification ID:{" "}
            {verificationShortId}
          </p>
        </div>
      </div>
    </section>
  </main>

  <ConsentBanner />
</div>

);
}

function shortCodeFromToken(token: string): string {
if (!token) return "—";

return token
.replace(/-/g, "")
.slice(0, 7)
.toUpperCase();
}

function formatVerificationTimestamp(
iso: string
): string {
const createdAt = new Date(iso);

if (Number.isNaN(createdAt.getTime())) {
return "";
}

return createdAt.toLocaleString(undefined, {
day: "2-digit",
month: "short",
year: "numeric",
hour: "numeric",
minute: "2-digit",
hour12: true,
});
}

function buildMediaForGallery(
media: VerificationMedia[]
) {
const safe = Array.isArray(media)
? media
: [];

const main =
safe.find(
(m) => m.type === "video"
) ??
safe[0] ??
({
id: "main",
type: "video",
storagePath:
"/placeholder-main.jpg",
thumbnailPath:
"/placeholder-main.jpg",
} as VerificationMedia);

const mainMedia = {
id: main.id,
src: main.storagePath,
alt: "Verified product",
type: "video" as const,
};

return {
mainMedia,
};
}
