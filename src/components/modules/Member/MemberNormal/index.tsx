"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import SectionTittle from "@components/core/common/SectionTitle";
import { useInView } from "framer-motion";
import { userEndpoint } from "@/src/services/endpoint";
import axios from "axios";
import Loading from "@components/modules/Member/Loading";
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

const initialData = Array(10).fill(null);

const ListMember = ({ member = initialData }: { member: any }) => {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [data, setData] = useState(member);
  const [page, setPage] = useState<number>(2);
  const [end, setEnd] = useState(false);

  const getMoreUser = async (pageNum: number) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${userEndpoint.GET_ALL_USERS}?page=${pageNum}&limit=8&filter={"isLeader":false}`,
    };

    try {
      const response: any = await axios.request(config);
      if (response?.data?.currentPage === response?.data?.totalPages) {
        setEnd(true);
      }
      if (response?.data?.data?.users) {
        setData((prev: any[]) => [...prev, ...response.data.data.users]);
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (inView && !end) {
      getMoreUser(page);
      setPage((prev) => prev + 1);
    }
  }, [inView, end]);

  return (
    <article className="md:pb-[60px] sm:pb-[40px]">
      <div className="xl:max-w-[1280px] mx-[auto] px-[auto]">
        <div className="justify-between relative items-end md:flex-row flex sm:flex-col md:items-end sm:items-start xl:gap-0 sm:gap-[25px] w-[100%] h-[auto]">
          <SectionTittle
            title="CÁC THÀNH VIÊN CỦA CÂU LẠC BỘ"
            subtitle="Những thành viên đầy nhiệt huyết"
            textPosition="left"
          />
        </div>
        <motion.ul
          initial="hidden"
          animate="show"
          variants={parent}
          className="xl:mt-[28px] w-[100%] md:mt-[40px] sm:mt-[20px] xl:gap-[40px] md:gap-[35px] sm:gap-[20px] flex-wrap flex justify-start"
        >
          {data?.map((user: any, index: number) => {
            if (!user) return null;

            const fullName = user?.firstname || user?.lastname
              ? `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim()
              : "Thành viên DEVER";
            const kCohort = user?.MSSV ? `K${user?.MSSV?.slice(2, 4)}` : (user?.gen ? `GEN ${user.gen}` : "");
            const position = user?.positionId?.name || "Thành viên";
            const memberLink = user?.profileKey
              ? `/member/${encodeURIComponent(user.profileKey)}`
              : `/member/${user?.nickname ?? user?._id}`;

            return (
              <motion.li
                variants={child}
                key={user?.profileKey || user?._id || `member-${index}`}
                className="xl:w-[calc((100%-40px*3)/4)] md:w-[calc((100%-35px*3)/4)] xl:aspect-[29/40] lg:aspect-[7/10] md:aspect-[146/204] sm:aspect-[93/123] sm:w-[calc((100%-20px*1)/2)] cursor-pointer relative"
              >
                <Link href={memberLink} className="block w-full h-full">
                  <TiltedCard
                    imageSrc={user?.avatar || "/images/pages/leaderBoard/avatar_default.png"}
                    altText={`${fullName} - Thành viên DEVER`}
                    captionText={`🚀 ${fullName} • ${position} ${kCohort ? `(${kCohort})` : ""}`}
                    rotateAmplitude={12}
                    scaleOnHover={1.06}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={true}
                    imageClassName="rounded-tl-[20px] rounded-br-[20px] object-cover border border-slate-200/80 shadow-lg"
                    overlayContent={
                      <div className="h-[auto] w-[100%] rounded-br-[20px] overflow-hidden">
                        {/* K Cohort Tag */}
                        {kCohort && (
                          <div className="flex justify-center py-1 px-3 w-fit ml-auto rounded-tl-lg bg-[#C69C6D] text-white text-[11px] font-bold shadow-sm">
                            {kCohort}
                          </div>
                        )}
                        {/* Info Bottom Bar */}
                        <div className="w-[100%] p-3 sm:p-4 bg-gradient-to-t from-[#002D66]/95 via-[#004C99]/90 to-transparent text-white rounded-br-[20px]">
                          <h4 className="font-bold text-sm sm:text-base truncate leading-snug">
                            {fullName}
                          </h4>
                          <div className="text-[11px] sm:text-xs text-blue-100 flex justify-between items-center mt-1">
                            <span className="truncate opacity-90">{user?.MSSV ? `MSSV: ${user.MSSV}` : position}</span>
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
        {!end && <Loading myRef={ref} />}
      </div>
    </article>
  );
};

export default ListMember;
