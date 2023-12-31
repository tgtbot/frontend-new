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

function searchFn(data: {
  name: string;
  tag: string;
  location: string;
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
    console.log({ keyword, tags, location, language });
    // TODO: convert the state to match the search parameters format
    search({ name: keyword, tag: tags.join(","), location, language });
  };

  console.log(searchResult);

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>

      <div className={css.page}>
        <div>
          <Card className={css.filterPanel}>
            <input
              type="search"
              value={keyword}
              placeholder="Keyword"
              onChange={(e) => setKeyword(e.target.value)}
              className={css.search}
            />
            {/* <TagsInput onChange={setTags} />
              <LocationSelect onChange={setLocation} />
              <LanguageSelect onChange={setLanguage} /> */}
            <button
              className={css.submitButton}
              onClick={handleSearch}
              disabled={isPending}
            >
              Search
            </button>
          </Card>
        </div>

        <div>
          <h3 className={css.mainHeading}>Search Results:</h3>

          <div className={css.searchResults}>
            {isPending && <p>Loading...</p>}
            <Card className={css.groupPanel}>
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
        </div>
      </div>
    </>
  );
}
