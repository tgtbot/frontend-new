import { useState, useMemo } from "react";
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
// import toast from "react-hot-toast";
import dayjs from "dayjs";
// import PageLayout from "components/PageLayout";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import Card from "@/components/Card/Card";
// import Switch from "components/Switch";
import css from "@/styles/pages/User.module.scss";

import type { AxiosError } from "axios";

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

function updateProfileFn(data: { email: string; isPublic: boolean }) {
  return axios.post("/users/profile", data);
}

function verifyEmailFn(msg: string) {
  return axios.post("/users/verifyAddress", { msg });
}

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
        // toast.success("Successfully updated.");
        handleClose();
      },
      onError: (error: AxiosError<any>) => {
        const errorMassage = error.response?.data.message || error.message;
        // toast.error(errorMassage);
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
            {/* <Switch
              checked={isPublic}
              onChange={(checked) => setIsPublic(checked)}
            /> */}
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
  const [isSigningMessage, setIsSigningMessage] = useState(false);

  const { mutate: verifyAddress, isPending: isVerifyingAddress } = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: verifyEmailFn,
    onSuccess: () => {
      // toast.success("Successfully verified address.");
      handleClose();
      refresh();
    },
    onError: (error: AxiosError<any>) => {
      const errorMassage = error.response?.data.message || error.message;
      // toast.error(errorMassage);
    },
  });

  const { signMessage } = useSignMessage({
    message: "TODO: sign message",
    onSuccess: (msg) => {
      console.log("signed message", msg);
      verifyAddress(msg);
    },
    onMutate: () => {
      setIsSigningMessage(true);
    },
  });

  if (!open) return null;

  return (
    <div className={css.dialog}>
      <div className={css.dialog__box}>
        <h3 className={css.dialog__title}>Connect Wallet</h3>

        <div className={css.address}>
          <code>{address}</code>
        </div>

        <div className={css.dialog__bgroup}>
          <button onClick={handleClose}>Cancel</button>
          <button
            type="submit"
            onClick={() => signMessage()}
            disabled={isSigningMessage || isVerifyingAddress}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
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
      <Card className={css.groupCard} height="100%">
        <p className={css.groupCard__message}>
          Error to fetch group {data.chat_id}
        </p>
      </Card>
    );
  }

  if (isPending || !group) {
    return (
      <Card className={css.groupCard} height="100%">
        <p className={css.groupCard__message}>Fetching group data...</p>
      </Card>
    );
  }

  return (
    <Card className={css.groupCard}>
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
  const [showEditorDialog, setShowEditorDialog] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { isConnected } = useAccount();

  const { data, isPending, refetch } = useQuery<any, AxiosError>({
    queryKey: ["myProfile"],
    queryFn: () => axios.get("/users/profile"),
    select: (data: any) => {
      console.log("data", data.data.data);
      const { userInfo, groupsInfo } = data.data.data;

      return {
        userData: userInfo,
        pinnedGroups: groupsInfo.filter((i: any) => i.isPinned),
        normalGroups: groupsInfo.filter((i: any) => !i.isPinned),
      };
    },
  });

  const handleShowConnectDialog = (targetChainName: string) => {
    const targetChain = chainIdMap[targetChainName];

    if (!targetChain.isEVM) {
      // TODO: redirect to a specific connect page,
      //       or use a multichain wallet.
      // toast.error("This chain is not supported yet.");
      return;
    }

    if (!isConnected) {
      // toast.error("Please connect your wallet first.");
      return;
    }

    if (chain!.id !== targetChain.chainId) {
      switchNetworkAsync!(targetChain.chainId)
        .then(() => {
          setShowConnectDialog(true);
        })
        .catch(() => {
          // toast.error("Failed to switch network.");
        });
      return;
    }

    if (chain!.id === targetChain.chainId) {
      setShowConnectDialog(true);
    }
  };

  if (isPending || !data) {
    return <LoadingPage title="Profile" />;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <div className={css.profile}>
        <aside>
          <Card className={css.userPanel}>
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

          <Card className={css.userPanel}>
            <h2 className={css.userPanel__title}>My Wallets</h2>
            <table className={css.table}>
              <thead>
                <tr>
                  <th>Chain</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {["evm", "BTC", "near", "polygon", "solana", "TON", "tron"].map(
                  (i) => {
                    const address = data.userData[`${i}_address`];
                    return (
                      <tr key={`chain-${i}`}>
                        <td>
                          <span>{i.toUpperCase()}</span>
                        </td>
                        <td>
                          {address ? (
                            <code>{address}</code>
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
                  }
                )}
              </tbody>
            </table>
          </Card>
        </aside>

        <main>
          <h3 className={css.mainHeading}>Pinned Groups:</h3>
          {!!data.pinnedGroups.length && (
            <>
              <div className={css.myGroups}>
                {data.pinnedGroups.map((i: any) => (
                  <GroupCard key={i.chat_id} data={i} />
                ))}
              </div>
            </>
          )}

          <h3 className={css.mainHeading}>My Groups:</h3>
          <div className={css.myGroups}>
            {data.normalGroups.map((i: any) => (
              <GroupCard key={i.chat_id} data={i} />
            ))}
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