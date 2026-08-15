import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import { Metadata } from "next";

import MainLayout from "@components/core/layouts/MainLayout";

import "./globals.css";

const deverSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dever-sans",
  display: "swap",
});
const deverMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-dever-mono",
  display: "swap",
});
export const metadata: Metadata = {
  title: "FU-DEVER",
  description:
    "Welcome to FU-DEVER, the programming club of FPT University! . At FU-DEVER, we strive to foster a vibrant community of aspiring programmers and provide a platform for skill development and collaboration.",
  icons: {
    icon: "/icons/layout/logo.png",
  },
  openGraph: {
    images: ["/images/meta.jpg"],
    title: "FU-DEVER | Câu lạc bộ lập trình FU-DEVER",
    description:
      "Welcome to FU-DEVER, the programming club of FPT University! . At FU-DEVER, we strive to foster a vibrant community of aspiring programmers and provide a platform for skill development and collaboration.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${deverSans.variable} ${deverMono.variable} font-sans`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
