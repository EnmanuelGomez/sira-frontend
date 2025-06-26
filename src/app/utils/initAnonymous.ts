export function ensureAnonymousId(): void {
  if (typeof window !== "undefined") {
    if (!localStorage.getItem("anon_id")) {
      localStorage.setItem("anon_id", crypto.randomUUID());
    }
  }
}
