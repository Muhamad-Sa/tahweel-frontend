const SITE_ACCESS_STORAGE_KEY = "tahweel_site_access_token";

export function getSiteAccessToken() {
  try {
    return sessionStorage.getItem(SITE_ACCESS_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setSiteAccessToken(token: string) {
  try {
    sessionStorage.setItem(SITE_ACCESS_STORAGE_KEY, token);
  } catch {
    // The current page remains unlocked even if browser storage is unavailable.
  }
}

export function clearSiteAccessToken() {
  try {
    sessionStorage.removeItem(SITE_ACCESS_STORAGE_KEY);
  } catch {
    // Nothing else is needed when storage is unavailable.
  }
}

export const SITE_ACCESS_REQUIRED_EVENT = "tahweel:site-access-required";
