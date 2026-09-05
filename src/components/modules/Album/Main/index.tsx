"use client";
import SectionTittle from "@/src/components/core/common/SectionTitle";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";
import arrowRight from "@icons/pages/project/arrowRightNonColor.svg";
import arrowRightColor from "@icons/pages/project/arrowRight.svg";
import logo from "@icons/layout/logo.svg";
import { activityEndpointer } from "@/src/services/endpoint";
import axios from "axios";

const MainAlbum = ({ album }: any) => {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [images, setimages] = useState(album?.imageList || []);
  const [end, setEnd] = useState(false);
  const pageRef = useRef(2);
  const loadingRef = useRef(false);

  const getMoreAlbum = useCallback(async (pageNum: number) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${activityEndpointer.GET_ALBUM_BY_SLUG.replace(
        "{slug}",
        album?.slug
      )}?page=${pageNum}&limit=10`,
    };

    try {
      const response: any = await axios.request(config);
      if (
        response?.data?.data?.pagination?.currentPage >=
        response?.data?.data?.pagination?.totalPages
      ) {
        setEnd(true);
      }
      if (response?.data?.data?.album?.imageList) {
        setimages((prev: any[]) => [...prev, ...response.data.data.album.imageList]);
      }
    } catch (error) {
      return error;
    } finally {
      loadingRef.current = false;
    }
  }, [album?.slug]);

  useEffect(() => {
    if (inView && !end && !loadingRef.current) {
      loadingRef.current = true;
      const currentPage = pageRef.current;
      pageRef.current += 1;
      getMoreAlbum(currentPage);
    }
  }, [inView, end, getMoreAlbum]);

  return (
    <section className="min-h-screen pt-4 pb-20">
      <div className="relative xl:max-w-[1440px] mx-auto w-full h-full sm:px-[20px] md:px-[40px] xl:px-[80px] gap-[40px] flex flex-col">
        <div className="text-[14px] font-[400] leading-normal flex flex-row items-center opacity-70 gap-2">
          <Link href={`/`}>
            <div className="hover:text-primary">Trang chủ</div>
          </Link>
          <Image
            loading="lazy"
            className=""
            src={arrowRight}
            alt="right arrow"
          />
          <Link href={`/activity#album`}>
            <div className="hover:text-primary">Bộ sưu tập</div>
          </Link>
          <Image
            loading="lazy"
            className=""
            src={arrowRight}
            alt="right arrow"
          />
          <div className="font-[700]">{album?.name}</div>
        </div>
        <SectionTittle
          title={album?.name}
          subtitle={"Bộ sưu tập"}
          textPosition="left"
        />
        <ul className="xl:columns-4 md:columns-4 sm:columns-2 pb-[80px]">
          {images?.map((image: any, index: number) => (
            <li key={index} className="lg:py-2 sm:py-2">
              <Image
                loading="lazy"
                unoptimized
                src={image?.url}
                alt={image?.url || "Album image"}
                width={400}
                height={400}
                blurDataURL={image?.url}
                placeholder="blur"
                className="w-full h-full lg:rounded-[16px] sm:rounded-[8px]"
              />
            </li>
          ))}
        </ul>
        {!end && <div ref={ref} className="w-full h-[100px]" />}
        <button
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
          className="lg:w-[50px] sm:w-[40px] aspect-square fixed right-[10px] bottom-[20px] shadow-2xl rounded-full transition-all flex justify-center items-center group bg-transparent"
        >
          <Image
            src={arrowRightColor}
            alt="icon arrow"
            width={30}
            height={30}
            className="rotate-[-90deg] lg:w-[50px] sm:w-[40px] scale-0 group-hover:scale-100 aspect-square absolute bottom-0 lg:group-hover:bottom-[50px] sm:group-hover:bottom-[40px] transition-all"
          />
          <Image
            src={logo}
            alt="icon arrow"
            width={30}
            height={30}
            className="w-[50px] aspect-square"
          />
        </button>
      </div>
    </section>
  );
};

export default MainAlbum;
