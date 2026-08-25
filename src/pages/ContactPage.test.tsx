import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ToastProvider } from "@/components/ui/Toast";
import { api } from "@/api/endpoints";
import ContactPage, { buildWhatsAppUrl } from "./ContactPage";

function renderWithProviders(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <ToastProvider>{ui}</ToastProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("ContactPage form validation", () => {
  it("shows the Area Projects Manager contact details", () => {
    renderWithProviders(<ContactPage />);

    expect(screen.getByText("Youssef Samir")).toBeInTheDocument();
    expect(screen.getByText("Area Projects Manager")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "0558567576" })).toHaveAttribute(
      "href",
      "https://wa.me/966558567576"
    );
    expect(screen.getByRole("link", { name: "youssef.samier@tahweel.com" })).toHaveAttribute(
      "href",
      "mailto:youssef.samier@tahweel.com"
    );
    expect(screen.getByText("Jeddah, Saudi Arabia")).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    renderWithProviders(<ContactPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /send via whatsapp/i }));

    expect(await screen.findByText(/please enter your full name/i)).toBeInTheDocument();
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/message must be at least 10 characters/i)).toBeInTheDocument();
  });

  it("submits successfully with valid data and calls the API", async () => {
    const submitSpy = vi.spyOn(api.contact, "submit").mockResolvedValue({} as any);
    const navigateToWhatsApp = vi.fn();
    renderWithProviders(<ContactPage navigateToWhatsApp={navigateToWhatsApp} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Jane Engineer");
    await user.type(screen.getByLabelText(/^email/i), "jane@example.com");
    await user.type(screen.getByLabelText(/message/i), "We need pricing for a large residential project.");
    await user.click(screen.getByRole("button", { name: /send via whatsapp/i }));

    await waitFor(() => expect(submitSpy).toHaveBeenCalledTimes(1));
    expect(submitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Jane Engineer", email: "jane@example.com" })
    );
    expect(navigateToWhatsApp).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/wa\.me\/966558567576\?text=/)
    );
  });

  it("rejects an invalid email address", async () => {
    renderWithProviders(<ContactPage />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "Jane Engineer");
    await user.type(screen.getByLabelText(/^email/i), "not-an-email");
    await user.type(screen.getByLabelText(/message/i), "We need pricing for a large residential project.");
    await user.click(screen.getByRole("button", { name: /send via whatsapp/i }));

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it("formats the submitted details in the WhatsApp message", () => {
    const url = buildWhatsAppUrl({
      name: "Jane Engineer",
      email: "jane@example.com",
      inquiry_type: "quotation",
      message: "Please send pricing for our project.",
    });

    const message = decodeURIComponent(url.split("?text=")[1]);
    expect(message).toContain("Name: Jane Engineer");
    expect(message).toContain("Email: jane@example.com");
    expect(message).toContain("Inquiry type: Request a quotation");
    expect(message).toContain("Please send pricing for our project.");
  });
});
