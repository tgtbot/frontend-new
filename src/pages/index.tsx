import Image from "next/image";
import { Inter } from "next/font/google";

export default function Home() {
  return (
    <main className="relative flex flex-col bg-bgB text-bgW">
      <div
        className="w-full flex items-center"
        style={{ height: `calc(100vh - 72px)` }}
      >
        <div className="flex flex-col items-center justify-center w-3/5 gap-2">
          <a className="font-extrabold text-6xl uppercase">Telegramland</a>
          <a className="font-medium text-5xl uppercase text-primary">
            Dashboard
          </a>
        </div>
        <div className="flex flex-col items-center justify-center w-2/5"></div>
      </div>
    </main>
  );
}
