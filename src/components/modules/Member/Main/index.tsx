import React from "react";
import Banner from "@components/modules/Member/Banner";
import ListLeaderMember from "@components/modules/Member/MemberLeader";
import ListMember from "@components/modules/Member/MemberNormal";

const Main = ({ leaderData, excellentData, memberData }: any) => {
  return (
    <div className="py-6 sm:py-8 max-w-[1440px] mx-auto min-h-screen">
      <Banner data={excellentData} />
      <section className="bg-[#FAFBFC] xl:px-[80px] md:px-[40px] sm:px-[20px] px-4 flex flex-col pt-8 pb-16">
        <ListLeaderMember data={leaderData} />
        <ListMember member={memberData} />
      </section>
    </div>
  );
};

export default Main;
