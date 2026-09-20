// Helpline message shown at the top of every page. By default it is a sticky
// bar pinned to the top of the viewport. Pass sticky={false} when it sits
// inside another sticky block (see ModulePlayer).
export function HelplineMessage() {
  return (
    <>
      If you or someone you know needs support:{" "}
      <strong className="text-pink-light">
        National Domestic Abuse Helpline 0808 2000 247
      </strong>{" "}
      (free, 24/7) · In an emergency call{" "}
      <strong className="text-pink-light">999</strong>, press 55 if you can't
      speak
    </>
  );
}

export function HelplineBar({ sticky = true }: { sticky?: boolean }) {
  return (
    <div
      className={`${sticky ? "sticky top-0 z-50" : ""} bg-brand-deep px-4 py-2 text-center text-xs text-white sm:text-sm print:hidden`}
    >
      <HelplineMessage />
    </div>
  );
}
