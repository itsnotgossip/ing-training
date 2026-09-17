"use client";

// Immediately takes the user to a neutral website, replacing this page in
// their history so it is hard to find by accident.
export function QuickExit() {
  function exit() {
    window.open("https://www.bbc.co.uk/weather", "_blank");
    window.location.replace("https://www.google.co.uk");
  }

  return (
    <button
      onClick={exit}
      title="Leave this page immediately"
      className="shrink-0 rounded-full bg-pink px-4 py-2 text-sm font-extrabold text-white transition hover:bg-pink-dark cursor-pointer"
    >
      Quick exit ✕
    </button>
  );
}
