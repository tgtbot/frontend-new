import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const AppKey = process.env.NEXT_PUBLIC_SITE_KEY as string;
  console.log(AppKey);

  return (
    <div className="relative flex bg-bgB text-bgW flex-col">
      {/* <div>Verify</div>
      <h1>Sign up for Newsletter</h1>
      <form>
        <input
          name="Email"
          type={"email"}
          value={email}
          required
          placeholder="joe@example.com"
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          name="Name"
          type={"name"}
          value={name}
          required
          placeholder="Joe"
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit">Sign up</button>
        <ReCAPTCHA sitekey={AppKey} />
      </form> */}
    </div>
  );
}
