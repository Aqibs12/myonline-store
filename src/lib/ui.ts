export const INPUT_CLASS =
  "rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-700 dark:border-white/20";

export function inputClass(hasError?: boolean): string {
  return hasError
    ? "rounded-lg border border-red-500 bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-700"
    : INPUT_CLASS;
}
