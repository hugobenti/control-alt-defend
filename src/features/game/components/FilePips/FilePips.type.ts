export type TFileState = "safe" | "carried" | "dropped" | "leaked";

export interface IFilePipsProps {
  files: TFileState[];
  className?: string;
}
