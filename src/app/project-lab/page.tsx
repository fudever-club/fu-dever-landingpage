import { Metadata } from "next";
import { ExternalLink, Lightbulb, UsersRound } from "lucide-react";
import DeverProjectTerminal from "@components/ui/DeverProjectTerminal";

export const metadata: Metadata = {
  title: "FU-DEVER | Project Lab & Tìm Đồng Đội",
  description: "Không gian kết nối ý tưởng dự án và ghép đội làm sản phẩm thực tế dành cho các thành viên câu lạc bộ FU-DEVER.",
};

const openProjects = [
  {
    title: "Website Quản Lý Sự Kiện Sinh Viên FPT",
    author: "Nguyễn Văn A (K17 - Leader)",
    desc: "Dự án xây dựng nền tảng check-in QR Code và điểm danh tự động cho các sự kiện CLB trường FPT.",
    hiring: ["Frontend (React/Tailwind)", "UI/UX Designer"],
    status: "Đang tuyển (2 vị trí)",
    badge: "Open Source",
  },
  {
    title: "AI Quiz Scraper & Auto Generator",
    author: "Trần Thị B (K18 - AI Lead)",
    desc: "Ứng dụng tự động cào và sinh câu hỏi trắc nghiệm ôn tập cho sinh viên các môn chuyên ngành Software Engineering.",
    hiring: ["Python Dev (FastAPI)", "DevOps"],
    status: "Đang tuyển (1 vị trí)",
    badge: "AI / ML",
  },
  {
    title: "App Di Động Tìm Bạn Cùng Phòng KTX",
    author: "Lê Hoàng C (K19 - Mobile Lead)",
    desc: "Ứng dụng Flutter hỗ trợ sinh viên Hòa Lạc tìm bạn ở ghép KTX dựa trên thói quen và sở thích.",
    hiring: ["Flutter Developer", "Backend (Node.js)"],
    status: "Đang tuyển (3 vị trí)",
    badge: "Mobile App",
  },
];

type ProjectLabItem = {
  _id: string;
  title: string;
  summary: string;
  category: string;
  status: "open" | "paused" | "closed";
  roles: string[];
  contactUrl?: string | null;
};

const getProjectLabs = async (): Promise<ProjectLabItem[]> => {
  try {
    const response = await fetch("https://dever-backend-production.up.railway.app/api/v1/project-lab", { cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch {
    return [];
  }
};

export default async function ProjectLabPage() {
  const projects = await getProjectLabs();
  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#F8FCFF]">
      {/* Header Banner */}
      <section className="max-w-[1440px] mx-auto px-5 lg:px-20 mb-12">
        <div className="bg-gradient-to-r from-[#0098FF] to-[#00528C] rounded-3xl p-8 lg:p-12 text-white flex flex-col lg:flex-row items-center justify-between shadow-xl overflow-hidden relative">
          <div className="lg:w-3/5 z-10">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              <Lightbulb className="h-4 w-4" aria-hidden="true" /> DEVER TEAM MATCHMAKING
            </span>
            <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 leading-tight">
              Project Lab & Tìm Đồng Đội
            </h1>
            <p className="text-white/90 text-base lg:text-lg mb-6 max-w-xl">
              Nơi chắp cánh ý tưởng! Đăng bài tuyển thành viên làm đồ án, dự án thực tế hoặc tham gia vào các sản phẩm hấp dẫn do các Senior dẫn dắt.
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <span className="bg-white/15 border border-white/30 text-center text-white font-semibold px-4 py-3 rounded-xl sm:px-6">
                Dự án được quản trị viên xét duyệt
              </span>
              <a
                href="#projects"
                className="bg-white/10 backdrop-blur-md border border-white/30 text-center text-white font-semibold px-4 py-3 rounded-xl hover:bg-white/20 transition-all sm:px-6"
              >
                Xem Dự Án Đang Tuyển
              </a>
            </div>
          </div>
          <div className="lg:w-2/5 mt-8 lg:mt-0 z-10 w-full">
            <DeverProjectTerminal />
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section id="projects" className="max-w-[1440px] mx-auto px-5 lg:px-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dự Án Đang Cần Đồng Đội</h2>
            <p className="text-gray-500 text-sm">Tham gia ngay để tích lũy kinh nghiệm làm dự án thực tế</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#0098FF] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer">
              Tất cả
            </span>
            <span className="bg-white text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-[#0098FF]">
              Web Dev
            </span>
            <span className="bg-white text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:border-[#0098FF]">
              AI / ML
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-blue-50 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                    {item.status === "open" ? "Đang tuyển" : "Tạm dừng"}
                  </span>
                  <span className="bg-blue-50 text-[#0098FF] text-xs font-bold px-2.5 py-1 rounded-md">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug">{item.title}</h3>
                <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-gray-500"><UsersRound className="h-3.5 w-3.5 text-[#0066CC]" aria-hidden="true" />FU-DEVER Project Lab</p>
                <p className="text-gray-600 text-xs mb-4 leading-relaxed">{item.summary}</p>

                <div className="mb-4">
                  <span className="text-xs font-bold text-gray-700 block mb-2">Vị trí đang tìm:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.roles.map((role, rIdx) => (
                      <span
                        key={rIdx}
                        className="bg-blue-50 text-[#0098FF] text-[11px] font-semibold px-2.5 py-1 rounded-md border border-blue-100"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {item.contactUrl ? (
                <a href={item.contactUrl} target="_blank" rel="noreferrer" className="w-full bg-[#0098FF] hover:bg-blue-600 text-center text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm">
                  <span className="inline-flex items-center justify-center gap-1.5">Liên hệ tham gia <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></span>
                </a>
              ) : (
                <span className="w-full bg-slate-100 text-center text-slate-500 font-semibold text-xs py-3 rounded-xl">
                  Chưa có kênh liên hệ
                </span>
              )}
            </div>
          ))}
          {projects.length === 0 && (
            <div className="md:col-span-3 rounded-2xl border border-dashed border-blue-200 bg-white p-10 text-center text-slate-600">
              Chưa có dự án đang tuyển. Quản trị viên sẽ cập nhật Project Lab sớm nhất.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
