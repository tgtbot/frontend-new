import Head from "next/head";

export default function LoadingPage({ title }: { title: string }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div
        className="flex items-center justify-center"
        style={{ height: `calc(100vh - 72px)` }}
      >
        <span className="loader"></span>
      </div>
    </>
  );
}
