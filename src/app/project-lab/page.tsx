import { Metadata } from "next";
import DeverProjectLabBoard, { ProjectLabItem } from "@components/ui/DeverProjectLabBoard";
import { apiFetch } from "@/src/lib/api";

export const metadata: Metadata = {
  title: "FU-DEVER | Project Lab & Tìm Đồng Đội",
  description: "Không gian kết nối ý tưởng dự án và ghép đội làm sản phẩm thực tế dành cho các thành viên câu lạc bộ FU-DEVER.",
};

// Live recruitment board: never prerender stale failure/success at build.
export const dynamic = "force-dynamic";

const getProjectLabs = async (): Promise<ProjectLabItem[]> => {
  const response = await apiFetch(`/api/v1/project-lab`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Project Lab request failed: ${response.status}`);
  }
  const payload = await response.json();
  return Array.isArray(payload?.data) ? payload.data : [];
};

export default async function ProjectLabPage() {
  const projects = await getProjectLabs();
  return <DeverProjectLabBoard projects={projects} />;
}
