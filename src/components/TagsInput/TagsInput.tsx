import React from "react";
import { ReactTags } from "react-tag-autocomplete";
// Global CSS is in the root.scss file.

import type { Tag } from "react-tag-autocomplete";

const tagSuggestions = [
  {
    value: "tag1",
    label: "Tag1",
  },
  {
    value: "tag2",
    label: "Tag2",
  },
  {
    value: "tag3",
    label: "Tag3",
  },
];

export default function TagsInput({
  allowNew,
  onChange,
}: {
  allowNew?: boolean;
  onChange: (tags: Tag[]) => void;
}) {
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);

  const handleAddTag = React.useCallback(
    (newTag: Tag) => {
      const tags = [...selectedTags, newTag];
      setSelectedTags(tags);
      onChange(tags);
    },
    [selectedTags, setSelectedTags, onChange]
  );

  const handleRemoveTag = React.useCallback(
    (tagIndex: number) => {
      const tags = selectedTags.filter((_, i) => i !== tagIndex);
      setSelectedTags(tags);
      onChange(tags);
    },
    [selectedTags, setSelectedTags, onChange]
  );

  return (
    <ReactTags
      labelText=""
      selected={selectedTags}
      suggestions={tagSuggestions}
      onAdd={handleAddTag}
      onDelete={handleRemoveTag}
      noOptionsText="No matching tags"
      delimiterKeys={["Enter", "Tab", " "]}
      allowNew={allowNew || true}
      allowResize
    />
  );
}
