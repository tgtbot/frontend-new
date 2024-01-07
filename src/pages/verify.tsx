import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const AppKey = process.env.NEXT_PUBLIC_SITE_KEY as string;
  console.log(AppKey);

  return (
    <div
      className="w-full items-center justify-center flex"
      style={{ height: `calc(100vh - 72px)` }}
    >
      <form className="text-center">
        <button type="submit">Sign up</button>
        <ReCAPTCHA sitekey={AppKey} />
      </form>
    </div>
  );
}
