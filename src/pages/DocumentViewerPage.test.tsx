import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { useDocument } from "@/hooks/useDocuments";
import type { DocumentDetail } from "@/types";

import DocumentViewerPage from "./DocumentViewerPage";

vi.mock("@/hooks/useDocuments", () => ({
  useDocument: vi.fn(),
}));

vi.mock("@/features/documents/PdfViewer", () => ({
  PdfViewer: ({ fileUrl, title }: { fileUrl: string; title: string }) => (
    <div data-testid="pdf-viewer" data-file-url={fileUrl}>{title}</div>
  ),
}));

const document: DocumentDetail = {
  id: 1,
  title: "Test Datasheet",
  slug: "test-datasheet",
  document_code: "TEST-1",
  document_type: "datasheet",
  language: "en",
  category: null,
  section: null,
  product: null,
  cover_image: null,
  featured: false,
  description: "",
  standards: [],
  created_at: "2026-01-01",
  updated_at: "2026-01-01",
  current_revision: {
    id: 10,
    revision: "Current",
    version: 1,
    file_url: "https://github.com/Muhamad-Sa/tahweel-backend/releases/download/documents-v1/current.pdf",
    original_filename: "current.pdf",
    file_size: 1024,
    file_size_display: "1.0 KB",
    mime_type: "application/pdf",
    issue_date: "2026-01-01",
    status: "current",
  },
  revisions: [
    {
      id: 9,
      revision: "Previous",
      version: 0,
      file_url: "https://example.com/previous.pdf",
      original_filename: "previous.pdf",
      file_size: 512,
      file_size_display: "512 B",
      mime_type: "application/pdf",
      issue_date: "2025-01-01",
      status: "archived",
    },
  ],
};

describe("DocumentViewerPage", () => {
  it("embeds the current PDF inside the website", async () => {
    vi.mocked(useDocument).mockReturnValue({ data: document, isLoading: false, isError: false } as ReturnType<typeof useDocument>);

    render(
      <MemoryRouter initialEntries={["/library/test-datasheet/view"]}>
        <Routes>
          <Route path="/library/:slug/view" element={<DocumentViewerPage />} />
        </Routes>
      </MemoryRouter>
    );

    const viewer = await screen.findByTestId("pdf-viewer");
    expect(viewer).toHaveAttribute("data-file-url", "/document-files/current.pdf");
  });
});
