import { apiClient } from "./client";

export interface SiteAccessStatus {
  required: boolean;
  authenticated: boolean;
}

interface SiteAccessResponse extends SiteAccessStatus {
  token?: string;
  expires_in?: number;
}

export function checkSiteAccess() {
  return apiClient
    .get<SiteAccessStatus>("/auth/site-access/")
    .then((response) => response.data);
}

export function unlockSite(passcode: string) {
  return apiClient
    .post<SiteAccessResponse>("/auth/site-access/", { passcode })
    .then((response) => response.data);
}
