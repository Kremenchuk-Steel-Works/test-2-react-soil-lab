export function PdfViewer({ src, page = 1 }: { src: string; page?: number }) {
  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(src)}#page=${page}&zoom=page-fit`
  return <iframe src={viewerUrl} className="h-[100vh] w-full border-0" title="PDF viewer" />
}
