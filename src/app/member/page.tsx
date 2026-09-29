import { fetchJson } from "@/src/lib/api";
import { userEndpoint } from "@/src/services/endpoint";

import MainMember from "@components/modules/Member/Main";

export const metadata = {
  title: "FU-DEVER | Thành viên",
  description:
    "Gặp gỡ các thành viên tài năng của FU-DEVER. Cộng đồng lập trình viên đa dạng của chúng tôi, từ người mới bắt đầu đến chuyên gia, cộng tác trong các dự án đổi mới, chia sẻ kiến thức và cùng nhau phát triển trong thế giới công nghệ.",
  icons: {
    icon: "/icons/layout/logo.png",
  },
  openGraph: {
    images: ["/images/layouts/member.png"],
    title: "FU-DEVER | Câu lạc bộ lập trình FU-DEVER",
    description:
      "Chào mừng bạn đến với FU-DEVER, câu lạc bộ lập trình của Đại học FPT! . Tại FU-DEVER, chúng tôi cố gắng thúc đẩy một cộng đồng sôi động gồm các lập trình viên đầy tham vọng và cung cấp nền tảng để phát triển kỹ năng và cộng tác.",
  },
};

type UsersPayload = { data?: { users?: unknown[] } };

// Errors propagate to the route error boundary (`member/error.tsx`) so a
// backend failure renders an honest error state, never a silent empty list.
const getUsers = async (query: string): Promise<unknown[]> => {
  const payload = await fetchJson<UsersPayload>(
    `${userEndpoint.GET_ALL_USERS}?${query}`,
    { next: { revalidate: 20 } }
  );
  const users = payload?.data?.users;
  if (!Array.isArray(users)) {
    throw new Error("Member list response violated the API contract");
  }
  return users;
};

const getLeader = () =>
  getUsers(`filter=${encodeURIComponent('{"isLeader": true}')}`);
const getExcellent = () =>
  getUsers(`filter=${encodeURIComponent('{"isExcellent": true}')}`);
const getUser = () =>
  getUsers(
    `page=1&limit=8&filter=${encodeURIComponent('{"isLeader": false}')}`
  );
async function Member() {
  const [leaderData, excellentData, memberData] = await Promise.all([
    getLeader(),
    getExcellent(),
    getUser(),
  ]);
  return (
    <MainMember
      leaderData={leaderData}
      excellentData={excellentData}
      memberData={memberData}
    />
  );
}
export default Member;
export const revalidate = 20;
