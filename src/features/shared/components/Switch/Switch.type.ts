export interface ISwitchProps {
  /** Accessible name. */
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}
