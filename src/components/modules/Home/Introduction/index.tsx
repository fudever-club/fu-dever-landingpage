"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import introduction from "@images/pages/home/introduction/introduce.png";
import SectionTitle from "@components/core/common/SectionTitle";
import arrowRight from "@icons/pages/home/introduction/Chevron Down.svg";
import VisibilitySensor from "react-visibility-sensor";

import "./style.css";

function Counter({
  initialValue,
  maxValue,
  speed,
  startCounting,
}: {
  initialValue: number;
  maxValue: number;
  speed: number;
  startCounting: boolean;
}): JSX.Element {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (startCounting && count < maxValue) {
      const timer = setTimeout(() => {
        setCount(count + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [count, maxValue, speed, startCounting]);

  useEffect(() => {
    if (count === 0) {
      setCount(1);
    }
  }, [count, maxValue]);
  return <p>{count}+</p>;
}

function Introduction() {
  const [isReadMore, setReadMore] = useState<boolean>(false);
  const [hasCounted, setHasCounted] = useState<boolean>(false);

  const data = [
    {
      number: 50,
      tittle: "Thành viên",
      speed: 30,
    },
    {
      number: 9,
      tittle: "Năm hoạt động",
      speed: 300,
    },
    {
      number: 15,
      tittle: "Dự án",
      speed: 250,
    },
    {
      number: 20,
      tittle: "Giải thưởng",
      speed: 150,
    },
  ];

  const handleReadMore = () => {
    setReadMore((prev) => !prev);
  };

  return (
    <section id="gioi-thieu" className="bg-[#F8FCFF] text-[#000000] overflow-hidden">
      {/* 2-Column Responsive Layout with blended image styling */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12 px-5 md:px-10 xl:px-20 pt-12 pb-8 lg:pt-16 lg:pb-0">
        {/* Left: Text Content */}
        <div className="space-y-6 z-10 py-4 lg:py-8">
          <SectionTitle
            title="Chúng tôi là ai"
            subtitle="Mục tiêu thành lập và phát triển"
            textPosition="left"
          />
          <div className="text-sm md:text-base leading-relaxed text-slate-700 space-y-4">
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

        {/* Right: Team Photo with smooth gradient blend into background */}
        <div className="relative z-0 flex w-full justify-center lg:justify-end items-end h-[360px] md:h-[460px] lg:h-[500px]">
          <span className="absolute h-full w-[80px] md:w-[150px] lg:w-[180px] background_blur_left_to_right left-0 z-10 hidden sm:block pointer-events-none"></span>
          <span className="absolute h-[80px] w-full background_blur_top_to_bottom top-0 left-0 z-10 block pointer-events-none"></span>
          <Image
            loading="lazy"
            className="h-full w-auto object-cover object-bottom"
            src={introduction}
            alt="Đội ngũ thành viên FU-DEVER"
          />
          <span className="absolute h-full w-[60px] md:w-[120px] lg:w-[160px] background_blur_right_to_left right-0 z-10 hidden sm:block pointer-events-none"></span>
        </div>
      </div>

      {/* Stats Counter Ribbon */}
      <div className="bg-gradient-to-r from-[#004C99] via-[#0066CC] to-[#004C99] text-white shadow-inner relative z-10">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20 py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {data.map((item, index) => (
            <VisibilitySensor key={index} partialVisibility>
              {({ isVisible }: { isVisible: boolean }) => (
                <div className="flex flex-col items-center justify-center p-2">
                  <div className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tight text-white mb-1">
                    {isVisible && !hasCounted ? (
                      <Counter
                        initialValue={0}
                        maxValue={item.number}
                        speed={item.speed}
                        startCounting={isVisible}
                      />
                    ) : (
                      <p>{item.number}+</p>
                    )}
                  </div>
                  <span className="text-xs md:text-sm font-bold text-blue-100 tracking-wide uppercase">
                    {item.tittle}
                  </span>
                </div>
              )}
            </VisibilitySensor>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Introduction;
