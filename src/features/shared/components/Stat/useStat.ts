export function useStat({ total }: { total?: string }) {
  return { totalText: total === undefined ? undefined : `/ ${total}` };
}
