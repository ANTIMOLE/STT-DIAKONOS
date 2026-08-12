// ============================================
// GLOBAL LOADING STORE
// ============================================
// Store sederhana (tanpa dependency tambahan) buat ngelacak
// berapa banyak request axios yang lagi jalan bersamaan.
// Dipake bareng useSyncExternalStore di GlobalLoadingBar.

type Listener = () => void;

let activeRequests = 0;
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function startLoading() {
  activeRequests += 1;
  emitChange();
}

export function stopLoading() {
  activeRequests = Math.max(0, activeRequests - 1);
  emitChange();
}

export function subscribeLoading(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getLoadingSnapshot(): boolean {
  return activeRequests > 0;
}

// Dipake saat SSR — server gak pernah punya request axios aktif
// dari interceptor ini (yang jalan di client), jadi selalu false
// biar gak ada hydration mismatch.
export function getLoadingServerSnapshot(): boolean {
  return false;
}