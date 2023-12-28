export default async function login(msg: string, type: string) {
  return await fetch(
    "https://backend-rebuild-production.up.railway.app/auth/login",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ msg, type }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.statusCode !== 200) {
        throw new Error(data.message);
      }
      return data.data.access_token;
    })
    .catch((err) => {
      console.log(err);
    });
}
