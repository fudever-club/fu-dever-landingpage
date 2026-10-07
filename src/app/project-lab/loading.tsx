// Loading skeleton for /project-lab: mirrors the white hero + bento + card
// grid so the layout does not jump when live data arrives.
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FCFF] pb-16 pt-4" role="status" aria-label="Đang tải danh sách dự án">
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-3xl animate-pulse px-5 py-12 text-center motion-reduce:animate-none">
          <div className="mx-auto h-4 w-48 rounded bg-slate-200" />
          <div className="mx-auto mt-4 h-9 w-3/4 rounded-lg bg-slate-200" />
          <div className="mx-auto mt-4 h-4 w-2/3 rounded bg-slate-100" />
          <div className="mx-auto mt-6 h-11 w-full max-w-xl rounded-2xl bg-slate-100" />
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="h-4 w-28 rounded bg-slate-100" />
            <div className="h-4 w-28 rounded bg-slate-100" />
            <div className="h-4 w-24 rounded bg-slate-100" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 lg:px-20">
        <div className="mt-8 grid animate-pulse grid-cols-1 gap-4 motion-reduce:animate-none lg:grid-cols-3" aria-hidden="true">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 lg:col-span-2 lg:p-8">
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-slate-200" />
              <div className="h-6 w-20 rounded-md bg-slate-100" />
            </div>
            <div className="mt-4 h-7 w-2/3 rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-full rounded bg-slate-100" />
            <div className="mt-1 h-4 w-5/6 rounded bg-slate-100" />
            <div className="mt-4 flex gap-1.5">
              <div className="h-7 w-20 rounded-md bg-slate-100" />
              <div className="h-7 w-24 rounded-md bg-slate-100" />
              <div className="h-7 w-16 rounded-md bg-slate-100" />
            </div>
            <div className="mt-6 h-11 w-40 rounded-xl bg-slate-200" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="mt-4 space-y-3">
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-4/5 rounded bg-slate-100" />
              </div>
            </div>
            <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6">
              <div className="h-5 w-36 rounded bg-slate-200" />
              <div className="mt-4 h-4 w-full rounded bg-slate-100" />
              <div className="mt-4 h-11 w-full rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid animate-pulse grid-cols-1 gap-4 motion-reduce:animate-none md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6">
              <div className="flex gap-2">
                <div className="h-6 w-24 rounded-full bg-slate-200" />
                <div className="h-6 w-20 rounded-md bg-slate-100" />
              </div>
              <div className="mt-3 h-6 w-3/4 rounded-lg bg-slate-200" />
              <div className="mt-2 h-4 w-full rounded bg-slate-100" />
              <div className="mt-1 h-4 w-5/6 rounded bg-slate-100" />
              <div className="mt-4 h-11 w-full rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
