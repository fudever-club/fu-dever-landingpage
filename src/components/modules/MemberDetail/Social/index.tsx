import Image from "next/image";
import Link from "next/link";
import React from "react";
import facebook from "@icons/pages/member/detail/facebook.svg";
import github from "@icons/pages/member/detail/github.svg";
import instagram from "@icons/pages/member/detail/instagram.svg";
import leetcode from "@icons/pages/member/detail/leetcode.svg";
import youtube from "@icons/pages/member/detail/youtube.svg";

const iconMap: Record<string, any> = {
  FACEBOOK: facebook,
  GITHUB: github,
  INSTAGRAM: instagram,
  LEETCODE: leetcode,
  YOUTUBE: youtube,
};

const getSocialIcon = (constant?: string, name?: string) => {
  const key = (constant || name || "").toUpperCase();
  if (key.includes("FACEBOOK") || key.includes("FB.COM")) return facebook;
  if (key.includes("GITHUB")) return github;
  if (key.includes("INSTAGRAM")) return instagram;
  if (key.includes("LEETCODE")) return leetcode;
  if (key.includes("YOUTUBE")) return youtube;
  return iconMap[key] || github; // Safe fallback
};

const Social = ({ socials }: any) => {
  return (
    <span className="flex gap-[16px] items-center">
      {socials?.length ? (
        <>
          {socials?.map((social: any) => {
            const iconSrc = getSocialIcon(social?.socialId?.constant || social?.social?.constant, social?.socialId?.name || social?.social?.name);
            return (
              <Link
                href={social?.url || "#"}
                key={social?._id || Math.random()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  className="aspect-square xl:w-[30px] md:w-[25px] sm:w-[20px]"
                  src={iconSrc}
                  alt={`icon ${social?.name || "social"}`}
                />
              </Link>
            );
          })}
        </>
      ) : (
        <p className="text-slate-400 text-sm">Chưa có</p>
      )}
    </span>
  );
};

export default Social;
