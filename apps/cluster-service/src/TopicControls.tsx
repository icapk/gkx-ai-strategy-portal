import { Input, Select } from "@arco-design/web-react";
import type { KeyboardEvent, ReactNode } from "react";

type TopicControlSize = "compact" | "regular";

type TopicOutlineSelectProps<T extends string> = {
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  onChange?: (value: T) => void;
  options: readonly T[];
  size?: TopicControlSize;
  value: T;
};

export function TopicOutlineSelect<T extends string>({
  ariaLabel,
  className = "",
  disabled,
  onChange,
  options,
  size = "compact",
  value,
}: TopicOutlineSelectProps<T>) {
  return <span className="tp-arco-select-boundary" onClick={(event) => { event.preventDefault(); event.stopPropagation(); }}>
    <Select
      aria-label={ariaLabel}
      className={`tp-arco-outline tp-arco-outline-select is-${size} ${className}`.trim()}
      disabled={disabled}
      dropdownMenuClassName="tp-arco-outline-popup"
      onChange={(nextValue) => onChange?.(nextValue as T)}
      options={options.map((item) => ({ label: item, value: item }))}
      triggerProps={{ autoAlignPopupWidth: true }}
      value={value}
    />
  </span>;
}

type TopicOutlineInputProps = {
  ariaLabel: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  className?: string;
  maxLength?: number;
  onChange: (value: string) => void;
  onPressEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  prefix?: ReactNode;
  size?: TopicControlSize;
  value: string;
};

export function TopicOutlineInput({
  ariaLabel,
  ariaControls,
  ariaExpanded,
  className = "",
  maxLength,
  onChange,
  onPressEnter,
  placeholder,
  prefix,
  size = "compact",
  value,
}: TopicOutlineInputProps) {
  return <Input
    aria-label={ariaLabel}
    aria-controls={ariaControls}
    aria-expanded={ariaExpanded}
    aria-haspopup={ariaExpanded === undefined ? undefined : "dialog"}
    aria-autocomplete={ariaExpanded === undefined ? undefined : "none"}
    role={ariaExpanded === undefined ? undefined : "combobox"}
    className={`tp-arco-outline tp-arco-outline-input is-${size} ${className}`.trim()}
    maxLength={maxLength}
    onChange={onChange}
    onPressEnter={onPressEnter}
    placeholder={placeholder}
    prefix={prefix}
    value={value}
  />;
}
