"use client";
import React, { useState, useRef } from "react";
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
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type obj = {
  x: number;
  y: number;
};

function Product() {
  const [client, setClient] = useState<obj>({ x: 0, y: 0 });
  const ref = useRef<any>(null);

  return (
    <section
      ref={ref}
      onMouseMove={({ clientX, clientY }: React.MouseEvent) => {
        setClient(() => {
          const width = ref?.current?.clientWidth || 1200;
          const height = ref?.current?.clientHeight || 600;
          const x = ((clientX - width / 2) / width) * 40;
          const y = ((clientY - height / 2) / height) * 40;
          return { x, y };
        });
      }}
      className="relative bg-white py-16 lg:py-24 overflow-hidden border-b border-slate-100"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* 4 Product Cards with interactive parallax & hover micro-interactions */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 order-2 lg:order-1">
            <motion.div
              animate={{ x: client.x * 0.6, y: client.y * 0.6 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
              className="group relative flex flex-col items-center justify-center rounded-3xl bg-white/95 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                loading="lazy"
                src={ProductsOne}
                className="w-24 md:w-32 lg:w-36 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                alt="2D Game"
              />
              <h3 className="mt-4 text-sm md:text-base lg:text-lg font-bold text-slate-800 group-hover:text-[#0066CC] transition-colors">
                2D Game
              </h3>
            </motion.div>

            <motion.div
              animate={{ x: client.x * -0.6, y: client.y * -0.6 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
              className="group relative flex flex-col items-center justify-center rounded-3xl bg-white/95 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                loading="lazy"
                src={ProductsTwo}
                className="w-24 md:w-32 lg:w-36 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                alt="Web App"
              />
              <h3 className="mt-4 text-sm md:text-base lg:text-lg font-bold text-slate-800 group-hover:text-[#0066CC] transition-colors">
                Web App
              </h3>
            </motion.div>

            <motion.div
              animate={{ x: client.x * 0.4, y: client.y * 0.4 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
              className="group relative flex flex-col items-center justify-center rounded-3xl bg-white/95 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                loading="lazy"
                src={ProductsThree}
                className="w-24 md:w-32 lg:w-36 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                alt="Mobile App"
              />
              <h3 className="mt-4 text-sm md:text-base lg:text-lg font-bold text-slate-800 group-hover:text-[#0066CC] transition-colors">
                Mobile App
              </h3>
            </motion.div>

            <motion.div
              animate={{ x: client.x * -0.4, y: client.y * -0.4 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
              className="group relative flex flex-col items-center justify-center rounded-3xl bg-white/95 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                loading="lazy"
                src={ProductsFour}
                className="w-24 md:w-32 lg:w-36 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                alt="Model AI"
              />
              <h3 className="mt-4 text-sm md:text-base lg:text-lg font-bold text-slate-800 group-hover:text-[#0066CC] transition-colors">
                Model AI
              </h3>
            </motion.div>
          </div>

          {/* Right Column: Title, Description, CTA, Socials */}
          <div className="flex flex-col items-start lg:items-end text-left lg:text-right space-y-6 order-1 lg:order-2">
            <SectionTitle
              title="Sản phẩm"
              subtitle="Phần mềm và dịch vụ"
              textPosition="right"
            />

            <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-4 max-w-xl">
              <p>
                Sản phẩm của chúng tôi mang lại những cải tiến quan trọng, hỗ trợ
                các ngành công nghiệp và nâng cao trải nghiệm người dùng. Với các
                công nghệ hiện đại và luôn lấy người dùng làm trung tâm, chúng tôi
                cung cấp các giải pháp sáng tạo đáp ứng nhu cầu và thúc đẩy sự phát triển bền vững.
              </p>
              <p>
                Với đội ngũ lập trình viên đầy nhiệt huyết, chúng tôi cùng nhau
                tạo ra những giải pháp sáng tạo gồm ứng dụng Web, Di động, Hệ thống AI
                và tiện ích công nghệ tối ưu hóa quy trình.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/project"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0066CC] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-[#004C99] hover:shadow-lg active:scale-[0.98]"
              >
                <span>Khám phá Dự án</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Follow Socials */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-4">
              <span className="text-sm font-bold text-slate-900 tracking-wide">Follow FU-DEVER:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/FPTUDever"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook FU-DEVER"
                  aria-label="Facebook FU-DEVER"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1877F2] text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95"
                >
                  <Image loading="lazy" src={Facebook} alt="Facebook" className="w-5 h-5 object-contain" />
                </a>
                <a
                  href="https://github.com/fudever-club"
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub FU-DEVER"
                  aria-label="FU-DEVER Club on GitHub"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#24292F] text-white shadow-md shadow-slate-900/25 transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95"
                >
                  <Image loading="lazy" src={Github} alt="Github" className="w-5 h-5 object-contain" />
                </a>
                <a
                  href="https://www.tiktok.com/@daihocfptdanang"
                  target="_blank"
                  rel="noreferrer"
                  title="TikTok FU-DEVER"
                  aria-label="TikTok FU-DEVER"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#000000] text-white shadow-md shadow-black/25 transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95"
                >
                  <Image loading="lazy" src={Tiktok} alt="Tiktok" className="w-5 h-5 object-contain" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Wave SVG Layer */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 opacity-25 hidden md:block">
        <Image
          loading="lazy"
          src={Vector}
          className="w-auto h-[280px] lg:h-[380px] object-contain object-right-bottom"
          alt=""
        />
      </div>
    </section>
  );
}

export default Product;
