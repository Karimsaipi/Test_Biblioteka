export const toUploadsUrl = (p: string) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;

  const clean = p.replace(/\\/g, "/").replace(/^\/+/, "");
  const [path, suffix = ""] = clean.split(/([?#].*)/);

  const enc = path.split("/").filter(Boolean).map(encodeURIComponent).join("/");
  return `/uploads/${enc}${suffix}`;
};
