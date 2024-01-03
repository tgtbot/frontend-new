import { ResponsiveLine } from "@nivo/line";
import { useQueries } from "@tanstack/react-query";
import { axios } from "@/queries";
import dayjs from "dayjs";

const theme = {
  axis: {
    ticks: {
      line: {
        stroke: "#444",
      },
      text: {
        fill: "#aaa",
      },
    },
  },
  grid: {
    line: {
      stroke: "#444",
    },
  },
};

export default function UserTrendChart({ id }: { id: string }) {
  const { data, isPending } = useQueries<any, any>({
    queries: [
      {
        queryKey: ["newUsers", id],
        queryFn: ({ queryKey }: any) =>
          axios.get(`/groups/new_users/${queryKey[1]}`),
        select: (data: any) => data.data.data,
        enabled: !!id,
      },
      {
        queryKey: ["uniqueSpeakers", id],
        queryFn: ({ queryKey }: any) =>
          axios.get(`/groups/unique_speakers/${queryKey[1]}`),
        select: (data: any) => data.data.data,
        enabled: !!id,
      },
    ],
    combine: (results: any) => {
      return {
        isPending: results.some((result: any) => result.isPending),
        data: [
          {
            id: "New Users",
            data: (results[0]?.data || []).map(
              (i: { date: string; daily_avg_amount: number }) => ({
                x: dayjs(i.date).format("MM/DD"),
                y: i.daily_avg_amount,
              })
            ),
          },
          {
            id: "Unique Speakers",
            data: (results[1]?.data || []).map(
              (i: { date: string; count: number }) => ({
                x: dayjs(i.date).format("MM/DD"),
                y: i.count,
              })
            ),
          },
        ],
      };
    },
  });

  return (
    <ResponsiveLine
      data={isPending ? [] : data}
      margin={{ top: 16, right: 8, bottom: 24, left: 28 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        reverse: false,
      }}
      pointSize={10}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      enableGridY={false}
      curve="linear"
      theme={theme}
      useMesh={true}
      tooltip={({ point }) => (
        <div
          style={{
            color: "black",
            background: "white",
            padding: "6px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "block",
              width: 14,
              height: 14,
              background: point.color,
            }}
          />
          <span style={{ marginLeft: 8, marginRight: 4 }}>
            {point.data.x.toString()}:
          </span>
          <span>
            {point.data.y.toString()} {point.serieId.toString()}
          </span>
        </div>
      )}
    />
  );
}
