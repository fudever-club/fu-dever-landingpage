"use client";
import React from "react";
import Image from "next/image";
import SectionTitle from "@components/core/common/SectionTitle";
import ProductsOne from "@images/pages/home/product/image1.png";
import ProductsTwo from "@images/pages/home/product/image2.png";
import ProductsThree from "@images/pages/home/product/image3.png";
import ProductsFour from "@images/pages/home/product/image4.png";
import Vector from "@icons/pages/home/product/longWave.svg";
import Facebook from "@icons/pages/home/product/Facebook.svg";
import Github from "@icons/pages/home/product/Github.svg";
import Tiktok from "@icons/pages/home/product/Tiktok.svg";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
type obj = {
  x: number;
  y: number;
};
function Product() {
  const [client, setClient] = useState<obj>({ x: 0, y: 0 });
  const ref = useRef<any>(null);
  const router = useRouter();
  return (
    <section
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
      className=" h-fit flex justify-center items-center relative overflow-hidden"
    >
      <motion.div className="max-w-[1440px] w-[100%] h-fit py-[40px] md:py-[60px] lg:py-[60px] xl:py-[60px] flex flex-col-reverse md:flex-row lg:flex-row xl:flex-row justify-between relative px-[20px] md:px-[40px] lg:px-[40px] xl:px-[80px]">
        <div className="mt-6 grid h-auto w-full max-w-full grid-cols-2 gap-4 md:mt-0 md:max-w-[50%] md:gap-5 lg:max-w-[50%] lg:gap-8 xl:max-w-[50%] xl:gap-10">
          <div className="relative flex flex-col items-center rounded-xl bg-white px-4 pb-4 pt-3 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <Image
              loading="lazy"
              src={ProductsOne}
              className="w-[90px] md:w-[90px] lg:w-[140px] xl:w-[200px]"
              alt="Product Image"
            />
            <h3 className="mt-2 text-sm font-medium leading-6 text-slate-800 md:text-base lg:text-lg">
              2D Game
            </h3>
            <div className="w-[100%] h-[100%] absolute bg-[#ffffff] top-0 left-0 z-[-1] blur-[4px]"></div>
          </div>

          <div className="relative flex flex-col items-center rounded-xl bg-white px-4 pb-4 pt-3 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <Image
              loading="lazy"
              src={ProductsTwo}
              className="w-[90px] md:w-[90px] lg:w-[140px] xl:w-[200px]"
              alt="Product Image"
            />
            <h3 className="mt-2 text-sm font-medium leading-6 text-slate-800 md:text-base lg:text-lg">
              Web App
            </h3>
            <div className="w-[100%] h-[100%] absolute bg-[#FFFFFF] top-0 left-0 z-[-1] blur-[4px]"></div>
          </div>

          <div className="relative flex flex-col items-center rounded-xl bg-white px-4 pb-4 pt-3 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <Image
              loading="lazy"
              src={ProductsThree}
              className="w-[90px] md:w-[90px] lg:w-[140px] xl:w-[200px]"
              alt="Product Image"
            />
            <h3 className="mt-2 text-sm font-medium leading-6 text-slate-800 md:text-base lg:text-lg">
              Mobile App
            </h3>
            <div className="w-[100%] h-[100%] absolute bg-[#FFFFFF] top-0 left-0 z-[-1] blur-[4px]"></div>
          </div>

          <div className="relative flex flex-col items-center rounded-xl bg-white px-4 pb-4 pt-3 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <Image
              loading="lazy"
              src={ProductsFour}
              className="w-[90px] md:w-[90px] lg:w-[140px] xl:w-[200px]"
              alt="Product Image"
            />
            <h3 className="mt-2 text-sm font-medium leading-6 text-slate-800 md:text-base lg:text-lg">
              Model AI
            </h3>
            <div className="w-[100%] h-[100%] absolute bg-[#FFFFFF] top-0 left-0 z-[-1] blur-[4px]"></div>
          </div>
        </div>

        <div className="max-w-[100%] md:max-w-[50%] lg:max-w-[50%] xl:max-w-[50%] h-fit flex flex-col items-end text-[16px] font-[400] ">
          <SectionTitle
            title="Sản phẩm"
            subtitle="Phần mềm và dịch vụ"
            textPosition="right"
          ></SectionTitle>
          <div className="w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] mt-[28px]">
            <p className="text-left text-sm leading-6 text-slate-700 md:pl-5 md:text-right md:text-base md:leading-7">
              Sản phẩm của chúng tôi mang lại những cải tiến quan trọng, hỗ trợ
              các ngành công nghiệp và nâng cao trải nghiệm người dùng. Với các
              công nghệ hiện đại và luôn lấy người dùng làm trung tâm, chúng tôi
              cung cấp các giải pháp sáng tạo đáp ứng mong đợi, nhu cầu và thúc
              đẩy sự phát triển vững bềnh.
              <br />
              <br />
              Với đội ngũ lập trình viên đầy nhiệt huyết, chúng tôi cùng nhau
              tạo ra những giải pháp sáng tạo. Sản phẩm của chúng tôi bao gồm
              các ứng dụng Web và di động, công cụ phần mềm và tiện ích giúp tối
              ưu hóa quy trình và nâng cao năng suất.
            </p>
          </div>

          <div className="mt-[20px] md:mt-[20px] lg:mt-[40px] xl:mt-[40px] relative">
            <Link
              href="/project"
              className="px-[24px] md:px-[24px] lg:px-[26px] xl:px-[32px] py-[12px] xl:py-[16px] bg-primary text-[12px] md:text-[12px] lg:text-[16px] xl:text-[16px] text-white absolute 
            top-[-4px] md:top-[-4px] lg:top-[-8px] xl:top-[-10px] right-[-4px] md:right-[-4px] lg:right-[-8px] xl:right-[-10px] 
            hover:top-[-6px] hover:right-[-6px] active:top-[3px] active:right-[3px]
            "
              style={{
                transitionDuration: "0.1s",
              }}
            >
              <p>Dự án</p>
            </Link>
            <button
              className="px-[24px] md:px-[24px] lg:px-[26px] xl:px-[32px] py-[12px] xl:py-[16px] bg-white border-[3px] border-black text-[12px] md:text-[12px] lg:text-[16px] xl:text-[16px]text-white"
              style={{
                transitionDuration: "0.1s",
              }}
            >
              <p>Dự án</p>
            </button>
          </div>

          <div className="mt-[171px] absolute bottom-[60px] hidden xl:block">
            <div className="font-[400] text-16px leading-[19px] text-[#FFFFFF]">
              <p>Follow FU-DEVER</p>
            </div>
            <div className="mt-[12px] w-[136px] flex flex-row justify-between">
              <a href="https://www.facebook.com/FPTUDever">
                <Image loading="lazy" src={Facebook} alt="Facebook" />
              </a>
              <a
                href="https://github.com/fudever-club"
                target="_blank"
                rel="noreferrer"
                aria-label="FU-DEVER Club on GitHub"
              >
                <Image loading="lazy" src={Github} alt="Github" />
              </a>
              <a href="https://www.tiktok.com/@daihocfptdanang">
                <Image loading="lazy" src={Tiktok} alt="Tiktok" />
              </a>
            </div>
          </div>
        </div>
        <motion.div
          animate={{ x: client.x * 1, y: client.y * 1 }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="w-[40px] h-[40px] bg-red-500 absolute top-[348px] left-[360px] blur-[24px] z-[-1] hidden md:hidden lg:hidden xl:block"
        ></motion.div>
        <motion.div
          animate={{ x: client.x * 2, y: client.y * 2 }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="w-[40px] h-[40px] bg-red-500 absolute top-[385px] right-[540px] blur-[24px] z-[-1] hidden md:hidden lg:hidden xl:block"
        ></motion.div>
        <motion.div
          animate={{ x: client.x * -1, y: client.y * -1 }}
          transition={{
            type: "lieaner",
            restDelta: 0.01,
          }}
          className="w-[40px] h-[40px] bg-red-500 absolute top-[260px] right-[420px] blur-[24px] z-[-1] hidden md:hidden lg:hidden xl:block"
        ></motion.div>
      </motion.div>
      <Image
        loading="lazy"
        src={Vector}
        className="absolute bottom-[-100px] md:bottom-[-140px] lg:bottom-[-120px] xl:bottom-0 right-[-580px] md:right-[-500px] lg:right-[-300px] xl:right-0 z-[-1] max-w-fit "
        alt="Vector"
      />
    </section>
  );
}

export default Product;
