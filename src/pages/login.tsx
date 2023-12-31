import Head from "next/head";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/queries";
// import toast from "react-hot-toast";
// import css from "styles/pages/Login.module.scss";
import type { AxiosError, AxiosResponse } from "axios";
import Card from "@/components/Card/Card";
import TelegramLoginButton, { TelegramUser } from "telegram-login-button";

function loginFn(
  msg: string
): Promise<AxiosResponse<{ data: { access_token: string } }>> {
  return axios.post("/auth/login", { msg, type: "telegram" });
}

export default function LoginPage() {
  const router = useRouter();
  const { redirect } = router.query as { redirect?: string };

  const { mutate: mutateLogin } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginFn,
    onSuccess: ({ data }) => {
      const token = data.data.access_token;
      localStorage.setItem("token", token);
      router.push(redirect || "/profile");
    },
    onError: (error: AxiosError<any>) => {
      const errorMassage = error.response?.data.message || error.message;
      //   toast.error(errorMassage);
    },
  });

  const handleLogin = (user: any) => {
    localStorage.setItem("userName", user.first_name);
    const msg = new URLSearchParams(user).toString();
    mutateLogin(msg);
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <div
        className="w-full items-center justify-center flex"
        style={{ height: `calc(100vh - 72px)` }}
      >
        <Card title="Login">
          <TelegramLoginButton
            botName="tgt_help_bot"
            buttonSize="medium"
            cornerRadius={8}
            dataOnauth={handleLogin}
          />
        </Card>
      </div>
    </>
  );
}
