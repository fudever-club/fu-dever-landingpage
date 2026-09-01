import Image from "next/image";
import React from "react";
import workshop from "@images/pages/activity/activities/workshop.jpg";
import training from "@images/pages/activity/activities/training.jpg";
import contest from "@images/pages/activity/activities/contest.jpg";

import SectionTitle from "@components/core/common/SectionTitle";
import Album from "../Album";
import Slider from "../Slider";

function Activities({ data, albums }: any) {
  const academicActivities = [
    {
      img: workshop,
      title: "Workshop",
      alt: "workshopImg",
      desc: "Mang lại cơ hội quý giá cho việc học tập thông qua thực hành trực tiếp",
    },
    {
      img: training,
      title: "Training",
      alt: "trainingImg",
      desc: "Đào tạo cung cấp kỹ năng cá nhân và kỹ năng chuyên môn",
    },
    {
      img: contest,
      title: "Contest",
      alt: "ContestImg",
      desc: "Thử thách bản với các cuộc thi nghẹt thở với những phần thưởng hấp dẫn",
    },
  ];

  return (
    <>
      <section className="w-full h-full flex flex-col justify-center items-center bg-[#F8FCFF]">
        <div className="max-w-[1440px] w-full h-full  flex flex-col justify-center items-center">
          <div className="flex flex-col w-full px-5 md:px-10 xl:px-20 py-10 md:py-16">
            <SectionTitle
              title="HỌC THUẬT"
              subtitle="Chia sẻ kiến thức, cạnh tranh lành mạnh"
              textPosition="left"
            ></SectionTitle>
            <div className="flex flex-col mt-6 md:flex-row gap-6 md:gap-8 justify-between w-full">
              {academicActivities.map((activity, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-4 bg-white p-6 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="overflow-hidden rounded-2xl w-full h-48 sm:h-56 md:h-44 lg:h-56 xl:h-64">
                    <Image
                      loading="lazy"
                      src={activity.img}
                      alt={activity.alt}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col items-center max-w-[310px] w-full text-center">
                    <p className="text-2xl md:text-3xl font-extrabold text-[#0066CC] mb-2 tracking-tight">
                      {activity.title}
                    </p>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {activity.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Slider images={data?.images} />
      </section>
      <Album albums={albums} />
    </>
  );
}

export default Activities;
