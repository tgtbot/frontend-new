import { useState, useMemo, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  useNetwork,
  useSwitchNetwork,
  useAccount,
  useSignMessage,
} from "wagmi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/queries";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import Card from "@/components/Card/Card";
// import Switch from "components/Switch";
import css from "@/styles/pages/User.module.scss";

import type { AxiosError } from "axios";
import Switch from "@/components/Switch/Switch";
import { TgtContext } from "@/components/TgtProvider";

const chainIdMap: Record<
  string,
  {
    isEVM: boolean;
    chainId?: number;
    wallet?: any;
  }
> = {
  evm: {
    isEVM: true,
    chainId: 1,
  },
  BTC: {
    isEVM: false,
    wallet: undefined,
  },
  near: {
    isEVM: false,
    wallet: undefined,
  },
  avalanche: {
    isEVM: true,
    chainId: 43114,
  },
  polygon: {
    isEVM: true,
    chainId: 137,
  },
  solana: {
    isEVM: false,
    wallet: undefined,
  },
  TON: {
    isEVM: false,
    wallet: undefined,
  },
  tron: {
    isEVM: false,
    wallet: undefined,
  },
};
const chainType = {
  evm: "evm_address",
  solana: "solana_address",
  near: "near_address",
  polygon: "polygon_address",
  avalanche: "avalanche_address",
  tron: "tron_address",
  TON: "TON_address",
  BTC: "BTC_address",
};

function updateProfileFn(data: { email: string; isPublic: boolean }) {
  return axios.post("/users/profile", data);
}
function connectAddress(data: { address: string; address_type: string }) {
  return axios.post("/users/verifyAddress", data);
}

function GroupCard({ data }: any) {
  const lastMessageTime = dayjs(data.totalMsgsAndTime.lastMessageTime);

  const {
    data: group,
    isPending,
    error,
  } = useQuery({
    queryKey: ["group", data.chat_id],
    queryFn: ({ queryKey }) => axios.get(`/groups/info/${queryKey[1]}`),
    select: (data: any) => data.data.data,
  });
  if (error) {
    return (
      <Card className="min-h-[308px] flex flex-col justify-center items-center min-w-[100px]">
        <p className={css.groupCard__message}>
          Error to fetch group {data.chat_id}
        </p>
      </Card>
    );
  }

  if (isPending || !group) {
    return (
      <Card className="min-h-[308px] flex flex-col justify-center items-center min-w-[100px]">
        <p className={css.groupCard__message}>Fetching group data...</p>
      </Card>
    );
  }

  return (
    <Card className="min-h-[308px] min-w-[100px]">
      <h3 className={css.groupCard__heading}>{group.name}</h3>
      <div className={css.groupCard__tags}>
        {group.tags.map((tag: string) => (
          <span className={css.groupCard__tag} key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <ul className={css.groupCard__data}>
        <li>
          <strong>My Level</strong>
          <span>{data.level}</span>
        </li>
        <li>
          <strong>My Role</strong>
          <span>{group.role || "--"}</span>
        </li>
        <li>
          <strong>Total Messages</strong>
          <span>{data.totalMsgsAndTime.totalMessages}</span>
        </li>
        <li>
          <strong>Last Message</strong>
          <span>{lastMessageTime.format("YYYY/MM/DD")}</span>
        </li>
        <li>
          <strong>Is Admin</strong>
          <span>{data.isAdmin ? "Yes" : "No"}</span>
        </li>
        <li>
          <strong>Is Banned</strong>
          <span>{data.isBanned ? "Yes" : "No"}</span>
        </li>
        <li>
          <strong>Location</strong>
          <span>{group.location || "--"}</span>
        </li>
        <li>
          <strong>Language</strong>
          <span>{group.language || "--"}</span>
        </li>
      </ul>
      <Link className={css.groupCard__link} href={`/group/${data.chat_id}`}>
        To Dashboard
      </Link>
    </Card>
  );
}

export default function Profile() {
  const { isMobile } = useContext(TgtContext);
  const [showEditorDialog, setShowEditorDialog] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [targetChainName, setTargetChainName] = useState("");
  // const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { isConnected } = useAccount();

  const { data, isPending, refetch } = useQuery<any, AxiosError>({
    queryKey: ["myProfile"],
    queryFn: () => axios.get("/users/profile"),
    select: (data: any) => {
      const { userInfo, groupsInfo } = data.data.data;
      console.log("userInfo", userInfo);
      return {
        userData: userInfo,
        pinnedGroups: groupsInfo.filter((i: any) => i.isPinned),
        normalGroups: groupsInfo.filter((i: any) => !i.isPinned),
      };
    },
  });

  function EditorDialog({
    open,
    data,
    handleClose,
  }: {
    data: any;
    open: boolean;
    handleClose: () => void;
  }) {
    const [email, setEmail] = useState(data.email);
    const [isPublic, setIsPublic] = useState(data.isPublic || false);

    const queryClient = useQueryClient();
    const { mutate: mutateUpdateProfile, isPending: isMutatingProfile } =
      useMutation({
        mutationKey: ["updateProfile"],
        mutationFn: updateProfileFn,
        onSuccess: () => {
          queryClient.setQueryData(["myProfile"], (oldData: any) => ({
            ...oldData,
            email,
            isPublic,
          }));
          toast.success("Successfully updated.");
          handleClose();
          refetch();
        },
        onError: (error: AxiosError<any>) => {
          const errorMassage = error.response?.data.message || error.message;
          toast.error(errorMassage);
        },
      });

    const isDisabled = useMemo(
      () => isMutatingProfile || !email,
      [isMutatingProfile, email]
    );

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isDisabled) {
        mutateUpdateProfile({ email, isPublic });
      }
    };

    if (!open) return null;

    return (
      <div className={css.dialog}>
        <div className={css.dialog__box}>
          <h3 className={css.dialog__title}>Edit My Profile</h3>
          <form onSubmit={handleUpdate}>
            <label>
              <span>Email</span>
              <input
                type="text"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              <span>Is Public</span>
              <Switch
                checked={isPublic}
                onChange={(checked) => setIsPublic(checked)}
              />
            </label>
            <div className={css.dialog__bgroup}>
              <button type="button" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" disabled={isDisabled}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  function ConnectDialog({
    open,
    handleClose,
    refresh,
  }: {
    open: boolean;
    handleClose: () => void;
    refresh: () => void;
  }) {
    const { address } = useAccount();
    const targetChain = chainIdMap[targetChainName];
    const targetChainType =
      chainType[targetChainName as keyof typeof chainType];
    const [inputAddress, setInputAddress] = useState("");
    const [isSigningMessage, setIsSigningMessage] = useState(false);

    const { mutate: verifyAddress, isPending: isVerifyingAddress } =
      useMutation({
        mutationKey: ["verifyAddress"],
        mutationFn: connectAddress,
        onSuccess: () => {
          toast.success("Successfully connect address.");
          handleClose();
          refresh();
        },
        onError: (error: AxiosError<any>) => {
          const errorMassage = error.response?.data.message || error.message;
          toast.error(errorMassage);
        },
      });

    // const { signMessage } = useSignMessage({
    //   message: "TODO: sign message",
    //   onSuccess: (msg) => {
    //     console.log("signed message", msg);
    //     verifyAddress(msg);
    //   },
    //   onMutate: () => {
    //     setIsSigningMessage(true);
    //   },
    // });

    if (!open) return null;

    return (
      <div className={css.dialog}>
        <div className={css.dialog__box}>
          <h3 className={css.dialog__title}>Connect Wallet</h3>
          <input
            className="w-full bg-transparent border placeholder:opacity-35 p-2 text-xs"
            placeholder="please enter your address"
            value={targetChain.isEVM ? address : inputAddress}
            readOnly={targetChain.isEVM}
            defaultValue={targetChain.isEVM ? address : inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />

          <div className={css.dialog__bgroup}>
            <button onClick={handleClose}>Cancel</button>
            <button
              type="submit"
              onClick={
                targetChain.isEVM
                  ? () =>
                      verifyAddress({
                        address,
                        address_type: targetChainType,
                      } as any)
                  : () =>
                      verifyAddress({
                        address: inputAddress,
                        address_type: targetChainType,
                      } as any)
              }
              disabled={isSigningMessage || isVerifyingAddress}
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleShowConnectDialog = (targetChainName: string) => {
    setTargetChainName(targetChainName);
    const targetChain = chainIdMap[targetChainName];
    if (targetChain.isEVM) {
      // TODO: redirect to a specific connect page,
      //       or use a multichain wallet.
      if (!isConnected) {
        toast.error("Please connect your wallet first.");
        return;
      }
      setShowConnectDialog(true);
    } else {
      setShowConnectDialog(true);
    }
    // if (!isConnected) {
    //   toast.error("Please connect your wallet first.");
    //   return;
    // }
    // if (chain!.id !== targetChain.chainId) {
    //   switchNetworkAsync!(targetChain.chainId)
    //     .then(() => {
    //       setShowConnectDialog(true);
    //     })
    //     .catch(() => {
    //       toast.error("Failed to switch network.");
    //     });
    //   return;
    // }
    // if (chain!.id === targetChain.chainId) {
    //   setShowConnectDialog(true);
    // }
  };

  if (isPending || !data) {
    return <LoadingPage title="Profile" />;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <div className="p-6 flex lg:flex-row flex-col w-full gap-6">
        <aside className="flex flex-col gap-6 lg:min-w-[380px]">
          <Card>
            <h2 className={css.userPanel__title}>
              {data.userData.username ||
                localStorage.getItem("userName") ||
                "No Name"}
            </h2>
            <p className={css.userPanel__email}>{data.userData.email}</p>
            <button
              className={css.userPanel__edit}
              onClick={() => setShowEditorDialog(!showEditorDialog)}
            >
              Edit Profile
            </button>
          </Card>

          <Card>
            <h2 className={css.userPanel__title}>My Wallets</h2>
            <table className={css.table}>
              <thead>
                <tr>
                  <th className="opacity-30">Chain</th>
                  <th className="opacity-30">Address</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(chainType).map((i) => {
                  const address = data.userData[`${i}_address`];
                  return (
                    <tr key={`chain-${i}`}>
                      <td>
                        <span>{i.toUpperCase()}</span>
                      </td>
                      <td>
                        {address ? (
                          <code>
                            {address.slice(0, 20) + "..." + address.slice(-4)}
                          </code>
                        ) : (
                          <button
                            className={css.connectButton}
                            onClick={() => handleShowConnectDialog(i)}
                          >
                            Connect
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </aside>

        <main>
          {!!data.pinnedGroups.length && (
            <div className="space-y-2 w-full">
              <h3 className={css.mainHeading}>Pinned Groups:</h3>
              {isMobile && (
                <Swiper spaceBetween={50} slidesPerView={1}>
                  {data.pinnedGroups.map((i: any) => (
                    <SwiperSlide key={i.chat_id}>
                      <GroupCard data={i} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
              <div className="hidden grid-cols-3 gap-4 lg:grid">
                {data.pinnedGroups.map((i: any) => (
                  <GroupCard key={i.chat_id} data={i} />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 w-full">
            <h3 className={css.mainHeading}>My Groups:</h3>
            {isMobile && (
              <Swiper spaceBetween={50} slidesPerView={1}>
                {data.normalGroups.map((i: any) => (
                  <SwiperSlide key={i.chat_id}>
                    <GroupCard data={i} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            <div className="hidden grid-cols-3 gap-4 lg:grid">
              {data.normalGroups.map((i: any) => (
                <GroupCard key={i.chat_id} data={i} />
              ))}
            </div>
          </div>
        </main>
      </div>

      <EditorDialog
        data={data.userData}
        open={showEditorDialog}
        handleClose={() => setShowEditorDialog(false)}
      />

      <ConnectDialog
        open={showConnectDialog}
        handleClose={() => setShowConnectDialog(false)}
        refresh={refetch}
      />
    </>
  );
}
