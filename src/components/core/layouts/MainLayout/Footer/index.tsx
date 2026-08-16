import React from "react";
import Image from "next/image";
import logodever1 from "@images/footer/logodever1.svg";
import facebookLogo from "@images/footer/facebook-box-fill.svg";
import githubLogo from "@images/footer/github-fill.svg";
import tiktokLogo from "@images/footer/Tiktok.svg";
import mail from "@images/footer/mail-line.svg";
import phone from "@images/footer/phone-line.svg";
import mapPin from "@images/footer/map-pin-line.svg";
import fudever from "@images/footer/FU-DEVER.svg";
import Link from "next/link";

function Footer() {
  const contactData = [
    {
      logo: mail,
      title: "club.dever@gmail.com",
      url: "mailto:club.dever@gmail.com",
    },
    {
      logo: phone,
      title: "+84 828 828 497",
      url: "tel:+84828828497",
    },
    {
      logo: mapPin,
      title: "Khu đô thị FPT City, Ngũ Hành Sơn, Đà Nẵng",
      url: "https://www.google.com/maps/place/%C4%90%E1%BA%A1i+h%E1%BB%8Dc+FPT+%C4%90%C3%A0+N%E1%BA%B5ng/@15.968891,108.2583164,17z/data=!3m1!4b1!4m6!3m5!1s0x3142116949840599:0x365b35580f52e8d5!8m2!3d15.9688859!4d108.2608913!16s%2Fg%2F11fl0yz7tc?hl=vi-VN&entry=ttu",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#0080FF] to-[#0066CC] text-white w-full shadow-inner">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-20 pt-12 pb-8 flex flex-col justify-between">
        {/* Main 3-Column Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10">
          {/* Column 1: Logo & Socials */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                loading="lazy"
                src={logodever1}
                alt="FU-DEVER Logo"
                className="w-10 h-10 xl:w-12 xl:h-12 object-contain"
              />
              <Image
                loading="lazy"
                src={fudever}
                alt="FU-DEVER"
                className="h-8 w-auto xl:h-9 object-contain"
              />
            </Link>
            <p className="text-xs lg:text-sm text-blue-100 leading-relaxed max-w-sm">
              Câu lạc bộ Lập trình FU-DEVER — Nơi kết nối niềm đam mê công nghệ, ươm mầm tài năng kỹ sư phần mềm tại Đại học FPT Đà Nẵng.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.facebook.com/FPTUDever"
                aria-label="Facebook FU-DEVER"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Image loading="lazy" src={facebookLogo} alt="Facebook" className="w-5 h-5 object-contain" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/fudever-club"
                aria-label="GitHub FU-DEVER"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Image loading="lazy" src={githubLogo} alt="GitHub" className="w-5 h-5 object-contain" />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.tiktok.com/@daihocfptdanang"
                aria-label="TikTok FU-DEVER"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Image loading="lazy" src={tiktokLogo} alt="TikTok" className="w-5 h-5 object-contain" />
              </a>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-blue-200 mb-4">
              Thông Tin Liên Hệ
            </h4>
            <div className="space-y-3 text-xs lg:text-sm">
              {contactData.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target={item.url.startsWith("http") ? "_blank" : undefined}
                  rel={item.url.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-start gap-3 text-blue-100 hover:text-white transition-colors group"
                >
                  <Image
                    loading="lazy"
                    src={item.logo}
                    alt=""
                    className="w-4 h-4 mt-0.5 shrink-0 opacity-80 group-hover:opacity-100"
                  />
                  <span className="leading-snug">{item.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-blue-200 mb-4">
              Liên Kết Nhanh
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs lg:text-sm">
              <Link href="/" className="text-blue-100 hover:text-white hover:underline transition-colors py-1">
                Trang chủ
              </Link>
              <Link href="/events" className="text-blue-100 hover:text-white hover:underline transition-colors py-1">
                Sự kiện
              </Link>
              <Link href="/project" className="text-blue-100 hover:text-white hover:underline transition-colors py-1">
                Dự án
              </Link>
              <Link href="/blog" className="text-blue-100 hover:text-white hover:underline transition-colors py-1">
                Tech Blog
              </Link>
              <Link href="/activity" className="text-blue-100 hover:text-white hover:underline transition-colors py-1">
                Hoạt động
              </Link>
              <Link href="/resources" className="text-blue-100 hover:text-white hover:underline transition-colors py-1">
                Kho tài liệu
              </Link>
              <Link href="/member" className="text-blue-100 hover:text-white hover:underline transition-colors py-1">
                Thành viên
              </Link>
              <Link href="/hall-of-fame" className="text-blue-100 hover:text-white hover:underline transition-colors py-1">
                Bảng vàng
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Sub-bar */}
        <div className="border-t border-white/20 pt-6 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-100 font-medium text-center sm:text-left">
          <p>© 2026 FU-DEVER CLUB. All rights reserved.</p>
          <p className="text-[11px] text-blue-200/80">
            FPT University Da Nang · Đam mê kiến tạo tương lai
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
