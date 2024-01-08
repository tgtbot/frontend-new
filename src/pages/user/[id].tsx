import Head from "next/head";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/queries";
import dayjs from "dayjs";
import css from "@/styles/pages/User.module.scss";
import type { AxiosError } from "axios";
import Card from "@/components/Card/Card";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import { useContext } from "react";
import { TgtContext } from "@/components/TgtProvider";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";

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
        Goto Dashboard
      </Link>
    </Card>
  );
}

export default function UserPage() {
  const { data, isPending } = useQuery<any, AxiosError>({
    queryKey: ["myProfile"],
    queryFn: () => axios.get("/users/profile"),
    select: (data: any) => {
      const { userInfo, groupsInfo } = data.data.data;

      if (userInfo.isPublic) {
        return {
          userData: userInfo,
          pinnedGroups: groupsInfo.filter((i: any) => i.isPinned),
          groups: groupsInfo.filter((i: any) => !i.isPinned),
        };
      } else {
        return {
          userData: {
            name: userInfo.name,
          },
          pinnedGroups: [],
          groups: [],
        };
      }
    },
  });
  const { isMobile } = useContext(TgtContext);

  if (isPending || !data) {
    return <LoadingPage title="Profile" />;
  }

  return (
    <>
      <Head>
        <title>User Profile</title>
      </Head>
      <div className="p-6 flex lg:flex-row flex-col w-full gap-6">
        <aside className="flex flex-col gap-6 min-w-[380px]">
          <Card>
            <h2 className={css.userPanel__title}>
              {data.userData.username ||
                localStorage.getItem("userName") ||
                "No Name"}
            </h2>
            <p className={css.userPanel__email}>{data.userData.email}</p>
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
    </>
  );
}
