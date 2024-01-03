import { useId } from "react";
import * as zagSwitch from "@zag-js/switch";
import { useMachine, normalizeProps } from "@zag-js/react";
import css from "./Switch.module.scss";

export default function Switch({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  const [state, send] = useMachine(
    zagSwitch.machine({
      id: useId(),
      checked,
      onCheckedChange: (details: any) => {
        onChange(details.checked);
      },
    })
  );

  const api = zagSwitch.connect(state, send, normalizeProps);

  return (
    <label {...api.rootProps} className={css.switch}>
      <input {...api.hiddenInputProps} />
      <span {...api.controlProps} className={css.switch__control}>
        <span {...api.thumbProps} className={css.switch__indicator} />
      </span>
    </label>
  );
}
