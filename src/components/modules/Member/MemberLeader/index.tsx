"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import SectionTittle from "@components/core/common/SectionTitle";
import Sekeleton from "@/src/components/core/common/Sekeleton";
import { TiltedCard } from "@components/ui/TiltedCard";

const parent: any = {
  show: {
    transition: {
      type: "spring",
      bounce: 0.8,
      duration: 0.5,
      staggerChildren: 0.15,
    },
  },
};

const child: any = {
  hidden: {
    x: 20,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1,
    },
  },
};

const initialData = Array(4).fill(null);

const ListLeaderMember = ({ data = initialData }: { data: any }) => {
  return (
    <article className="md:py-[60px] sm:py-[40px]">
      <div className="xl:max-w-[1280px] mx-[auto]">
        <div className="justify-between relative items-end md:flex-row flex sm:flex-col md:items-end sm:items-start xl:gap-0 sm:gap-[25px] w-[100%] h-[auto]">
          <SectionTittle
            title="CÁC THÀNH VIÊN LÃNH ĐẠO CỦA CÂU LẠC BỘ"
            subtitle="Những trụ cột đặc biệt của chúng tôi"
            textPosition="left"
          />
        </div>
        <motion.ul
          initial="hidden"
          whileInView="show"
          variants={parent}
          className="mt-6 sm:mt-8 md:mt-10 xl:mt-7 w-full gap-3.5 sm:gap-5 md:gap-8 xl:gap-10 flex-wrap flex justify-center sm:justify-start"
        >
          {data?.map((user: any, index: number) => {
            if (!user) {
              return (
                <motion.li
                  variants={child}
                  key={`skeleton-${index}`}
                  className="overflow-hidden rounded-[20px_0] xl:w-[calc((100%-40px*3)/4)] md:w-[calc((100%-35px*3)/4)] xl:aspect-[29/40] lg:aspect-[7/10] md:aspect-[146/204] sm:aspect-[93/123] sm:w-[calc((100%-20px*1)/2)] relative"
                >
                  <Sekeleton />
                </motion.li>
              );
            }

            const fullName = user?.firstname || user?.lastname
              ? `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim()
              : "Thành viên DEVER";
            const kCohort = user?.MSSV ? `K${user?.MSSV?.slice(2, 4)}` : (user?.gen ? `GEN ${user.gen}` : "");
            const position = user?.positionId?.name || "Ban Chủ Nhiệm";
            const memberLink = user?.profileKey
              ? `/member/${encodeURIComponent(user.profileKey)}`
              : `/member/${user?.nickname ?? user?._id}`;

            return (
              <motion.li
                variants={child}
                key={user?._id || `leader-${index}`}
                className="w-full sm:w-[calc((100%-20px*1)/2)] md:w-[calc((100%-35px*3)/4)] xl:w-[calc((100%-40px*3)/4)] aspect-[3/4] sm:aspect-[93/123] md:aspect-[146/204] lg:aspect-[7/10] xl:aspect-[29/40] cursor-pointer relative"
              >
                <Link href={memberLink} className="block w-full h-full">
                  <TiltedCard
                    imageSrc={user?.avatar || "/images/pages/leaderBoard/avatar_default.png"}
                    altText={`${fullName} - ${position}`}
                    captionText={`✨ ${fullName} • ${position} ${kCohort ? `(${kCohort})` : ""}`}
                    rotateAmplitude={12}
                    scaleOnHover={1.06}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={true}
                    imageClassName="rounded-tl-[20px] rounded-br-[20px] object-cover border border-blue-200/50 shadow-xl"
                    overlayContent={
                      <div className="h-[auto] w-[100%] rounded-br-[20px] overflow-hidden">
                        {/* K Cohort Tag */}
                        {kCohort && (
                          <div className="flex justify-center py-1 px-3 w-fit ml-auto rounded-tl-lg bg-[#FF7171] text-white text-[11px] font-bold shadow-sm">
                            {kCohort}
                          </div>
                        )}
                        {/* Info Bottom Bar */}
                        <div className="w-[100%] p-3 sm:p-4 bg-gradient-to-t from-[#002D66]/95 via-[#004C99]/90 to-transparent text-white rounded-br-[20px]">
                          <h4 className="font-bold text-sm sm:text-base truncate leading-snug">
                            {fullName}
                          </h4>
                          <div className="text-[11px] sm:text-xs text-blue-100 flex justify-between items-center mt-1">
                            <span className="truncate opacity-90">{position}</span>
                            {user?.gen && <span className="font-bold shrink-0 ml-1">GEN {user.gen}</span>}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </article>
  );
};

export default ListLeaderMember;
