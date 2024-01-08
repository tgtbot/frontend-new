import { ResponsivePie } from "@nivo/pie";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/queries";

export default function LevelPieChart({ id }: { id: string }) {
  const { data, isPending } = useQuery<any>({
    queryKey: ["levels", id],
    queryFn: ({ queryKey }: any) => axios.get(`/groups/level/${queryKey[1]}`),
    select: (data: any) => {
      return data.data.data
        .map((i: { level: number; count: number }) => ({
          id: `LV${i.level}`,
          value: i.count,
        }))
        .sort((a: any, b: any) => {
          const numA = parseInt(a.id.match(/\d+/)[0]);
          const numB = parseInt(b.id.match(/\d+/)[0]);
          return numA - numB;
        });
    },
    enabled: !!id,
  });
  const { data: user, isPending: userPending } = useQuery<any>({
    queryKey: ["totalUser", id],
    queryFn: ({ queryKey }: any) => axios.get(`/groups/users/${queryKey[1]}`),
    select: (data: any) => {
      return data.data.data["24h_ago"].avg_amount;
    },
    enabled: !!id,
  });
  console.log("user", user);

  return (
    <ResponsivePie
      data={isPending ? [] : data}
      sortByValue={true}
      margin={{ top: 8, right: 8, bottom: 32, left: 8 }}
      innerRadius={0.45}
      padAngle={2}
      cornerRadius={4}
      borderWidth={2}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.25]],
      }}
      arcLabel={(point) => {
        const percentage = ((point.value / user) * 100).toFixed(0);
        return `${point.id}: ${percentage}%`;
      }}
      enableArcLinkLabels={false}
      activeOuterRadiusOffset={4}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          translateX: 24,
          translateY: 32,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 16,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 16,
          symbolShape: "circle",
        },
      ]}
      tooltip={(point) => {
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
                background: point.datum.color,
              }}
            />
            <span style={{ marginLeft: 8, marginRight: 4 }}>
              {point.datum.label}:
            </span>
            <span>{point.datum.value}</span>
          </div>
        );
      }}
    />
  );
}
