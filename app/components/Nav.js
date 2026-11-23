"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link, { useLinkStatus } from "next/link";

// A shared "a navigation is pending" signal that the top bar reads and every
// NavLink feeds into. Module-level and not a context, because the links live
// in many places and wrapping each tree in a provider would say the same
// thing in more code.
let activeCount = 0;
const listeners = new Set();

function bump(step) {
  activeCount = Math.max(0, activeCount + step);
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return activeCount > 0;
}

// On the server nothing is navigating yet, so this answer keeps the first
// render matching between the two sides.
function getServerSnapshot() {
  return false;
}

export function useIsNavigating() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// A form submit is not a Link, so useLinkStatus cannot see it. The View as
// dropdown reports its own pending state through this hook, and the top bar
// lights up for it the same way.
export function useReportNavigating(active) {
  useEffect(() => {
    if (!active) {
      return;
    }
    bump(1);
    return () => bump(-1);
  }, [active]);
}

// useLinkStatus reads the nearest ancestor Link, so this probe has to sit
// inside the Link's children, not next to it. It renders nothing.
function NavProbe() {
  const { pending } = useLinkStatus();
  useReportNavigating(pending);
  return null;
}

// A drop-in Link that feeds the top bar. Prefetch, keyboard and everything
// else behave exactly the same, because the probe is a hidden child.
export function NavLink({ children, ...props }) {
  return (
    <Link {...props}>
      <NavProbe />
      {children}
    </Link>
  );
}

// A blue bar pinned to the top of the window. It shows the moment a NavLink
// or the View as form is pending, and it disappears once nothing is.
//
// h-1 is 4px. The first pass at 2px was there but too thin for the reader to
// register before the next page arrived, and a cue that nobody sees is not a
// cue. The soft glow underneath makes the bar read as a strip of light, so
// it stands out above both the dark header and the light dashboard below.
// The pulse is slower than the eye expects to flicker, so it reads as "I am
// working" rather than as noise.
export function RouteProgress() {
  const navigating = useIsNavigating();

  if (!navigating) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-2 bg-[#4F46E5] shadow-[0_0_20px_rgba(79,70,229,0.95)] animate-pulse [animation-duration:800ms]"
    />
  );
}
