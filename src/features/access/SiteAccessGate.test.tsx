import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkSiteAccess, unlockSite } from "@/api/siteAccess";

import { SiteAccessGate } from "./SiteAccessGate";

vi.mock("@/api/siteAccess", () => ({
  checkSiteAccess: vi.fn(),
  unlockSite: vi.fn(),
}));

const mockedCheckSiteAccess = vi.mocked(checkSiteAccess);
const mockedUnlockSite = vi.mocked(unlockSite);

describe("SiteAccessGate", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("shows protected content when the gate is disabled", async () => {
    mockedCheckSiteAccess.mockResolvedValue({ required: false, authenticated: true });

    render(<SiteAccessGate>Private content</SiteAccessGate>);

    expect(await screen.findByText("Private content")).toBeInTheDocument();
  });

  it("requires a passcode and unlocks after a successful response", async () => {
    const user = userEvent.setup();
    mockedCheckSiteAccess.mockResolvedValue({ required: true, authenticated: false });
    mockedUnlockSite.mockResolvedValue({
      required: true,
      authenticated: true,
      token: "signed-token",
      expires_in: 43200,
    });

    render(<SiteAccessGate>Private content</SiteAccessGate>);

    await user.type(await screen.findByLabelText("Passcode"), "correct-passcode");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => expect(mockedUnlockSite).toHaveBeenCalledWith("correct-passcode"));
    expect(await screen.findByText("Private content")).toBeInTheDocument();
    expect(sessionStorage.getItem("tahweel_site_access_token")).toBe("signed-token");
  });
});
