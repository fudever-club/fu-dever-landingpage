"use client";

// Route error boundary: backend failure must surface as an error with retry,
// never as placeholder cards or a misleading empty board.
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5 py-16">
      <div
        role="alert"
        className="max-w-lg w-full rounded-3xl border border-dashed border-rose-200 bg-white p-10 text-center space-y-3 shadow-xs"
      >
        <p className="text-base font-bold text-rose-600">Không thể tải danh sách dự án.</p>
        <p className="text-xs text-slate-500">
          Vui lòng kiểm tra kết nối và thử lại sau ít phút.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-[#0066CC] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#004C99] active:scale-[0.98]"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
