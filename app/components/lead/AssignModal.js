"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { assignLeadToOwner } from "@/app/actions/leadActions";
import { Avatar, Button } from "@/app/components/ui";

const EMPTY_STATE = { done: false, error: "", typed: {} };

// The open count sits next to each name. Handing a lead to whoever is
// already buried is the mistake this box exists to prevent, and a number
// says it faster than any rule could.
function OwnerChoice({ person, chosen, onPick }) {
  const look = chosen ? "border-[#3538CD] bg-[#F5F6FF]" : "border-[#E6E8EC] hover:bg-[#F9FAFB]";

  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 ${look}`}>
      <input
        type="radio"
        name="ownerId"
        value={person.id}
        checked={chosen}
        onChange={() => onPick(person.id)}
        className="sr-only"
      />
      <Avatar name={person.name} />
      <span className="flex-1 text-[14px] font-medium text-[#0C111D]">{person.name}</span>
      <span className="text-[12px] text-[#667085]">{person.openLeads} open</span>
    </label>
  );
}

function Problem({ error }) {
  if (!error) {
    return null;
  }

  return (
    <p className="rounded-lg border border-[#FDA29B] bg-[#FEF3F2] p-2.5 text-[13px] text-[#B42318]">
      {error}
    </p>
  );
}

// The box closes itself once the write lands. Until then the button is
// disabled and says so, which is the only wait on this screen.
//
// router.refresh is the one that actually pulls the new row in. The server
// action already calls revalidatePath, which drops the server cache, but the
// client router keeps its own copy until it is told to let go. Without this
// line the row under the modal still reads as unowned.
export default function AssignModal({ lead, owners, onClose }) {
  const router = useRouter();
  const [picked, setPicked] = useState(0);
  const [state, submit, saving] = useActionState(assignLeadToOwner, EMPTY_STATE);

  useEffect(() => {
    if (state.done) {
      router.refresh();
      onClose();
    }
  }, [state.done, onClose, router]);

  return (
    <form action={submit} className="space-y-4">
      <input type="hidden" name="enquiryId" value={lead.id} />

      <div className="space-y-2">
        {owners.map((person) => (
          <OwnerChoice
            key={person.id}
            person={person}
            chosen={picked === person.id}
            onPick={setPicked}
          />
        ))}
      </div>

      <Problem error={state.error} />

      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" look="primary" disabled={!picked || saving}>
          {saving ? "Saving..." : "Assign lead"}
        </Button>
      </div>
    </form>
  );
}
