import React, { useState } from "react";
import Image from "next/image";
// import logo from "@/assets/MLOGO_B.svg";
import { LuMenu } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

interface Props {
  goPage: (page: string) => void;
  urlPath: string;
}

export default function Mobile({ goPage, urlPath }: Props) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="relative flex h-[72px] w-full items-center justify-between self-stretch border-b border-bgB/20 bg-bgB px-4 lg:hidden">
      <LuMenu size="24px" color="#0F0F0F" onClick={() => setShowMenu(true)} />

      <div className="absolute left-1/2 flex -translate-x-[50%]">
        {/* <Image src={logo} alt="Bako" className="w-full" /> */}
      </div>
      {/* <FaUser
        color="black"
        size="24px"
        onClick={() => goPage("/profile")}
        className="cursor-pointer"
      /> */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-[82%] bg-bgB pl-4 text-bgW shadow-2xl transition-all duration-300 ease-linear ${
          showMenu ? "" : "-translate-x-full"
        }`}
      >
        <div onClick={() => setShowMenu(false)} className="pb-8 pt-6">
          <RxCross2 size="24px" />
        </div>
        <div className="flex h-full max-w-[220px] flex-col gap-8 uppercase">
          <a
            className="text-sm leading-[140%] tracking-[.84px]"
            onClick={() => {
              goPage("/about");
              setShowMenu(false);
            }}
          >
            About us
          </a>
          <a
            className="text-sm leading-[140%] tracking-[.84px]"
            onClick={() => {
              goPage("/collection");
              setShowMenu(false);
            }}
          >
            our collection
          </a>
          <div className="h-[1px] w-[220px] bg-bgW opacity-40" />
          {/* {Object.entries(profilePath).map(([path, url]) => (
            <a
              key={path}
              className={`${
                url === "/" ? "opacity-40" : ""
              } text-sm leading-[140%] tracking-[.84px]`}
              onClick={() => {
                goPage(url);
                setShowMenu(false);
              }}
            >
              {path}
            </a>
          ))} */}
        </div>
      </div>
    </header>
  );
}
