import MainAlbum from "@/src/components/modules/Album/Main";
import { activityEndpointer } from "@/src/services/endpoint";
import { ApiError, fetchJson } from "@/src/lib/api";
import { notFound } from "next/navigation";

type AlbumPayload = { data?: { album?: unknown } };

// 404 surfaces as notFound(); any other failure throws so the route error
// boundary (`activity/[id]/error.tsx`) renders an honest error with retry.
const getAlbumBySlug = async (slug: string) => {
  try {
    const payload = await fetchJson<AlbumPayload>(
      activityEndpointer.GET_ALBUM_BY_SLUG.replace("{slug}", encodeURIComponent(slug)),
      { next: { revalidate: 60 } }
    );
    return payload?.data?.album ?? null;
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
  const album: any = await getAlbumBySlug(id);
  const coverImage = album?.imageList?.[0];
  return {
    title: `FU-DEVER | ${album?.name}`,
    description:
      "Chào mừng bạn đến với FU-DEVER, câu lạc bộ lập trình của Đại học FPT! . Tại FU-DEVER, chúng tôi luôn tổ chức các hoạt động với các thành viên đầy nhiệt huyết để tạo nên những phút giây tuyệt vơi và tại đây sẽ lưu giữ những kỉ niệm đó.",
    icons: {
      icon: "/icons/layout/logo.png",
    },
    openGraph: {
      ...(typeof coverImage === "string" && coverImage ? { images: [coverImage] } : {}),
      title: `FU-DEVER |  ${album?.name}`,
      description: `${album?.description}`,
    },
  };
}

const Album = async ({ params: { id } }: { params: { id: string } }) => {
  const album = await getAlbumBySlug(id);
  if (!album) {
    notFound();
  }
  return <MainAlbum album={album ?? []} />;
};

export default Album;
