import Head from "next/head";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "@/queries";
import toast from "react-hot-toast";
import type { AxiosError, AxiosResponse } from "axios";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import ChainSelect from "@/components/Select/ChainSelect";
import { useState } from "react";

const chainNameList = [
  "scrollSepolia",
  "mantleTestnet",
  "filecoinCalibration",
  "polygonZkEvmTestnet",
];
export default function DepositPage() {
  const router = useRouter();
  const { redirect } = router.query as { redirect?: string };
  const [chainName, setChainName] = useState(chainNameList[0]);
  const {
    data: userID,
    isPending,
    refetch,
  } = useQuery<any, AxiosError>({
    queryKey: ["myID"],
    queryFn: () => axios.get("/users/profile"),
    select: (data: any) => {
      const { userInfo, groupsInfo } = data.data.data;
      return userInfo.id;
    },
  });
  //1298152745
  const { data: address, isPending: addressPending } = useQuery<any>({
    queryKey: ["getAddress", chainName, userID],
    queryFn: ({ queryKey }: any) =>
      axios.get(`/wallet/address/${queryKey[1]}/${queryKey[2]}`),
    select: (data: any) => {
      return data.data.data.address;
    },
    enabled: !!userID,
  });
  const { data: balance, isPending: balancePending } = useQuery<any>({
    queryKey: ["getBalance", chainName, userID],
    queryFn: ({ queryKey }: any) =>
      axios.get(`/wallet/balance/${queryKey[1]}/${queryKey[2]}`),
    select: (data: any) => {
      return data.data.data.balance;
    },
    enabled: !!userID,
  });
  if (isPending || addressPending || balancePending)
    return <LoadingPage title="Deposit" />;
  return (
    <>
      <Head>
        <title>Deposit</title>
      </Head>

      <div
        className="w-full items-center justify-center flex"
        style={{ height: `calc(100vh - 72px)` }}
      >
        <div className=" overflow-visible w-2/5 min-h-52 p-4 bg-[#242527] flex flex-col items-center rounded-xl">
          <div className="text-2xl font-medium">Deposit</div>
          <div className="flex flex-col gap-4">
            <ChainSelect onChange={setChainName} />
            <a className="uppercase font-semibold text-primary">
              now you select : {chainName}
            </a>
            <a className="">address : {address}</a>
            <a className="">balance : {balance}</a>
          </div>
        </div>
      </div>
    </>
  );
}
