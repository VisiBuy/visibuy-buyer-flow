"use client";

import React from "react";
import { Header } from "./Header";

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] p-6 lg:px-10 px-5  text-[#020617]">
      <Header />
      <main className="">{children}</main>
    </div>
  );
}
