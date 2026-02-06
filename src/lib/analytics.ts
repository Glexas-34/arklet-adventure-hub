declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

export function trackPageView(viewName: string) {
  gtag("event", "page_view", {
    page_title: viewName,
    page_location: window.location.href,
  });
}

export function trackEvent(action: string, params?: Record<string, unknown>) {
  gtag("event", action, params);
}
