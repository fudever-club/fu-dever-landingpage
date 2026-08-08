"use client";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[200] rounded-lg bg-[#0066CC] px-4 py-2 text-sm font-semibold text-white shadow-lg focus:not-sr-only focus:outline-none focus:ring-4 focus:ring-blue-200"
      >
        Chuyển đến nội dung chính
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-16 outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
