import React, { useState } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
// import logo from "@/assets/LOGO_B.svg";
import { MdDashboard } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

interface Props {
  goPage: (page: string) => void;
  urlPath: string;
}

export default function Desktop({ goPage, urlPath }: Props) {
  console.log(urlPath);
  return (
    <header className="bg-bgB hidden self-stretch h-[72px] lg:flex w-full items-center justify-between px-6 border-bgW/20 border-b">
      <div className="flex items-center justify-between gap-5">
        <Link href="/" className="mr-6 text-lg font-bold">
          TGT BOT
        </Link>
        <Link
          href="/group/-1002063149191"
          className={`text-sm tracking-wider flex gap-2 items-center opacity-60 hover:opacity-100 font-bold ${
            urlPath === "/group/[id]" && "opacity-100"
          }`}
          aria-label="DashBoard"
        >
          <MdDashboard size="21px" />
          DashBoard
        </Link>
        <Link
          href="/search"
          className={`text-sm tracking-wider flex gap-2 items-center opacity-60 hover:opacity-100 font-bold ${
            urlPath === "/search" && "opacity-100"
          }`}
          aria-label="Search"
        >
          <FaSearch size="18px" />
          Search
        </Link>
        <Link
          href="/profile"
          className={`text-sm tracking-wider flex gap-2 items-center opacity-60 hover:opacity-100 font-bold ${
            urlPath === "/profile" && "opacity-100"
          }`}
          aria-label="Profile"
        >
          <FaUser size="16px" />
          Profile
        </Link>
      </div>
      <div>
        <ConnectButton chainStatus="none" />
      </div>
    </header>
  );
}
