export function fmtDate(iso: string, short = false): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    ...(short ? {} : { year: "numeric" }),
  });
}
