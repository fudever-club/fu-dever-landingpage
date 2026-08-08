import React from "react";
import Image from "next/image";

const DUMMY_OPEN_SOURCE = [
  { id: 1, title: "dever-cli", description: "Công cụ CLI giúp setup dự án nhanh cho thành viên CLB.", author: "Nhật Quang", stars: 12 },
  { id: 2, title: "fptu-timetable", description: "Extension Chrome hỗ trợ xếp lịch học cho sinh viên FPTU.", author: "Vũ Vũ", stars: 45 },
  { id: 3, title: "algorithm-visualizer", description: "Website mô phỏng các thuật toán kinh điển trực quan.", author: "Hải Trần", stars: 30 },
];

export default function MemberShowcase() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[40px] xl:px-[80px]">
        <h2 className="text-[32px] md:text-[40px] font-bold text-primary text-center mb-12">
          Dự Án Cá Nhân & Open Source
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DUMMY_OPEN_SOURCE.map(project => (
            <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 h-16">{project.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-800 dark:text-gray-200">By {project.author}</span>
                <span className="flex items-center gap-1 text-yellow-500 font-bold">
                  ⭐ {project.stars}
                </span>
              </div>
              <button className="mt-4 w-full py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-white font-medium transition-colors">
                Xem trên GitHub
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
