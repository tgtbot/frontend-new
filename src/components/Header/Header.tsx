import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Desktop from "./HeaderDesktop";
import Mobile from "./HeaderMobile";
import { TgtContext } from "../TgtProvider";

type HeaderProps = {
  urlPath: string;
};

export default function Header({ urlPath }: HeaderProps) {
  const { pathname } = useRouter();
  const { goPage } = useContext(TgtContext);

  return (
    <header className="z-10 h-full w-full overflow-hidden transition-all">
      <Desktop goPage={goPage} urlPath={urlPath} />
      <Mobile goPage={goPage} urlPath={urlPath} />
    </header>
  );
}
