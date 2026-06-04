"use client";

type SellerTier = "gold" | "silver" | "bronze";

type SellerCardProps = {
  name?: string;
  trustScore?: string; // e.g. "98/100"
};

/** Derive seller tier from trust score */
function getSellerTier(trustScore?: string): SellerTier {
  if (!trustScore) return "bronze";

  const numericScore = Number(trustScore.split("/")[0]);

  if (numericScore >= 80) return "gold";
  if (numericScore >= 50) return "silver";
  return "bronze";
}

export function SellerCard({
  name = "N / A",
  trustScore = "0/100",
}: SellerCardProps) {
  const tier = getSellerTier(trustScore);

  const tierConfig: Record<
    SellerTier,
    { label: string; bg: string; text: string; icon: string }
  > = {
    gold: {
      label: "Gold Seller",
      bg: "bg-amber-50",
      text: "text-amber-700",
      icon: "🥇",
    },
    silver: {
      label: "Silver Seller",
      bg: "bg-slate-50",
      text: "text-slate-600",
      icon: "🥈",
    },
    bronze: {
      label: "Bronze Seller",
      bg: "bg-orange-50",
      text: "text-orange-700",
      icon: "🥉",
    },
  };

  const tierStyle = tierConfig[tier];
  const numericScore = Number(trustScore.split("/")[0]);
  const isNewSeller = numericScore === 0;

  return (
    <aside className="flex flex-col items-center gap-4 rounded-2xl bg-white p-7 text-center shadow-sm">
      {/* Avatar placeholder */}
      <div className="h-24 w-24 rounded-full bg-slate-200" />

      {/* Name */}
      <div className="text-base font-bold">{name}</div>

      {/* Tier badge */}
      <div
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tierStyle.bg} ${tierStyle.text}`}
      >
        <span className="text-sm">{tierStyle.icon}</span>
        <span>{tierStyle.label}</span>
      </div>
      <p className="text-xs text-slate-500">
        {isNewSeller
          ? "New seller on Visibuy"
          : "Trusted seller with verified transactions"}
      </p>
      {/* Trust score */}
      {!isNewSeller && (
        <div className="mt-4 w-full space-y-3">
          <TrustScoreStat value={trustScore} />
        </div>
      )}
    </aside>
  );
}

function TrustScoreStat({ value }: { value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[#F2F5FB] px-3 py-2 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E0ECFF] text-[11px] text-[#1D4ED8]">
          ★
        </span>
        <span>Trust Score</span>
      </div>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
