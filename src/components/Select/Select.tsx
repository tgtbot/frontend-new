import React from "react";
import * as select from "@zag-js/select";
import { useMachine, normalizeProps } from "@zag-js/react";
import css from "./Select.module.scss";

export default function Select({
  label,
  selectData,
  onChange,
}: {
  label: string;
  selectData: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  const collection = select.collection({
    items: selectData,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  });

  const [state, send] = useMachine(
    select.machine({
      id: React.useId(),
      collection,
      positioning: {
        sameWidth: true,
      },
      onValueChange: ({ value }) => {
        onChange(value[0]);
      },
    })
  );

  const api = select.connect(state, send, normalizeProps);

  return (
    <div {...api.rootProps} className={css.select}>
      <div {...api.controlProps}>
        <button {...api.triggerProps} className={css.select__trigger}>
          {api.valueAsString || label}
        </button>
      </div>

      <div {...api.positionerProps}>
        <ul {...api.contentProps} className={css.select__menu}>
          {selectData.map((item) => (
            <li
              key={item.value}
              {...api.getItemProps({ item })}
              className={css.select__option}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
