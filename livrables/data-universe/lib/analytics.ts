declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
