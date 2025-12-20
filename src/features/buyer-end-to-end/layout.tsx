"use client";

import React from "react";
import { Header } from "./Header";

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 px-10 relative text-[#020617]">
    
      <Header />

      {/* Main content area */}
      <main className="">{children}</main>
    </div>
  );
}