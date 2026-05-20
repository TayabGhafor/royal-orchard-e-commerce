const KEY = "royalorchard-guest-session";

export function getGuestSessionId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = `g_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return `g_${Date.now()}`;
  }
}
