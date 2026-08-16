"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

import image1 from "@images/pages/home/banner/image1.png";
import image2 from "@images/pages/home/banner/image2.png";
import image3 from "@images/pages/home/banner/image3.png";
import image4 from "@images/pages/home/banner/image4.png";
import retangle1 from "@icons/pages/home/banner/Rectangle_7.svg";
import retangle2 from "@icons/pages/home/banner/Rectangle_8.svg";
import retangle3 from "@icons/pages/home/banner/Rectangle_9.svg";
import retangle4 from "@icons/pages/home/banner/Rectangle_10.svg";
import retangle5 from "@icons/pages/home/banner/Rectangle_11.svg";
import retangle6 from "@icons/pages/home/banner/Rectangle_12.svg";
import retangle7 from "@icons/pages/home/banner/Rectangle_13.svg";
import "./style.css";
type obj = {
  x: number;
  y: number;
};

const animationTitle: any = {
  show: {
    scaleX: [1, 0.2],
    transition: {
      type: "spring",
      bounce: 0.8,
      duration: 3,
      delay: 0.5,
      repeat: "Infinity",
      repeatType: "reverse",
    },
  },
};

function Banner() {
  const [client, setClient] = useState<obj>({ x: 0, y: 0 });
  const ref = useRef<any>(null);
  return (
    <motion.section
      animate={{
        transition: {
          type: "spring",
        },
      }}
      ref={ref}
      onMouseMove={({ clientX, clientY }: React.MouseEvent) => {
        setClient(() => {
          const x =
            ((clientX - ref?.current?.clientWidth / 2) /
              ref.current.clientWidth) *
            100;
          const y =
            ((clientY - ref?.current?.clientHeight / 2) /
              ref.current.clientWidth) *
            100;
          return {
            x: x,
            y: y,
          };
        });
      }}
      className="relative flex min-h-[520px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#E6F4FF_0%,_#FFFFFF_58%)] md:min-h-[573px] lg:min-h-[708px] xl:min-h-[810px]"
    >

      <div className="max-w-[1440px] w-[100%] px-[20px] md:px-[40px] lg:px-[40px] xl:px-[80px] h-[100%] flex justify-center items-center">
        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center justify-center py-12 text-center md:max-w-2xl xl:-translate-y-10">
          <p className="mb-4 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-[#004C99] shadow-sm">
            CÂU LẠC BỘ LẬP TRÌNH · FPT UNIVERSITY ĐÀ NẴNG
          </p>
          <h1
            className="relative flex items-center justify-center text-4xl font-bold leading-tight text-[#0066CC] md:text-5xl xl:text-6xl"
          >
            FU-DEVER
            <motion.span
              animate="show"
              variants={animationTitle}
              className="w-[120px] animate-line h-[5px] bg-[red] absolute top-[50px] xl:top-[54px]"
            ></motion.span>
          </h1>
          <h2 className="mt-4 text-xl font-semibold leading-tight text-slate-900 md:text-2xl xl:text-3xl">
            WORK HARD - PLAY HARD
          </h2>
          <p className="mt-4 max-w-lg text-pretty text-sm leading-6 text-slate-600 md:text-base md:leading-7 xl:text-lg">
            Học cùng cộng đồng yêu công nghệ, thực chiến qua workshop, dự án và
            thử thách lập trình.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://docs.google.com/forms/d/1zr-qtjxbWkFvV10AWEyRnlsdq2IzqqOrewaHWXKIuDQ/prefill"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#0066CC] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#004C99] hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Đăng ký thành viên
            </a>
            <Link
              href="/events"
              className="rounded-xl border border-[#0066CC] bg-white px-5 py-3 text-sm font-semibold text-[#0066CC] shadow-sm transition-all duration-200 hover:bg-blue-50 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Xem sự kiện sắp tới
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Floating Members on Mobile (All 4 Corners) */}
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-4 -left-2 z-[1] h-24 w-20 md:hidden opacity-75"
      >
        <Image loading="lazy" src={image1} alt="" className="h-full w-full object-contain" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 8, 0], rotate: [0, -1, 0] }}
        transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-6 -left-4 z-[1] h-36 w-28 md:hidden"
      >
        <Image loading="lazy" src={image2} alt="" className="h-full w-full object-contain" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -6, 0], rotate: [0, -1.5, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-4 -right-2 z-[1] h-24 w-20 md:hidden opacity-75"
      >
        <Image loading="lazy" src={image3} alt="" className="h-full w-full object-contain" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 8, 0], rotate: [0, 1, 0] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-6 -right-4 z-[1] h-36 w-28 md:hidden"
      >
        <Image loading="lazy" src={image4} alt="" className="h-full w-full object-contain" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-[1] hidden h-[421px] w-full max-w-[1440px] px-5 md:block md:h-[573px] md:px-10 lg:h-[708px] lg:px-10 xl:h-[810px] xl:px-20"
      >
        <motion.div
          animate={{
            x: client.x,
            y: client.y,
          }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="w-[240px] h-[258px] lg:w-[200px] lg:h-[240px] xl:w-[226px] xl:h-[272px] absolute bottom-[40px]"
        >
          <Image loading="lazy" src={image2} alt="" />
        </motion.div>
        <motion.div
          animate={{
            x: client.x * -1,
            y: client.y * -1,
          }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="w-[200px] h-[190px] lg:w-[210] lg:h-[260px] xl:w-[236px] xl:h-[333px] absolute right-[20px] md:right-[40px] lg:right-[40px] xl:right-[80px] bottom-[61px] lg:bottom-[44px] xl:bottom-[80px]"
        >
          <Image loading="lazy" src={image4} alt="" />
        </motion.div>
        <motion.div
          animate={{
            x: client.x,
            y: client.y,
          }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="w-[120px] h-[144px] xl:w-[133px] xl:h-[141px] absolute right-[120px] lg:right-[180px] xl:right-[328px] top-[116px] lg:top-[147px] xl:top-[132px]"
        >
          <Image loading="lazy" src={image3} alt="" />
        </motion.div>
        <motion.div
          animate={{
            x: client.x * -1,
            y: client.y * -1,
          }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="w-[134px] h-[138px] xl:w-[156px] xl:h-[148px] absolute xl:left-[256px] top-[96px] lg:top-[142px] xl:top-[120px] lg:left-[180px] left-[120px]"
        >
          <Image loading="lazy" src={image1} alt="" />
        </motion.div>
      </motion.div>

      <motion.div className="max-w-[1440px] w-[100%] m-auto  h-[421px] md:h-[573px] lg:h-[708px] xl:h-[810px] absolute z-[-2] overflow-hidden">
        <motion.div
          animate={{
            x: client.x * -1,
            y: client.y * -1,
          }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="absolute lg:top-[204px] xl:top-[335px] lg:left-[-90px] xl:left-[-70px] xl:w-auto xl:h-auto lg:w-auto lg:h-auto md:w-[68px] md:h-[111px] md:top-[216px] md:left-[-40px] hidden md:block lg:block xl:block"
        >
          <Image loading="lazy" src={retangle1} alt="Picture of the author" />
        </motion.div>
        <motion.div
          animate={{
            x: client.x,
            y: client.y,
          }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="absolute lg:top-[312px] xl:top-[373px] lg:left-[110px] xl:left-[250px] xl:w-auto xl:h-auto lg:w-[23px] lg:h-[21px] hidden md:hidden xl:block lg:block"
        >
          <Image loading="lazy" src={retangle2} alt="Picture of the author" />
        </motion.div>
        <motion.div
          animate={{
            x: client.x * -1,
            y: client.y * -1,
          }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="absolute xl:top-[277px] xl:right-[160px] xl:w-auto xl:h-auto lg:w-[45px] lg:h-[45px] lg:top-[297px] lg:right-[80px]  hidden md:hidden xl:block lg:block"
        >
          <Image loading="lazy" src={retangle3} alt="Picture of the author" />
        </motion.div>
        <motion.div
          animate={{
            x: client.x,
            y: client.y,
          }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="absolute xl:top-[179px] xl:right-[-30px] xl:w-auto xl:h-auto lg:w-[61px] lg:h-[73px] lg:right-[-40px] lg:top-[114px] md:w-[61px] md:h-[73px] md:top-[246px] right-[-40px] hidden md:block lg:block xl:block"
        >
          <Image loading="lazy" src={retangle4} alt="Picture of the author" />
        </motion.div>
        <motion.div
          animate={{
            x: client.x * -1,
            y: client.y * -1,
          }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="absolute xl:bottom-[91px] xl:right-[427px] lg:right-[340px] lg:bottom-[137px] hidden md:hidden xl:block lg:block"
        >
          <Image loading="lazy" src={retangle5} alt="Picture of the author" />
        </motion.div>
        <motion.div
          animate={{
            x: client.x,
            y: client.y,
          }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="absolute xl:bottom-[147px] xl:left-[553px] xl:w-auto xl:h-auto lg:w-[31px] lg:h-[30px] lg:bottom-[159px] lg:left-[356px] md:bottom-[30px] md:left-[264px] bottom-[63px] right-[46px]"
        >
          <Image loading="lazy" src={retangle6} alt="Picture of the author" />
        </motion.div>
        <motion.div
          animate={{
            x: client.x * -1,
            y: client.y * -1,
          }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="absolute xl:top-[108px] xl:right-[571px] xl:w-auto xl:h-auto lg:w-[33px] lg:h-[33px] lg:top-[142px] lg:right-[311px] md:top-[108px] md:right-[240px] top-[96px] left-[40px]"
        >
          <Image loading="lazy" src={retangle7} alt="Picture of the author" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
export default Banner;
