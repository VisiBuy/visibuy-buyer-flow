import BuyerVerificationPage from "@/features/buyer-verification/BuyerVerificationPage";

export default async function Page({
  params,
}: {
  params: Promise<{ verificationId: string }>;
}) {
  const { verificationId } = await params;

  return <BuyerVerificationPage verificationId={verificationId} />;
}