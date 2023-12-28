import Head from "next/head";
import css from "./LoadingPage.module.scss";

export default function LoadingPage({ title }: { title: string }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className={css.loading}>Loading...</div>
    </>
  );
}
