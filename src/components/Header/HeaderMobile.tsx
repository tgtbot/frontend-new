import React, { useState } from "react";
import { LuMenu } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import { FaSearch, FaUser } from "react-icons/fa";

interface Props {
  goPage: (page: string) => void;
  urlPath: string;
}

export default function Mobile({ goPage, urlPath }: Props) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="relative flex h-[72px] w-full items-center justify-between self-stretch border-b border-bgB/20 bg-bgB px-6 lg:hidden">
      <Link href="/" className="mr-6 text-lg font-bold">
        TGT BOT
      </Link>
      <LuMenu size="24px" color="#FFFFFF" onClick={() => setShowMenu(true)} />
      <div
        className={`fixed right-0 top-0 z-50 h-full w-[50%] bg-bgB pl-4 text-bgW shadow-2xl transition-all duration-300 ease-linear ${
          showMenu ? "" : "translate-x-full"
        }`}
      >
        <div onClick={() => setShowMenu(false)} className="pb-8 pt-6">
          <RxCross2 size="24px" />
        </div>
        <div className="flex h-full max-w-[220px] flex-col gap-8 uppercase">
          <Link
            href="/group/-1002063149191"
            className={`text-sm tracking-wider flex gap-2 items-center hover:opacity-100 font-bold ${
              urlPath === "/group/[id]" ? "opacity-100" : "opacity-60"
            }`}
            aria-label="DashBoard"
          >
            <MdDashboard size="21px" />
            DashBoard
          </Link>
          <Link
            href="/search"
            className={`text-sm tracking-wider flex gap-2 items-center hover:opacity-100 font-bold ${
              urlPath === "/search" ? "opacity-100" : "opacity-60"
            }`}
            aria-label="Search"
          >
            <FaSearch size="18px" />
            Search
          </Link>
          <Link
            href="/profile"
            className={`text-sm tracking-wider flex gap-2 items-center hover:opacity-100 font-bold ${
              urlPath === "/profile" ? "opacity-100" : "opacity-60"
            }`}
            aria-label="Profile"
          >
            <FaUser size="16px" />
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}
