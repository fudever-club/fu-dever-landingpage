import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export default async function BlogDetailPage({ params }: Props) {
  const response = await fetch(`https://dever-backend-production.up.railway.app/api/v1/blogs/slug/${encodeURIComponent(params.slug)}`, { cache: "no-store" });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Không thể tải bài viết");
  const payload = await response.json();
  const post = payload.data;
  return <main className="min-h-screen bg-[#F8FCFF] px-5 pb-20 pt-28"><article className="mx-auto max-w-3xl rounded-3xl border border-blue-100 bg-white p-6 shadow-sm lg:p-12"><Link href="/blog" className="text-sm font-bold text-[#0066CC] hover:underline">← Quay lại Blog</Link><p className="mt-8 text-xs font-extrabold uppercase tracking-wider text-[#0066CC]">{post.category}</p><h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 lg:text-5xl">{post.title}</h1><p className="mt-5 text-base font-medium leading-relaxed text-slate-600">{post.excerpt}</p><div className="my-8 border-t border-blue-100" /><div className="prose prose-slate max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.content || "Nội dung bài viết đang được cập nhật." }} /></article></main>;
}
