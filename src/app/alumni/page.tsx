import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FU-DEVER | Cựu thành viên",
  description: "Mạng lưới cựu thành viên (Hall of Fame) của FU-DEVER.",
};

type Alumnus = { _id: string; name: string; graduationGen?: string | null; headline: string; workplace?: string | null; avatar?: string | null; profileUrl?: string | null };

const getAlumni = async (): Promise<Alumnus[]> => {
  try {
    const response = await fetch("https://dever-backend-production.up.railway.app/api/v1/alumni", { cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch { return []; }
};

export default async function AlumniPage() {
  const alumni = await getAlumni();
  return (
    <div className="pt-[100px] min-h-[100vh] bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[40px] xl:px-[80px]">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Hall of Fame</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Vinh danh những thành viên xuất sắc đã và đang đóng góp cho sự phát triển của CLB, hiện đang làm việc tại các công ty công nghệ hàng đầu.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {alumni.map(alumnus => (
            <article key={alumnus._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-800">
              {alumnus.avatar ? <img src={alumnus.avatar} alt="" className="w-24 h-24 mx-auto rounded-full object-cover mb-4" /> : <div className="w-24 h-24 mx-auto rounded-full bg-[#0066CC] mb-4 flex items-center justify-center text-2xl font-bold text-white">{alumnus.name.charAt(0)}</div>}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{alumnus.name}</h2>
              {alumnus.graduationGen && <p className="text-primary font-medium mb-2">{alumnus.graduationGen}</p>}
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>{alumnus.headline}</p>
                {alumnus.workplace && <p className="font-semibold">{alumnus.workplace}</p>}
              </div>
              {alumnus.profileUrl && <a className="mt-4 inline-block text-sm font-semibold text-[#0066CC] hover:underline" href={alumnus.profileUrl} target="_blank" rel="noreferrer">Xem hồ sơ ↗</a>}
            </article>
          ))}
          {alumni.length === 0 && <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 p-10 text-center text-slate-600">Danh sách cựu thành viên đang được Ban quản trị cập nhật.</div>}
        </div>
      </div>
    </div>
  );
}
