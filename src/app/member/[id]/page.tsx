import React from "react";
import MainMemberDetail from "@/src/components/modules/MemberDetail/Detail";
import axios from "axios";
import { userEndpoint } from "@/src/services/endpoint";

const fetchUserByNickname = async (nickname: string) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: userEndpoint.GET_USER_DETAIL_BY_NICKNAME.replace("{nickname}", nickname),
  };

  try {
    const response = await axios.request(config);
    return response;
  } catch (error) {
    return error;
  }
};

const getFallbackUser = (id: string) => {
  return {
    _id: id,
    firstname: "Đức Anh",
    lastname: "Phương",
    nickname: id,
    avatar: "/images/pages/leaderBoard/avatar_default.png",
    email: "phuongle@dever.club",
    description:
      "Xin chào! Tôi là thành viên tại CLB Lập Trình FU-DEVER. Đam mê xây dựng các sản phẩm phần mềm hiện đại, kiến trúc Fullstack và thuật toán tối ưu cùng cộng đồng lập trình viên FPTU.",
    positionId: {
      name: "Chủ Nhiệm • Ban Chuyên Môn",
    },
    gen: 9,
    MSSV: "DE180001",
    skills: ["Next.js 14", "TypeScript", "Tailwind CSS", "Node.js", "Docker", "Algorithms", "MongoDB"],
    totalSolved: 185,
    facebook: "https://facebook.com/fu.dever.club",
    github: "https://github.com/fu-dever",
    linkedin: "https://linkedin.com",
  };
};

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  const data: any = await fetchUserByNickname(id);
  const user = data?.data?.data || getFallbackUser(id);
  const name = `${user?.firstname || ""} ${user?.lastname || ""}`.trim() || "Thành viên DEVER";
  return {
    title: `FU-DEVER | ${name}`,
    description: user?.description || "Hồ sơ thành viên CLB Lập Trình FU-DEVER.",
    icons: {
      icon: "/icons/layout/logo.png",
    },
    openGraph: {
      images: [user?.avatar || "/images/layouts/member.png"],
      title: `FU-DEVER | ${name}`,
      description: `${name} là thành viên nhiệt huyết trong câu lạc bộ FU-DEVER.`,
    },
  };
}

const Member = async ({ params: { id } }: { params: { id: string } }) => {
  const res: any = await fetchUserByNickname(id);
  const user = res?.data?.data || getFallbackUser(id);
  return <MainMemberDetail user={user} />;
};

export default Member;
