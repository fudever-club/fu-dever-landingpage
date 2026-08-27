"use client";
import React, { useState } from "react";
import Image from "next/image";
import introduction from "@images/pages/home/introduction/introduce.png";
import SectionTitle from "@components/core/common/SectionTitle";
import arrowRight from "@icons/pages/home/introduction/Chevron Down.svg";

import "./style.css";

const MARQUEE_ITEMS = [
  { number: "50+", label: "Thành viên nòng cốt" },
  { number: "9+", label: "Năm hoạt động bền vững" },
  { number: "15+", label: "Dự án thực chiến" },
  { number: "20+", label: "Giải thưởng ICPC & Hackathon" },
  { number: "1.2k+", label: "Lượt sinh viên tham gia" },
  { number: "Top 1", label: "CLB Học thuật FPTU" },
  { number: "100%", label: "Dự án thực tế" },
  { number: "Gen 9", label: "Thế hệ kế thừa" },
];

function Introduction() {
  const [isReadMore, setReadMore] = useState<boolean>(false);

  const handleReadMore = () => {
    setReadMore((prev) => !prev);
  };

  return (
    <section id="gioi-thieu" className="bg-[#F8FCFF] text-[#000000] overflow-hidden">
      {/* 2-Column Responsive Layout with blended image styling */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12 px-5 md:px-10 xl:px-20 pt-12 pb-8 lg:pt-16 lg:pb-4">
        {/* Left: Text Content */}
        <div className="space-y-6 z-10 py-4 lg:py-8">
          <SectionTitle
            title="Chúng tôi là ai"
            subtitle="Mục tiêu thành lập và phát triển"
            textPosition="left"
          />
          <div className="text-sm md:text-base leading-relaxed text-slate-700 space-y-4 font-medium">
            <p>
              Chào mừng đến với FU-DEVER, câu lạc bộ lập trình của Đại học FPT!
              Với hành trình hơn 9+ năm xây dựng và phát triển, chúng tôi tạo ra một cộng đồng học thuật năng động cho những lập
              trình viên tương lai, cung cấp cơ hội phát triển kỹ năng và giao lưu.
            </p>
            <p>
              Dù bạn là người mới bắt đầu hay lập trình viên có kinh nghiệm,
              FU-DEVER có mọi hoạt động để bạn tham gia, từ các thử thách lập
              trình đến các cuộc thi ICPC và Workshop chuyên sâu.
            </p>
            <p className={`${isReadMore ? "block" : "hidden"} lg:block text-slate-600`}>
              Từ một nhóm sinh viên nhiệt huyết, FU-DEVER đã phát triển thành
              một cộng đồng công nghệ uy tín, tổ chức các sự kiện lớn và khuyến khích
              sự sáng tạo, góp phần làm nâng cao kỹ năng, kinh nghiệm, trải
              nghiệm của cộng đồng lập trình tại trường đại học.
            </p>
            <div className="lg:hidden pt-2">
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-[#0066CC] px-4 py-2 text-sm font-semibold text-[#0066CC] transition-all duration-200 hover:bg-blue-50 active:scale-[0.98]"
                onClick={handleReadMore}
                aria-expanded={isReadMore}
              >
                <span>{isReadMore ? "Thu gọn" : "Xem thêm"}</span>
                <Image
                  loading="lazy"
                  src={arrowRight}
                  alt="Xem thêm"
                  className={`w-4 h-4 transition-transform duration-200 ${isReadMore ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Team Photo spanning edge-to-edge full width */}
        <div className="relative z-0 flex w-[calc(100%+2.5rem)] -mx-5 sm:w-full sm:mx-0 justify-center lg:justify-end items-end h-[320px] sm:h-[390px] md:h-[460px] lg:h-[500px] overflow-hidden">
          <span className="absolute h-full w-[24px] md:w-[48px] background_blur_left_to_right left-0 z-10 hidden sm:block pointer-events-none opacity-40"></span>
          <span className="absolute h-[20px] md:h-[30px] w-full background_blur_top_to_bottom top-0 left-0 z-10 block pointer-events-none opacity-30"></span>
          <Image
            loading="lazy"
            className="w-full h-full object-cover object-bottom sm:w-auto"
            src={introduction}
            alt="Đội ngũ thành viên FU-DEVER"
          />
          <span className="absolute h-full w-[20px] md:w-[40px] background_blur_right_to_left right-0 z-10 hidden sm:block pointer-events-none opacity-30"></span>
        </div>
      </div>

      {/* Infinite Horizontal Running Marquee Ribbon */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#003B80] via-[#0066CC] to-[#003B80] py-4 md:py-5 text-white shadow-lg select-none border-y border-blue-400/30">
        {/* Subtle Edge Fade Masks */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 md:w-32 bg-gradient-to-r from-[#003B80] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 md:w-32 bg-gradient-to-l from-[#003B80] to-transparent" />

        <div className="animate-marquee-ribbon flex items-center">
          {/* Loop 1 */}
          {MARQUEE_ITEMS.map((item, idx) => (
            <div key={`m1-${idx}`} className="flex items-center shrink-0">
              <div className="flex items-baseline gap-2.5 px-6">
                <span className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-xs">
                  {item.number}
                </span>
                <span className="text-xs md:text-sm font-bold text-blue-100 uppercase tracking-wider whitespace-nowrap">
                  {item.label}
                </span>
              </div>
              <span className="text-cyan-300/40 text-sm font-bold select-none">•</span>
            </div>
          ))}

          {/* Loop 2 (Duplicate for Seamless Continuous Loop) */}
          {MARQUEE_ITEMS.map((item, idx) => (
            <div key={`m2-${idx}`} className="flex items-center shrink-0">
              <div className="flex items-baseline gap-2.5 px-6">
                <span className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-xs">
                  {item.number}
                </span>
                <span className="text-xs md:text-sm font-bold text-blue-100 uppercase tracking-wider whitespace-nowrap">
                  {item.label}
                </span>
              </div>
              <span className="text-cyan-300/40 text-sm font-bold select-none">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Introduction;
