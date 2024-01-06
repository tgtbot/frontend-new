import Select from "./Select";
// import { useQuery } from "@tanstack/react-query";
// import { axios } from "queries";

// TODO: remove
const locationData = [
  { label: "Nigeria", value: "NG" },
  { label: "Japan", value: "JP" },
  { label: "Korea", value: "KO" },
  { label: "Kenya", value: "KE" },
  { label: "United Kingdom", value: "UK" },
  { label: "Ghana", value: "GH" },
  { label: "Uganda", value: "UG" }
];

export default function LanguageSelect({ onChange }: { onChange: (value: string) => void }) {
  // const { data, isPanding } = useQuery({
  //   queryKey: ["languages"],
  //   queryFn: () => axios.get("/languages"),
  //   select: (data: any) => data,
  // });

  return <Select label="Location" selectData={locationData} onChange={onChange} />;
}
