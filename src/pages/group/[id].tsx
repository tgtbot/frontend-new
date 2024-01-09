import { useState, useMemo, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/queries";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import merge from "lodash.merge";
import TagsInput from "@/components/TagsInput";
import { LanguageSelect, LocationSelect } from "@/components/Select";
import css from "@/styles/pages/Group.module.scss";
import type { AxiosError } from "axios";
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import dynamic from "next/dynamic";
// import type { Tag } from "react-tag-autocomplete";
import { FaLocationDot } from "react-icons/fa6";
import { MdLanguage } from "react-icons/md";

const UserTrendChart = dynamic(() => import("@/components/UserTrendChart"), {
  ssr: false,
});
const MessageTrendChart = dynamic(
  () => import("@/components/MessageTrendChart"),
  { ssr: false }
);
const LevelPieChart = dynamic(() => import("@/components/LevelPieChart"), {
  ssr: false,
});
const EmotionColorChart = dynamic(
  () => import("@/components/EmotionColorChart"),
  { ssr: false }
);

const StatusCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <Card>
      <strong className={css.StatusCard__title}>{title}</strong>
      <span className={css.StatusCard__value}>{value}</span>
    </Card>
  );
};

function updateGroupFn(data: any) {
  return axios.post(`/groups/info/${data.id}`, {
    name: data.name,
    bio: data.bio,
    location: data.location,
    language: data.language,
  });
}

function EditorDialog({
  data,
  open,
  handleClose,
}: {
  data: any;
  open: boolean;
  handleClose: () => void;
}) {
  const [name, setName] = useState(data?.name);
  const [bio, setBio] = useState(data?.bio);
  const [tags, setTags] = useState<any>([]);
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");

  const queryClient = useQueryClient();
  const { mutate: mutateUpdateGroup, isPending: isUpdatingGroup } = useMutation(
    {
      mutationKey: ["updateGroup"],
      mutationFn: updateGroupFn,
      onSuccess: () => {
        queryClient.setQueryData(
          ["group", data.chat_id.toString()],
          (oldData: any) => {
            return merge(oldData, {
              data: {
                data: { name, bio },
              },
            });
          }
        );
        toast.success("Successfully updated.");
        handleClose();
      },
      onError: (error: AxiosError<any>) => {
        const errorMassage = error.response?.data.message || error.message;
        toast.error(errorMassage);
      },
    }
  );

  const isDisabled = useMemo(
    () => isUpdatingGroup || !name,
    [isUpdatingGroup, name]
  );

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isDisabled) {
      console.log("tags", tags);
      mutateUpdateGroup({
        id: data.chat_id.toString(),
        name,
        bio,
        location,
        language,
      });
    }
  };

  if (!open) return null;

  return (
    <div className={css.dialog}>
      <div className={css.dialog__box}>
        <h3 className={css.dialog__title}>Edit Group</h3>
        <form onSubmit={handleUpdate}>
          <div className={css.dialog__label}>
            <span>Name</span>
            <input
              type="text"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={css.dialog__label}>
            <span>Bio</span>
            <textarea
              value={bio || ""}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className={css.dialog__label}>
            <span>Tags</span>
            <TagsInput onChange={setTags} allowNew />
          </div>
          <div className={css.dialog__label}>
            <span>Location</span>
            <LocationSelect onChange={setLocation} />
          </div>
          <div className={css.dialog__label}>
            <span>Language</span>
            <LanguageSelect onChange={setLanguage} />
          </div>
          <div className={css.dialog__bgroup}>
            <button
              type="button"
              className={css.dialog__button}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.dialog__button}
              disabled={isDisabled}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GroupDashboardPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const [showEditorDialog, setShowEditorDialog] = useState(false);
  const { group, growth, averageDays, isPending } = useQueries<any, any>({
    queries: [
      {
        queryKey: ["group", id],
        queryFn: ({ queryKey }: any) =>
          axios.get(`/groups/info/${queryKey[1]}`),
        select: (data: any) => data.data.data,
        enabled: !!id,
      },
      {
        queryKey: ["growth", id],
        queryFn: ({ queryKey }: any) =>
          axios.get(`/groups/users/${queryKey[1]}`),
        select: (data: any) => data.data.data,
        enabled: !!id,
      },
      {
        queryKey: ["averageDays", id],
        queryFn: ({ queryKey }: any) =>
          axios.get(`/groups/average_days/${queryKey[1]}`),
        select: (data: any) => data.data.data,
        enabled: !!id,
      },
    ],
    combine: (results: any) => ({
      isPending: results.some((result: any) => result.isPending),
      group: results[0]?.data,
      growth: results[1]?.data && {
        growth24h: results[1].data["24h_ago"].avg_amount,
        growth30d: results[1].data["30d_ago"].avg_amount,
        growth365d: results[1].data["365d_ago"].avg_amount,
      },
      averageDays: results[2]?.data && dayjs().diff(results[2].data, "day"),
    }),
  });

  if (isPending) return <LoadingPage title="Group Dashboard" />;

  return (
    <>
      <Head>
        <title>Group Dashboard</title>
      </Head>
      <div className="h-full overflow-auto">
        <div className="grid gap-4 h-full p-6 grid-cols-1 lg:grid-cols-2">
          <Card className={css.groupPanel}>
            <h2 className={css.groupPanel__title}>
              {group?.name}
              {group?.isAdmin && (
                <button
                  className={css.groupPanel__edit}
                  onClick={() => setShowEditorDialog(!showEditorDialog)}
                >
                  Edit Group
                </button>
              )}
            </h2>
            <p className={css.groupPanel__description}>{group?.bio}</p>
            <div className={css.groupPanel__tags}>
              {group?.tags.map((tag: string) => (
                <span className={css.groupPanel__tag} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={css.groupPanel__meta}>
              <span className="flex items-center mr-4 gap-1">
                <FaLocationDot size="16px" />
                {group?.location}
              </span>
              <span className="flex items-center mr-4 gap-1">
                <MdLanguage size="18px" />
                {group?.language}
              </span>
            </div>
          </Card>

          <div className="grid grid-cols-4 lg:grid-cols-2 gap-4">
            <StatusCard title="24h Growth" value={growth?.growth24h} />
            <StatusCard title="30d Growth" value={growth?.growth30d} />
            <StatusCard title="365d Growth" value={growth?.growth365d} />
            <StatusCard title="Average Days" value={averageDays} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6 pb-6 h-full">
          <div className={`p-4 overflow-hidden bg-[#242527] rounded-xl h-full`}>
            <h3 className="mb-3 leading-[16px]">User Trending</h3>
            <div className="h-96">
              <UserTrendChart id={id} />
            </div>
          </div>
          <div className={`p-4 overflow-hidden bg-[#242527] rounded-xl h-full`}>
            <h3 className="mb-3 leading-[16px]">Message Trending</h3>
            <div className="h-96">
              <MessageTrendChart id={id} />
            </div>
          </div>

          <div className={`p-4 overflow-hidden bg-[#242527] rounded-xl h-full`}>
            <h3 className="mb-3 leading-[16px]">User Levels</h3>
            <div className="h-96">
              <LevelPieChart id={id} />
            </div>
          </div>

          <div className={`p-4 overflow-hidden bg-[#242527] rounded-xl h-full`}>
            <h3 className="mb-3 leading-[16px]">User Emotion Colors</h3>
            <div className="h-96">
              <EmotionColorChart id={id} />
            </div>
          </div>
        </div>
      </div>
      <EditorDialog
        data={group}
        open={showEditorDialog}
        handleClose={() => setShowEditorDialog(false)}
      />
    </>
  );
}
