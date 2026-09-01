export function documentViewerPath(slug: string, revisionId?: number) {
  const basePath = `/library/${slug}/view`;
  return revisionId ? `${basePath}?revision=${revisionId}` : basePath;
}

const RELEASE_PATH = "/Muhamad-Sa/tahweel-backend/releases/download/documents-v1/";

export function viewableDocumentUrl(fileUrl: string) {
  try {
    const url = new URL(fileUrl);
    if (url.hostname === "github.com" && url.pathname.startsWith(RELEASE_PATH)) {
      return `/document-files/${url.pathname.slice(RELEASE_PATH.length)}`;
    }
  } catch {
    // Relative and local URLs are already served by the application.
  }

  return fileUrl;
}
