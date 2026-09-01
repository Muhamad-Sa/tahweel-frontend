const RELEASE_BASE_URL =
  "https://github.com/Muhamad-Sa/tahweel-backend/releases/download/documents-v1";
const MAX_RANGE_SIZE = 1024 * 1024;
const PDF_NAME_PATTERN = /^[A-Za-z0-9._()-]+\.pdf$/i;

function requestedRange(rangeHeader) {
  if (!rangeHeader) return `bytes=0-${MAX_RANGE_SIZE - 1}`;

  const match = /^bytes=(\d+)-(\d*)$/i.exec(rangeHeader);
  if (!match) return null;

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : start + MAX_RANGE_SIZE - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(requestedEnd) || requestedEnd < start) {
    return null;
  }

  return `bytes=${start}-${Math.min(requestedEnd, start + MAX_RANGE_SIZE - 1)}`;
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    return response.status(405).end();
  }

  const rawName = Array.isArray(request.query.name) ? request.query.name[0] : request.query.name;
  const filename = typeof rawName === "string" ? rawName : "";
  if (!PDF_NAME_PATTERN.test(filename)) {
    return response.status(400).json({ detail: "Invalid document filename." });
  }

  const range = request.method === "HEAD" ? undefined : requestedRange(request.headers.range);
  if (request.method === "GET" && !range) {
    return response.status(416).json({ detail: "Invalid byte range." });
  }

  try {
    const upstream = await fetch(`${RELEASE_BASE_URL}/${encodeURIComponent(filename)}`, {
      method: request.method,
      headers: range ? { Range: range } : undefined,
      redirect: "follow",
    });

    if (!upstream.ok) {
      return response.status(upstream.status).json({ detail: "Document source unavailable." });
    }

    const declaredLength = Number(upstream.headers.get("content-length"));
    if (
      request.method === "GET" &&
      (!Number.isFinite(declaredLength) || declaredLength > MAX_RANGE_SIZE)
    ) {
      await upstream.body?.cancel();
      return response.status(502).json({ detail: "Document source ignored the requested range." });
    }

    response.status(upstream.status);
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    response.setHeader("Accept-Ranges", "bytes");
    response.setHeader("Cache-Control", "public, max-age=86400");

    for (const header of ["content-range", "content-length", "etag", "last-modified"]) {
      const value = upstream.headers.get(header);
      if (value) response.setHeader(header, value);
    }

    if (request.method === "HEAD") return response.end();

    const body = Buffer.from(await upstream.arrayBuffer());
    return response.end(body);
  } catch {
    return response.status(502).json({ detail: "Document source unavailable." });
  }
}

export { requestedRange };
