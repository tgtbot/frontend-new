export default function Home() {
  return (
    <main className="relative flex flex-col bg-bgB text-bgW">
      <div
        className="w-full flex flex-col lg:flex-row items-center py-6"
        style={{ height: `calc(100vh - 72px)` }}
      >
        <div className="flex flex-col items-center justify-center w-full lg:w-3/5 gap-2">
          <a className="font-extrabold lg:text-6xl text-2xl uppercase">
            Telegramland
          </a>
          <a className="font-medium lg:text-5xl text-xl uppercase text-primary">
            Dashboard
          </a>
        </div>
        <div className="flex flex-col items-center justify-center w-2/5"></div>
      </div>
    </main>
  );
}
