import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "@/app/globals.css";
import '@ant-design/v5-patch-for-react-19';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Visibuy — Visual Verification for Online Shopping",
    template: "%s | Visibuy",
  },
  description: "Verify products visually before buying. Build trust and shop with confidence.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="min-h-screen bg-neutral-100 text-neutral-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
