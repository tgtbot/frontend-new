import { useState, useMemo } from "react";
import Head from "next/head";
// import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/queries";
import dayjs from "dayjs";
// import toast from "react-hot-toast";
import merge from "lodash.merge";
// import PageLayout from "components/PageLayout";
// import LoadingPage from "components/LoadingPage";
// import Card from "components/Card";
// import TagsInput from "components/TagsInput";
// import { LanguageSelect, LocationSelect } from "components/Select";
import css from "@/styles/pages/Group.module.scss";

import type { AxiosError } from "axios";
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage";
// import type { Tag } from "react-tag-autocomplete";

// const UserTrendChart = dynamic(() => import("components/UserTrendChart"), { ssr: false });
// const MessageTrendChart = dynamic(() => import("components/MessageTrendChart"), { ssr: false });
// const LevelPieChart = dynamic(() => import("components/LevelPieChart"), { ssr: false });
// const EmotionColorChart = dynamic(() => import("components/EmotionColorChart"), { ssr: false });

const StatusCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <Card>
      <strong className="">{title}</strong>
      <span className="mt-2">{value}</span>
    </Card>
  );
};

function updateGroupFn(data: any) {
  return axios.post(`/groups/info/${data.id}`, {
    name: data.name,
    bio: data.bio,
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
  const [name, setName] = useState(data.name);
  const [bio, setBio] = useState(data.bio);
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
        // toast.success("Successfully updated.");
        handleClose();
      },
      onError: (error: AxiosError<any>) => {
        const errorMassage = error.response?.data.message || error.message;
        // toast.error(errorMassage);
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
      console.log(tags, location, language);
      mutateUpdateGroup({ id: data.chat_id.toString(), name, bio });
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
            {/* <TagsInput onChange={setTags} allowNew /> */}
          </div>
          <div className={css.dialog__label}>
            <span>Location</span>
            {/* <LocationSelect onChange={setLocation} /> */}
          </div>
          <div className={css.dialog__label}>
            <span>Language</span>
            {/* <LanguageSelect onChange={setLanguage} /> */}
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
  const [showEditorDialog, setShowEditorDialog] = useState(false);

  const id = router.query.id as string;

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

      <div className={css.page}>
        <div className={css.group}>
          <Card className={css.groupPanel}>
            <h2 className={css.groupPanel__title}>
              {group.name}
              {group.isAdmin && (
                <button
                  className={css.groupPanel__edit}
                  onClick={() => setShowEditorDialog(!showEditorDialog)}
                >
                  Edit Group
                </button>
              )}
            </h2>
            <p className={css.groupPanel__description}>{group.bio}</p>
            <div className={css.groupPanel__tags}>
              {group.tags.map((tag: string) => (
                <span className={css.groupPanel__tag} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={css.groupPanel__meta}>
              <span className={css.groupPanel__location}>{group.location}</span>
              <span className={css.groupPanel__language}>{group.language}</span>
            </div>
          </Card>

          <div className={css.statusPanel}>
            <StatusCard title="24h Growth" value={growth.growth24h} />
            <StatusCard title="30d Growth" value={growth.growth30d} />
            <StatusCard title="365d Growth" value={growth.growth365d} />
            <StatusCard title="Average Days" value={averageDays} />
          </div>
        </div>

        {/* <Card title="User Trending" className={css.chart}>
            <UserTrendChart id={id} />
          </Card>

          <Card title="Message Trending" className={css.chart}>
            <MessageTrendChart id={id} />
          </Card>

          <Card title="User Levels" className={css.chart}>
            <LevelPieChart id={id} />
          </Card>

          <Card title="User Emotion Colors" className={css.chart}>
            <EmotionColorChart id={id} />
          </Card> */}
      </div>

      <EditorDialog
        data={group}
        open={showEditorDialog}
        handleClose={() => setShowEditorDialog(false)}
      />
    </>
  );
}
