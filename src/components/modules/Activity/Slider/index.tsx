"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
  Thumbs,
  FreeMode,
} from "swiper/modules";
import SectionTitle from "@components/core/common/SectionTitle";
import Image from "next/image";
import { useState } from "react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./styles.css";

function Slider({ images }: any) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  // Honest states only: null = fetch failed, [] = no photos yet. Stock
  // stand-ins must never impersonate club photos.
  const hasImages = Array.isArray(images) && images.length > 0;
  const loadFailed = images === null || images === undefined;

  return (
    <div className="w-full">
      <div className="max-w-[1440px] mx-auto flex gap-[40px] flex-col w-full xl:px-[80px] md:px-[40px] sm:px-[20px] md:py-[60px] sm:py-[40px]">
        <SectionTitle
          title="ẢNH TIÊU BIỂU "
          subtitle="Chia sẽ kiến thức, cạnh tranh lành mạnh"
          textPosition="left"
        ></SectionTitle>
        <div className="overflow-hidden mt-[20px] w-full">
          {!hasImages ? (
            <div
              role={loadFailed ? "alert" : undefined}
              className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center text-sm text-slate-500"
            >
              {loadFailed
                ? "Không thể tải ảnh hoạt động. Vui lòng thử lại sau."
                : "Chưa có ảnh hoạt động. Ban Chủ Nhiệm sẽ cập nhật sớm nhất."}
            </div>
          ) : (
          <>
          <Swiper
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            rewind={true}
            effect={"coverflow"}
            pagination={true}
            navigation={true}
            grabCursor={true}
            centeredSlides={true}
            thumbs={
              thumbsSwiper && !thumbsSwiper.destroyed
                ? { swiper: thumbsSwiper }
                : undefined
            }
            spaceBetween={10}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            modules={[
              EffectCoverflow,
              Pagination,
              Navigation,
              Autoplay,
              Thumbs,
            ]}
            className="mySwiper"
            style={{
              overflow: "visible",
              width: "100%",
            }}
          >
            {images.map((image: any) => (
              <SwiperSlide key={image._id} style={{ width: "50%" }}>
                <Image
                  loading="lazy"
                  unoptimized
                  src={image?.url}
                  alt={image?.createdAt || "FU-DEVER Activity"}
                  width={400}
                  height={400}
                  className="w-full h-full aspect-[16/9] object-cover"
                ></Image>
              </SwiperSlide>
            ))}
          </Swiper>
          <Swiper
            onSwiper={(props: any) => setThumbsSwiper(props)}
            spaceBetween={10}
            grabCursor
            loop={images.length > 3}
            slidesPerView={Math.min(images.length, 8)}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper2"
            style={{
              marginTop: "20px",
              width: "100%",
            }}
          >
            {images.map((image: any) => (
              <SwiperSlide key={image._id}>
                <Image
                  src={image?.url}
                  unoptimized
                  alt={image?.createdAt || "FU-DEVER Activity"}
                  width={400}
                  height={400}
                  loading="lazy"
                  className="w-full transition-all aspect-[16/9] object-cover cursor-pointer grayscale"
                ></Image>
              </SwiperSlide>
            ))}
          </Swiper>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Slider;
