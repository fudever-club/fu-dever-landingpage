import { projectEndpoint } from "@/src/services/endpoint";
import { ApiError, fetchJson } from "@/src/lib/api";

import MainProject from "@components/modules/Post/Main";
import { notFound } from "next/navigation";

type ProjectPayload = { data?: unknown };

// 404 surfaces as notFound(); any other failure throws so the route error
// boundary (`project/error.tsx`) renders an honest error with retry.
const getDetailProject = async (id: string) => {
  try {
    const payload = await fetchJson<ProjectPayload>(
      projectEndpoint.GET_PROJECT_BY_SLUG.replace("{slug}", encodeURIComponent(id)),
      { next: { revalidate: 60 } }
    );
    return payload?.data ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
};

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}) {
  const project: any = await getDetailProject(id);
  const title = project?.title ?? "Dự án";
  return {
    title: `FU-DEVER | ${title}`,
    description:
      "Chào mừng bạn đến với FU-DEVER, câu lạc bộ lập trình của Đại học FPT! . Tại FU-DEVER, chúng tôi cố gắng thúc đẩy một cộng đồng sôi động gồm các lập trình viên đầy tham vọng và cung cấp nền tảng để phát triển kỹ năng và cộng tác.",
    icons: {
      icon: "/icons/layout/logo.png",
    },
    openGraph: {
      images: [project?.image],
      title: `FU-DEVER | ${project?.title}`,
      description: `${project?.subTitle}`,
    },
  };
}

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const project = await getDetailProject(id);
  if (!project) {
    notFound();
  }
  return <MainProject project={project ?? {}} />;
}
