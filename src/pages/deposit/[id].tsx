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
export default function DepositOtherPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const [chainName, setChainName] = useState(chainNameList[0]);
  const {
    data: userID,
    isPending,
    refetch,
    error,
  } = useQuery<any, AxiosError>({
    queryKey: ["userID", id],
    queryFn: () => axios.get(`/users/profile/${id}`),
    select: (data: any) => {
      const { userInfo, groupsInfo } = data.data.data;
      return userInfo.id;
    },
    enabled: !!id,
  });
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
  if (error)
    return (
      <>
        <Head>
          <title>Deposit</title>
        </Head>
        <div
          className="w-full items-center justify-center flex"
          style={{ height: `calc(100vh - 72px)` }}
        >
          <div className="overflow-visible lg:w-2/5 m-4 lg:m-0 min-h-52 justify-center p-4 bg-[#242527] flex flex-col items-center rounded-xl">
            <div className="flex flex-col gap-4 text-sm lg:text-2xl font-medium uppercase">
              not found {id} User
            </div>
          </div>
        </div>
      </>
    );
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
        <div className=" overflow-auto w-4/5 lg:w-2/5 min-h-52 p-4 bg-[#242527] flex flex-col items-center rounded-xl">
          <div className="text-lg lg:text-2xl font-medium">Deposit to {id}</div>
          <div className="flex flex-col gap-4 w-full">
            <ChainSelect onChange={setChainName} />
            <a className="uppercase font-semibold text-primary text-sm lg:text-base">
              now you select : {chainName}
            </a>
            <a>address :</a>
            <a className="text-xs lg:text-base">{address}</a>
            <a className="">balance :</a>
            <a className="text-xs lg:text-base">{balance}</a>
          </div>
        </div>
      </div>
    </>
  );
}
