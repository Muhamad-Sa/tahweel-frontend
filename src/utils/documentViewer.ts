export function documentViewerPath(slug: string, revisionId?: number) {
  const basePath = `/library/${slug}/view`;
  return revisionId ? `${basePath}?revision=${revisionId}` : basePath;
}

export function embeddedDocumentUrl(fileUrl: string) {
  return `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(fileUrl)}`;
}
