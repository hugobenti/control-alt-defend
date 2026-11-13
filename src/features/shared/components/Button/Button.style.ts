export const button = {
  base: "inline-flex cursor-pointer items-center gap-2 rounded-md font-sans font-bold whitespace-nowrap disabled:cursor-not-allowed disabled:border-transparent disabled:bg-raised disabled:text-muted",
  variant: {
    primary: "bg-accent text-on-accent hover:bg-accent-hover",
    ghost: "border border-line bg-transparent text-fg hover:bg-raised",
    danger: "border border-danger/40 bg-transparent text-danger hover:bg-raised",
  },
  size: {
    sm: "h-[30px] px-2.5 text-[13px]",
    md: "h-[34px] justify-center px-3 text-[13px]",
  },
};
