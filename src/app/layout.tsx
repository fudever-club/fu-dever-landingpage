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
  metadataBase: new URL("https://fudever.com"),
  title: "FU-DEVER | Câu lạc bộ lập trình FPT University Đà Nẵng",
  description:
    "Chào mừng bạn đến với FU-DEVER, câu lạc bộ lập trình của Đại học FPT Đà Nẵng! Môi trường học thuật thực chiến, thi đấu giải thuật và phát triển dự án công nghệ.",
  icons: {
    icon: "/icons/layout/logo.png",
  },
  openGraph: {
    images: ["/images/meta.jpg"],
    title: "FU-DEVER | Câu lạc bộ lập trình FU-DEVER",
    description:
      "Chào mừng bạn đến với FU-DEVER, câu lạc bộ lập trình của Đại học FPT Đà Nẵng! Môi trường học thuật thực chiến, thi đấu giải thuật và phát triển dự án công nghệ.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function isExtErr(e, s) {
                  var str = String((e && (e.stack || e.message)) || e || s || '');
                  return str.indexOf('chrome-extension://') !== -1 ||
                         str.indexOf('moz-extension://') !== -1 ||
                         str.indexOf('M_ID') !== -1 ||
                         str.indexOf('nimlmejbmnecnaghgmbahmbaddhjbecg') !== -1;
                }
                window.addEventListener('error', function(ev) {
                  if (isExtErr(ev.error, ev.filename) || isExtErr(ev.message)) {
                    ev.stopImmediatePropagation();
                    ev.preventDefault();
                    return true;
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(ev) {
                  if (isExtErr(ev.reason)) {
                    ev.stopImmediatePropagation();
                    ev.preventDefault();
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className={`${deverSans.variable} ${deverMono.variable} font-sans`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
