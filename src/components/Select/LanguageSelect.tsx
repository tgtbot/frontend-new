import Select from "./Select";
// import { useQuery } from "@tanstack/react-query";
// import { axios } from "queries";

// TODO: remove
const languageData = [
  { label: "English", value: "English" },
  { label: "Chinese", value: "Chinese" },
];

export default function LanguageSelect({
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
    <Select label="Language" selectData={languageData} onChange={onChange} />
  );
}
