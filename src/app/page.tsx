import PaymentEscrowStatus from "@/features/buyer-end-to-end/PaymentEscrowStatus";
import VerificationMedia from "@/features/buyer-end-to-end/VerificationMedia";
import { HomeHero } from "@/features/home";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      {/* <HomeHero /> */}
      <VerificationMedia />
      <PaymentEscrowStatus />
    </main>
  );
}
