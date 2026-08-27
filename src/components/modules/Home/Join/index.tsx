import { Code2, GraduationCap, UsersRound } from "lucide-react";
import DeverParticleNetwork from "@components/ui/DeverParticleNetwork";

const JOIN_FORM_URL =
  "https://docs.google.com/forms/d/1zr-qtjxbWkFvV10AWEyRnlsdq2IzqqOrewaHWXKIuDQ/prefill";

const benefits = [
  {
    icon: Code2,
    title: "Thực chiến cùng dự án",
    description: "Biến kiến thức thành sản phẩm qua lab, hackathon và dự án nhóm.",
  },
  {
    icon: UsersRound,
    title: "Cộng đồng cùng tiến bộ",
    description: "Kết nối bạn học, mentor và những người cùng đam mê công nghệ.",
  },
  {
    icon: GraduationCap,
    title: "Học theo lộ trình",
    description: "Tìm tài liệu, workshop và thử thách phù hợp với trình độ của bạn.",
  },
];

function Join() {
  return (
    <DeverParticleNetwork
      particleCount={45}
      particleColor="rgba(0, 102, 204, 0.4)"
      lineColor="rgba(0, 102, 204, 0.12)"
      maxDistance={120}
    >
      <section id="joinClub" className="bg-[#F8FCFF]/80 backdrop-blur-xs px-5 py-16 md:px-10 md:py-20 xl:px-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-[#0066CC]">THAM GIA FU-DEVER</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Bắt đầu hành trình công nghệ cùng chúng mình
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Dù bạn mới bắt đầu hay đã có kinh nghiệm, FU-DEVER là nơi để học,
              xây dựng sản phẩm và tìm đồng đội cho những ý tưởng tiếp theo.
            </p>
            <a
              href={JOIN_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center rounded-xl bg-[#0066CC] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#004C99] hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Mở đơn đăng ký
            </a>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Biểu mẫu đăng ký sẽ mở trong tab mới để bạn không mất vị trí đang xem.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-blue-100 bg-white/90 backdrop-blur-sm p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <Icon className="h-6 w-6 text-[#0066CC]" aria-hidden="true" />
                <h3 className="mt-3 text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </DeverParticleNetwork>
  );
}

export default Join;
