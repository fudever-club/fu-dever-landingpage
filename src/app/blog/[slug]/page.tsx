import { notFound } from "next/navigation";
import { Metadata } from "next";
import DeverBlogRenderer from "@components/ui/DeverBlogRenderer";

type Props = { params: { slug: string } };

const FALLBACK_POSTS: Record<string, any> = {
  "lam-chu-nextjs-14-app-router": {
    slug: "lam-chu-nextjs-14-app-router",
    title: "Làm Chủ Next.js 14 App Router & Tối Ưu Hóa Server Components",
    category: "Web & Frontend",
    tags: ["React", "Next.js", "TypeScript", "Performance"],
    author: {
      name: "Lê Đức Anh Phương",
      role: "Lead Developer FU-DEVER",
      avatar: "https://i.ibb.co/TgXZgwv/445356269-973328174802658-3860307921523704298-n.jpg",
    },
    createdAt: "2026-08-05T08:00:00Z",
    readTime: "6 phút đọc",
    excerpt:
      "Tổng hợp kinh nghiệm thực chiến kiến trúc Next.js 14 App Router, cách quản lý State mượt mà và khắc phục triệt để lỗi HMR useContext trong dự án lớn.",
    likes: 142,
    content: `# Giới Thiệu Về Kiến Trúc Next.js 14

Next.js 14 mang đến bước nhảy vọt về hiệu năng nhờ **React Server Components (RSC)** và cơ chế Server Actions hiện đại.

> [!NOTE]
> Mọi component trong thư mục \`app/\` mặc định là Server Component, giúp giảm tối đa dung lượng JavaScript tải về trình duyệt của người dùng.

## 1. Tối Ưu Hóa State Management & Server Actions

Khi triển khai các ứng dụng quy mô lớn, việc đồng bộ giữa Server State và Client Cache đóng vai trò then chốt:

\`\`\`typescript
// Thử nghiệm tính năng chạy code trực tiếp trên DEVER
function calculateOptimization(renderTime: number, cacheHit: boolean) {
  const result = cacheHit ? renderTime * 0.1 : renderTime;
  console.log("⚡ Thời gian render sau tối ưu:", result + "ms");
  return result;
}

calculateOptimization(120, true);
\`\`\`

## 2. Bảng So Sánh Hiệu Năng SSR vs CSR

| Cơ Chế Render | Time to Interactive (TTI) | First Contentful Paint (FCP) | SEO Score |
| :--- | :--- | :--- | :--- |
| Server-Side Rendering (SSR) | 120ms | 80ms | 100/100 |
| Client-Side Rendering (CSR) | 450ms | 320ms | 75/100 |
| Static Site Generation (SSG) | 60ms | 40ms | 100/100 |

> [!TIP]
> Luôn sử dụng Compound Index trong MongoDB kết hợp với Redis Caching Layer để đạt tốc độ truy vấn P99 < 15ms.

### Kết Luận & Hướng Mở Rộng
Việc nắm vững Server Actions và cơ chế Suspense Streaming giúp lập trình viên DEVER xây dựng những ứng dụng web đạt chuẩn quốc tế.`,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const API_SERVER =
    process.env.NEXT_PUBLIC_API_SERVER ||
    "http://localhost:5000";
  const servers = [API_SERVER, "https://dever-backend-production.up.railway.app"];

  for (const server of servers) {
    try {
      const response = await fetch(
        `${server}/api/v1/blogs/slug/${encodeURIComponent(params.slug)}`,
        { next: { revalidate: 60 } }
      );
      if (response.ok) {
        const payload = await response.json();
        const post = payload.data;
        return {
          title: `${post.title} | FU-DEVER Tech Blog`,
          description: post.excerpt || "Chia sẻ kiến thức kỹ thuật từ CLB FU-DEVER.",
          openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
          },
        };
      }
    } catch {}
  }

  const fallback = FALLBACK_POSTS[params.slug];
  if (fallback) {
    return {
      title: `${fallback.title} | FU-DEVER Tech Blog`,
      description: fallback.excerpt,
    };
  }

  return {
    title: "Bài viết kỹ thuật | FU-DEVER",
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const API_SERVER =
    process.env.NEXT_PUBLIC_API_SERVER ||
    "http://localhost:5000";
  const servers = [API_SERVER, "https://dever-backend-production.up.railway.app"];

  for (const server of servers) {
    try {
      const response = await fetch(
        `${server}/api/v1/blogs/slug/${encodeURIComponent(params.slug)}`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const payload = await response.json();
        if (payload?.data) {
          return <DeverBlogRenderer post={payload.data} />;
        }
      }
    } catch {}
  }

  const fallbackPost = FALLBACK_POSTS[params.slug];
  if (fallbackPost) {
    return <DeverBlogRenderer post={fallbackPost} />;
  }

  notFound();
}
