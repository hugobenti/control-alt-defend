export interface ILiveRegionProps {
  message: string;
  slot: 0 | 1;
}

export interface ILiveRegionState extends ILiveRegionProps {
  announce(text: string): void;
}
