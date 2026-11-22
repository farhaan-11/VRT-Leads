"use client";

import { useState } from "react";
import { DEMO_LEADS, VIEWERS } from "@/app/preview/demoData";

const START = {
  leads: DEMO_LEADS,
  viewer: VIEWERS[0],
  tab: "leads",
  view: "all",
  owner: "",
  page: 1,
  busy: false,
  force: "none",
  openLead: null,
  openKind: "",
};

// Everything the preview remembers while the owner clicks around, in one
// place. One change function means a filter change can also reset the page
// number in the same step, so the two can never disagree.
export default function usePreview() {
  const [state, setState] = useState(START);

  function change(patch) {
    setState((old) => ({ ...old, ...patch }));
  }

  return [state, change];
}
