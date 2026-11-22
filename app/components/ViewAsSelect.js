"use client";

import { switchViewer } from "@/app/actions/viewerActions";

// The dropdown changes the screen by itself. It used to need a Switch button
// next to it, which left the reader wondering whether their choice had taken
// effect or not.
//
// The key remounts the select every time the viewer changes. A select keeps
// whatever the browser last showed, so without this the dropdown said one
// name while the numbers below it belonged to another.
export default function ViewAsSelect({ viewer, viewers }) {
  return (
    <form action={switchViewer}>
      <select
        key={viewer.id}
        name="viewerId"
        defaultValue={viewer.id}
        aria-label="View as"
        onChange={(event) => event.target.form.requestSubmit()}
        className="rounded-lg border border-[#2A3344] bg-[#161C28] px-2.5 py-1.5 text-[13px] text-white"
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
