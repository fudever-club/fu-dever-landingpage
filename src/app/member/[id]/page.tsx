import React from "react";
import MainMemberDetail from "@/src/components/modules/MemberDetail/Detail";
import Link from "next/link";
import { ArrowLeft, UserX } from "lucide-react";

const fetchUserDetail = async (idOrKey: string) => {
  const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";
  try {
    const res = await fetch(`${API_SERVER}/api/v1/users/${encodeURIComponent(idOrKey)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      return json.data || null;
    }
  } catch (error) {
    console.warn("Error fetching user detail from API:", error);
  }
  return null;
};

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await fetchUserDetail(id);
  const name = user ? `${user?.firstname || ""} ${user?.lastname || ""}`.trim() : "Hồ sơ thành viên";
  return {
    title: `FU-DEVER | ${name}`,
    description: user?.description || "Hồ sơ thành viên CLB Lập Trình FU-DEVER.",
    icons: {
      icon: "/icons/layout/logo.png",
    },
    openGraph: {
      images: [user?.avatar || "/images/layouts/member.png"],
      title: `FU-DEVER | ${name}`,
      description: `${name} là thành viên trong câu lạc bộ FU-DEVER.`,
    },
  };
}

const Member = async ({ params: { id } }: { params: { id: string } }) => {
  const user = await fetchUserDetail(id);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4 pt-6 pb-20">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mx-auto">
            <UserX className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Không Tìm Thấy Thành Viên</h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Hồ sơ thành viên này không tồn tại hoặc đã được chuyển sang chế độ riêng tư.
          </p>
          <div className="pt-2">
            <Link
              href="/member"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-bold transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Về danh bạ thành viên
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <MainMemberDetail user={user} />;
};

export default Member;
