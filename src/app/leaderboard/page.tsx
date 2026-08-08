import LeaderboardModule from "@components/modules/Leaderboard/Main";

export const metadata = {
  title: "FU-DEVER | Bảng xếp hạng",
  description:
    "Kiểm tra bảng xếp hạng FU-DEVER! Xem những người có thành tích cao nhất và theo dõi tiến trình của bạn khi bạn cạnh tranh trong các thử thách lập trình và đóng góp cho các dự án thú vị. Hãy tham gia cùng chúng tôi và thăng hạng trong cộng đồng lập trình sôi động của chúng tôi.",
  icons: {
    icon: "/icons/layout/logo.png",
  },
  openGraph: {
    images: ["/images//layouts/leaderboard.png"],
    title: "FU-DEVER | Câu lạc bộ lập trình FU-DEVER",
    description:
      "Chào mừng bạn đến với FU-DEVER, câu lạc bộ lập trình của Đại học FPT! . Tại FU-DEVER, chúng tôi cố gắng thúc đẩy một cộng đồng sôi động gồm các lập trình viên đầy tham vọng và cung cấp nền tảng để phát triển kỹ năng và cộng tác.",
  },
};

type LeaderboardEntry = {
  leetcodeUsername?: string;
  acSubmissionList?: unknown[];
  user?: {
    firstname?: string | null;
    lastname?: string | null;
    avatar?: string | null;
    profileKey?: string | null;
  } | null;
};

const getLeaderboard = async (): Promise<{ data: LeaderboardEntry[]; error: boolean }> => {
  const productionApi = "https://dever-backend-production.up.railway.app";
  try {
    const response = await fetch(`${productionApi}/api/v1/leetcode`, { cache: "no-store" });
    if (!response.ok) return { data: [], error: true };

    const payload = await response.json();
    if (Array.isArray(payload?.data)) return { data: payload.data, error: false };
  } catch {
    // The rendered module presents a recovery state instead of stale sample data.
  }

  return { data: [], error: true };
};

export default async function LeaderBoardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <>
      <LeaderboardModule leaderboardData={leaderboard.data} hasLoadError={leaderboard.error} />
    </>
  );
}
export const revalidate = 60;
export const dynamic = "force-dynamic";
