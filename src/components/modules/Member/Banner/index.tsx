"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import arrow from "@icons/pages/member/banner/arrow.svg";

const parent: any = {
  show: {
    transition: {
      staggerChildren: 0.1,
      type: "spring",
      duration: 0.5,
      bounce: 0.8,
    },
  },
};

const child: any = {
  hidden: (index: number) => ({
    x: -20 * (index + 1),
    opacity: 0,
  }),
  show: {
    x: 0,
    opacity: 1,
  },
};

function MemberCardImage({ user }: { user: any }) {
  const [imgError, setImgError] = useState(false);
  const fullName =
    [user?.firstname, user?.lastname].filter(Boolean).join(" ") ||
    "Thành viên DEVER";
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(-2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "DV";

  if (!user || !user.avatar || imgError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100/70 p-2 sm:p-3 text-center border border-blue-200/80 shadow-xs select-none">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0066CC] to-[#0080FF] text-white font-black text-xs sm:text-sm shadow-md mb-1.5 sm:mb-2">
          {initials}
        </div>
        <span className="text-[11px] sm:text-xs font-bold text-slate-800 line-clamp-1 leading-tight">
          {fullName}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-[#0066CC] mt-0.5">
          {user?.position?.name || "Tiêu biểu"}
        </span>
      </div>
    );
  }

  return (
    <img
      loading="lazy"
      className="pointer-events-none object-cover rounded-2xl w-full h-full shadow-sm border border-slate-200"
      alt=""
      aria-hidden="true"
      src={user.avatar}
      onError={() => setImgError(true)}
    />
  );
}

const TopTypical = ({ data }: { data: any }) => {
  // Only display valid users or up to 5 items
  const displayList = Array.isArray(data) && data.length > 0 ? data.slice(0, 5) : [];

  return (
    <article className="xl:max-w-[1440px] mx-auto">
      <div className="xl:px-[80px] md:px-[40px] sm:px-[20px] px-4 flex flex-col text-center">
        <h1 className="font-black text-[#0098FF] drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] uppercase text-2xl sm:text-3xl md:text-4xl lg:text-[40px] tracking-tight mx-auto">
          TRONG FU - DEVER CÓ AI?
        </h1>
        <p className="text-[#0065A9] font-bold text-xs sm:text-sm md:text-base lg:text-lg mt-3 sm:mt-4 mb-2">
          2026 - Những gương mặt tiêu biểu của câu lạc bộ
        </p>

        {displayList.length > 0 && (
          <motion.ul
            initial="hidden"
            whileInView={"show"}
            variants={parent}
            className="flex flex-wrap justify-center items-stretch gap-2.5 sm:gap-4 lg:gap-6 my-6 w-full"
          >
            {displayList.map((user: any, index: any) => (
              <motion.li
                custom={index}
                variants={child}
                key={user?._id || index}
                className="w-[calc((100%-20px)/2)] sm:w-[calc((100%-32px)/3)] md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-96px)/5)] aspect-[3/4] sm:aspect-[9/13]"
              >
                <MemberCardImage user={user} />
              </motion.li>
            ))}
          </motion.ul>
        )}

        <p className="mt-4 text-xs sm:text-sm md:text-base text-[#0065A9] font-bold">
          Mỗi thành viên là một phần nhỏ trong sự phát triển thành công của câu lạc bộ.
        </p>
        <div className="mt-3 mx-auto w-48 sm:w-80 md:w-96 lg:w-[500px] bg-[#0098FF] h-1 rounded-full"></div>
        <Image
          loading="lazy"
          className="pointer-events-none w-5 h-7 sm:w-6 sm:h-9 mx-auto my-3"
          src={arrow}
          alt=""
          width={24}
          height={36}
        />
      </div>
    </article>
  );
};

export default TopTypical;
