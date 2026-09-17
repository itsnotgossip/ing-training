export function HelplineBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-brand-deep px-4 py-2 text-center text-xs text-white sm:text-sm print:hidden">
      If you or someone you know needs support:{" "}
      <strong className="text-[#f0c3e0]">
        National Domestic Abuse Helpline 0808 2000 247
      </strong>{" "}
      (free, 24/7) · In an emergency call{" "}
      <strong className="text-[#f0c3e0]">999</strong>, press 55 if you can't
      speak
    </div>
  );
}
