import { axios } from "@/queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-hot-toast";
function verifyFn(msg: string): Promise<AxiosResponse<{ data: any }>> {
  return axios.post("/auth/captcha", { msg, type: "telegram" });
}
export default function Verify() {
  const router = useRouter();
  const { redirect } = router.query as { redirect?: string };
  const { mutate: mutateVerify } = useMutation({
    mutationKey: ["verify"],
    mutationFn: verifyFn,
    onSuccess: ({ data }) => {
      router.push(redirect || "/profile");
    },
    onError: (error: AxiosError<any>) => {
      const errorMassage = error.response?.data.message || error.message;
      toast.error(errorMassage);
    },
  });
  const AppKey = process.env.NEXT_PUBLIC_SITE_KEY as string;
  const captchaRef = useRef<any>();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!captchaRef.current) return;
    const token = captchaRef.current.getValue();
    console.log(token);
    captchaRef.current.reset();
    mutateVerify(token);
  };
  // useEffect(() => {
  //   if (captchaRef.current.getValue()) {
  //     console.log(captchaRef.current.getValue());
  //   }
  // }, [captchaRef.current, captchaRef.current?.getValue()]);
  return (
    <>
      <Head>
        <title>Verify</title>
      </Head>
      <div
        className="w-full items-center justify-center flex"
        style={{ height: `calc(100vh - 72px)` }}
      >
        <form onSubmit={handleSubmit} className="text-center space-y-2">
          <ReCAPTCHA sitekey={AppKey} ref={captchaRef} />

          <button
            type="submit"
            className={`w-full bg-buttonBg rounded-lg text-white hover:opacity-70 py-3 ${""}`}
          >
            Verify
          </button>
        </form>
      </div>
    </>
  );
}
