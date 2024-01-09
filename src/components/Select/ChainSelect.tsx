import Select from "./Select";
// import { useQuery } from "@tanstack/react-query";
// import { axios } from "queries";

const chainNameList = [
  { label: "scrollSepolia", value: "scrollSepolia" },
  { label: "mantleTestnet", value: "mantleTestnet" },
  { label: "filecoinCalibration", value: "filecoinCalibration" },
  { label: "polygonZkEvmTestnet", value: "polygonZkEvmTestnet" },
];

export default function ChainSelect({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  // const { data, isPanding } = useQuery({
  //   queryKey: ["languages"],
  //   queryFn: () => axios.get("/languages"),
  //   select: (data: any) => data,
  // });

  return (
    <Select
      label="choose a chain to Deposit"
      selectData={chainNameList}
      onChange={onChange}
    />
  );
}
