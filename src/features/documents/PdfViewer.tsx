import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Loader2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  GlobalWorkerOptions,
  PDFDataRangeTransport,
  getDocument,
  type PDFDocumentLoadingTask,
  type PDFDocumentProxy,
  type RenderTask,
} from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

class DocumentRangeTransport extends PDFDataRangeTransport {
  private readonly controllers = new Set<AbortController>();
  private loadedBytes = 0;

  constructor(
    length: number,
    private readonly fileUrl: string,
    private readonly reportProgress: (loaded: number, total: number) => void,
    private readonly reportError: () => void
  ) {
    super(length, null, true);
  }

  requestDataRange(begin: number, end: number) {
    const controller = new AbortController();
    this.controllers.add(controller);

    void fetch(this.fileUrl, {
      headers: { Range: `bytes=${begin}-${end - 1}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status !== 206) throw new Error("Document range unavailable");

        const chunk = new Uint8Array(await response.arrayBuffer());
        if (chunk.length === 0) throw new Error("Empty document range");

        this.loadedBytes = Math.min(this.length, this.loadedBytes + chunk.length);
        this.reportProgress(this.loadedBytes, this.length);
        this.onDataRange(begin, chunk);
        this.onDataProgress(this.loadedBytes, this.length);
      })
      .catch((requestError) => {
        if (requestError?.name !== "AbortError") this.reportError();
      })
      .finally(() => this.controllers.delete(controller));
  }

  abort() {
    for (const controller of this.controllers) controller.abort();
    this.controllers.clear();
  }
}

export function PdfViewer({ fileUrl, title }: { fileUrl: string; title: string }) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const container = canvasAreaRef.current;
    if (!container) return;

    const updateWidth = () => setContainerWidth(container.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPdf(null);
    setPageNumber(1);
    setZoom(1);
    setError("");
    setLoadingProgress(0);

    const headController = new AbortController();
    let loadingTask: PDFDocumentLoadingTask | undefined;
    let rangeTransport: DocumentRangeTransport | undefined;
    let disposed = false;

    void fetch(fileUrl, { method: "HEAD", signal: headController.signal })
      .then((response) => {
        const length = Number(response.headers.get("content-length"));
        if (!response.ok || !Number.isSafeInteger(length) || length <= 0) {
          throw new Error("Document metadata unavailable");
        }

        rangeTransport = new DocumentRangeTransport(
          length,
          fileUrl,
          (loaded, total) => {
            if (!disposed) setLoadingProgress(Math.round((loaded / total) * 100));
          },
          () => {
            if (!disposed) {
              setError("This document could not be loaded in the viewer. Please try again.");
              setLoadingProgress(null);
            }
          }
        );

        loadingTask = getDocument({
          range: rangeTransport,
          length,
          disableStream: true,
          disableAutoFetch: true,
          rangeChunkSize: 1024 * 1024,
        });

        return loadingTask.promise;
      })
      .then((loadedPdf) => {
        if (!disposed) {
          setPdf(loadedPdf);
          setLoadingProgress(null);
        }
      })
      .catch((loadError) => {
        if (!disposed && loadError?.name !== "AbortError") {
          setError("This document could not be loaded in the viewer. Please try again.");
          setLoadingProgress(null);
        }
      });

    return () => {
      disposed = true;
      headController.abort();
      rangeTransport?.abort();
      if (loadingTask) void loadingTask.destroy();
    };
  }, [fileUrl]);

  useEffect(() => {
    if (!pdf || !canvasRef.current || containerWidth === 0) return;

    let renderTask: RenderTask | undefined;
    let cancelled = false;
    setRendering(true);

    void pdf
      .getPage(pageNumber)
      .then((page) => {
        if (cancelled || !canvasRef.current) return;

        const naturalViewport = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(containerWidth - 32, 280);
        const fitScale = Math.min(2, availableWidth / naturalViewport.width);
        const viewport = page.getViewport({ scale: fitScale * zoom });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        renderTask = page.render({
          canvasContext: context,
          viewport,
          transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
        });

        return renderTask.promise;
      })
      .catch((renderError) => {
        if (renderError?.name !== "RenderingCancelledException") {
          setError("This page could not be rendered. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setRendering(false);
      });

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [containerWidth, pageNumber, pdf, zoom]);

  function changePage(nextPage: number) {
    if (!pdf) return;
    setPageNumber(Math.min(Math.max(nextPage, 1), pdf.numPages));
    canvasAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      void viewerRef.current?.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  }

  return (
    <div
      ref={viewerRef}
      className="flex min-h-[620px] flex-col bg-charcoal-900"
      aria-label={`${title} viewer`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-charcoal-700 bg-charcoal-950 px-3 py-2 text-white">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            icon={<ChevronLeft className="h-4 w-4" />}
            disabled={!pdf || pageNumber <= 1}
            onClick={() => changePage(pageNumber - 1)}
            aria-label="Previous page"
          />
          <span className="min-w-24 text-center text-sm">
            {pdf ? `Page ${pageNumber} of ${pdf.numPages}` : "Loading PDF"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            icon={<ChevronRight className="h-4 w-4" />}
            disabled={!pdf || pageNumber >= pdf.numPages}
            onClick={() => changePage(pageNumber + 1)}
            aria-label="Next page"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            icon={<ZoomOut className="h-4 w-4" />}
            disabled={!pdf || zoom <= 0.6}
            onClick={() => setZoom((value) => Math.max(0.5, value - 0.2))}
            aria-label="Zoom out"
          />
          <span className="w-12 text-center text-xs">{Math.round(zoom * 100)}%</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            icon={<ZoomIn className="h-4 w-4" />}
            disabled={!pdf || zoom >= 2.4}
            onClick={() => setZoom((value) => Math.min(2.5, value + 0.2))}
            aria-label="Zoom in"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            icon={<RotateCcw className="h-4 w-4" />}
            disabled={!pdf || zoom === 1}
            onClick={() => setZoom(1)}
            aria-label="Reset zoom"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            icon={<Expand className="h-4 w-4" />}
            onClick={toggleFullscreen}
            aria-label="Full screen"
          />
        </div>
      </div>

      <div ref={canvasAreaRef} className="relative flex flex-1 justify-center overflow-auto p-4">
        {!pdf && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
            <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" />
            <p className="text-sm">
              Loading document{loadingProgress !== null ? ` · ${loadingProgress}%` : "…"}
            </p>
          </div>
        )}
        {error ? (
          <div
            className="m-auto max-w-md rounded-lg border border-red-400/30 bg-red-950/40 p-6 text-center text-sm text-red-100"
            role="alert"
          >
            {error}
          </div>
        ) : (
          <div className="relative self-start shadow-2xl">
            <canvas ref={canvasRef} className="block bg-white" />
            {rendering && pdf && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loader2
                  className="h-6 w-6 animate-spin text-brand-700"
                  aria-label="Rendering page"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
