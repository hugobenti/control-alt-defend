interface ISegmentedOption<T extends string> {
  value: T;
  text: string;
}

export interface ISegmentedControlProps<T extends string> {
  /** Accessible name of the group. */
  label: string;
  options: ISegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}
