import { useState } from "react";
import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
// import PageLayout from "components/PageLayout";
import Card from "@/components/Card/Card";
// import TagsInput from "components/TagsInput";
// import { LanguageSelect, LocationSelect } from "components/Select";
import css from "@/styles/pages/Search.module.scss";
import { AxiosError } from "axios";
import { axios } from "@/queries";
import TagsInput from "@/components/TagsInput";
import { LocationSelect } from "@/components/Select";
import LanguageSelect from "@/components/Select/LocationSelect";

function searchFn(data: {
  name: string;
  tag: string;
  // location: string;
  language: string;
}) {
  return axios.post("/groups/search", data);
}
export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [tags, setTags] = useState<any>([]);
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");

  const {
    mutate: search,
    data: searchResult,
    isPending,
  } = useMutation({
    mutationKey: ["search"],
    mutationFn: searchFn,
    onError: (error: AxiosError<any>) => {
      const errorMassage = error.response?.data.message || error.message;
      toast.error(errorMassage);
    },
  });

  const handleSearch = () => {
    search({ name: keyword, tag: tags.join(","), language });
  };

  console.log(searchResult);

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>

      <div className="flex flex-col lg:flex-row gap-6 p-6">
        <Card className="min-w-[380px] h-full">
          <input
            type="search"
            value={keyword}
            placeholder="Keyword"
            onChange={(e) => setKeyword(e.target.value)}
            className={css.search}
          />
          <TagsInput onChange={setTags} />
          {/* <LocationSelect onChange={setLocation} /> */}
          <LanguageSelect onChange={setLanguage} />
          <button
            className={css.submitButton}
            onClick={handleSearch}
            disabled={isPending}
          >
            Search
          </button>
        </Card>

        <div className="space-y-2 w-full">
          <h3 className={css.mainHeading}>Search Results:</h3>
          {isPending ? (
            <div
              className={`p-4 overflow-hidden bg-[#242527] rounded-xl w-[300px] h-[300px] flex items-center justify-center`}
            >
              <span className="norLoader"></span>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <Card className="text-sm min-w-[300px] min-h-[200px] flex flex-col">
                <h2 className={css.groupPanel__title}>Search Result Example</h2>
                <p className={css.groupPanel__description}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo
                  laudantium vero reprehenderit deleniti itaque ea magni ullam
                  soluta hic. Eaque?
                </p>
                <div className={css.groupPanel__tags}>
                  <span className={css.groupPanel__tag}>tag1</span>
                  <span className={css.groupPanel__tag}>tag2</span>
                  <span className={css.groupPanel__tag}>tag3</span>
                </div>
                <div className={css.groupPanel__meta}>
                  <span className={css.groupPanel__location}>Los Angeles</span>
                  <span className={css.groupPanel__language}>English</span>
                </div>
              </Card>
              <Card className="text-sm min-w-[300px] min-h-[200px] flex flex-col">
                <h2 className={css.groupPanel__title}>Search Result Example</h2>
                <p className={css.groupPanel__description}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo
                  laudantium vero reprehenderit deleniti itaque ea magni ullam
                  soluta hic. Eaque?
                </p>
                <div className={css.groupPanel__tags}>
                  <span className={css.groupPanel__tag}>tag1</span>
                  <span className={css.groupPanel__tag}>tag2</span>
                  <span className={css.groupPanel__tag}>tag3</span>
                </div>
                <div className={css.groupPanel__meta}>
                  <span className={css.groupPanel__location}>Los Angeles</span>
                  <span className={css.groupPanel__language}>English</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
