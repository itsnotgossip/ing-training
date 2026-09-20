"use client";

// Fixed round "Exit Site" button, matching the one on itsnotgossip.org.
// Immediately takes the user to a neutral website, replacing this page in
// their history so it is hard to find by accident.
export function QuickExit() {
  function exit() {
    window.open("https://www.bbc.co.uk/weather", "_blank");
    window.location.replace("https://www.google.co.uk");
  }

  return (
    <button
      type="button"
      onClick={exit}
      title="Leave this page immediately"
      aria-label="Exit site immediately"
      className="fixed bottom-5 right-5 z-[60] flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-full bg-brand text-center text-xs font-bold uppercase leading-tight text-white shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition hover:bg-brand-dark print:hidden"
    >
      <span>Exit</span>
      <span>Site</span>
    </button>
  );
}
