"use client";

import { useActionState } from "react";
import { switchViewer } from "@/app/actions/viewerActions";
import { useReportNavigating } from "@/app/components/Nav";

// The dropdown changes the screen by itself. It used to need a Switch button
// next to it, which left the reader wondering whether their choice had taken
// effect or not.
//
// The key remounts the select every time the viewer changes. A select keeps
// whatever the browser last showed, so without this the dropdown said one
// name while the numbers below it belonged to another.
//
// useActionState hands back a pending flag while the cookie is being written
// and the layout is being refetched. The select is disabled for that beat so
// a second click cannot queue a second switch, and the top bar lights up the
// same way it does for a Link navigation.
export default function ViewAsSelect({ viewer, viewers }) {
  const [, submit, pending] = useActionState(switchViewer, null);
  useReportNavigating(pending);

  return (
    <form action={submit}>
      <select
        key={viewer.id}
        name="viewerId"
        defaultValue={viewer.id}
        disabled={pending}
        aria-label="View as"
        onChange={(event) => event.target.form.requestSubmit()}
        className="rounded-lg border border-[#2A3344] bg-[#161C28] px-2.5 py-1.5 text-[13px] text-white transition disabled:opacity-60"
      >
        {viewers.map((one) => (
          <option key={one.id} value={one.id}>
            {one.name} - {one.role}
          </option>
        ))}
      </select>
    </form>
  );
}
