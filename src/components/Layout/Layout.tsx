import React from "react";
import { useRouter } from "next/router";
import Header from "../Header/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();
  const urlPath = useRouter().pathname;

  return (
    <>
      {/* {urlPath !== "/" && <Header urlPath={urlPath} />} */}
      <Header urlPath={urlPath} />
      <main className="max-w-[100vw] min-h-[60vh]">{children}</main>
      {/* {urlPath !== "/" && <Footer urlPath={urlPath} />} */}
    </>
  );
}
