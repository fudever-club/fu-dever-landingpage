import Link from "next/link";

export const metadata = {
  title: "Ngoại tuyến | FU-DEVER",
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div
        aria-hidden
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0066CC]/10 text-3xl font-black text-[#0066CC]"
      >
        {"</>"}
      </div>
      <h1 className="text-xl font-bold text-slate-900">Bạn đang ngoại tuyến</h1>
      <p className="mt-2 text-sm text-slate-600">
        Không có kết nối mạng. Nội dung đã xem trước đó có thể vẫn mở được — hãy kiểm tra lại đường truyền rồi thử lại.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-[#0066CC] px-6 font-semibold text-white transition-all duration-200 hover:bg-[#004C99] active:scale-[0.98]"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
