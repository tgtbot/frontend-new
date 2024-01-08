import { ResponsiveLine } from "@nivo/line";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/queries";
import dayjs from "dayjs";
import { TgtContext } from "../TgtProvider";
import { useContext } from "react";

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

export default function MessageTrendChart({ id }: { id: string }) {
  const { isMobile } = useContext(TgtContext);
  const { data, isPending } = useQuery<any>({
    queryKey: ["messageTrends", id],
    queryFn: ({ queryKey }: any) => axios.get(`/groups/msgs/${queryKey[1]}`),
    select: (data: any) => [
      {
        id: "Messages",
        data: data.data.data
          .slice(isMobile ? -7 : undefined)
          .map((i: { date: string; count: string }) => ({
            x: dayjs(i.date).format("MM/DD"),
            y: i.count,
          })),
      },
    ],
    enabled: !!id,
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
      tooltip={({ point }) => {
        return (
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
        );
      }}
    />
  );
}
