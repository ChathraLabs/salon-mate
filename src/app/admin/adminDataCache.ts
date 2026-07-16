type AdminDataKey = "bookings" | "services" | "staff" | "availability";

const endpoints: Record<AdminDataKey, string> = {
  bookings: "/api/admin/bookings",
  services: "/api/admin/services",
  staff: "/api/admin/staff",
  availability: "/api/admin/availability",
};

const values = new Map<AdminDataKey, unknown>();
const requests = new Map<AdminDataKey, Promise<unknown>>();

export function getCachedAdminData<T>(key: AdminDataKey): T | null {
  return (values.get(key) as T | undefined) ?? null;
}

export function setCachedAdminData<T>(key: AdminDataKey, value: T) {
  values.set(key, value);
}

export async function fetchAdminData<T>(key: AdminDataKey, force = false): Promise<T> {
  if (!force && values.has(key)) return values.get(key) as T;
  if (!force && requests.has(key)) return requests.get(key) as Promise<T>;

  const request = fetch(endpoints[key]).then(async (response) => {
    if (response.status === 401) throw new Error("UNAUTHORIZED");
    const text = await response.text();
    let data: unknown = {};
    try { data = text ? JSON.parse(text) : {}; }
    catch { throw new Error(`Invalid response while loading ${key}.`); }
    if (!response.ok) {
      const message = typeof data === "object" && data && "error" in data ? String(data.error) : `Unable to load ${key}.`;
      throw new Error(message);
    }
    values.set(key, data);
    return data;
  }).finally(() => requests.delete(key));

  requests.set(key, request);
  return request as Promise<T>;
}

export function prefetchAdminData() {
  return Promise.allSettled((Object.keys(endpoints) as AdminDataKey[]).map((key) => fetchAdminData(key)));
}
