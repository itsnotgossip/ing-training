import { brandPillBtnClass } from "@/lib/ui";

// Plain anchor, not a next/link: the route returns a PDF with a
// Content-Disposition attachment header, so the browser downloads it and
// stays on the page. A client-side navigation would try to render it.
export function DownloadCertificateButton({ href }: { href: string }) {
  return (
    <a href={href} className={`${brandPillBtnClass} gap-2`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M4 20h16" />
      </svg>
      Download certificate
    </a>
  );
}
