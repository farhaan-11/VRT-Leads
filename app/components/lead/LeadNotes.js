import { dayInNewYork, formatDay } from "@/lib/dates";

// created_at is a UTC timestamp. It is read as a Connecticut day before it
// is printed, so an evening call does not show tomorrow's date.
function Note({ note }) {
  return (
    <li className="border-l-2 border-[#E6E8EC] pl-3">
      <p className="text-[12px] text-[#98A2B3]">
        {formatDay(dayInNewYork(note.created_at))} · {note.author}
      </p>
      <p className="whitespace-pre-line text-[13px] text-[#0C111D]">{note.body}</p>
    </li>
  );
}

// Oldest first, so this reads downwards the way the conversation happened.
//
// The list scrolls inside its own box. A lead with ten notes would otherwise
// push the note form off the bottom of the modal, and the one thing the
// reader came to do would be the one thing they cannot see.
export default function LeadNotes({ notes }) {
  if (notes.length === 0) {
    return (
      <p className="text-[13px] text-[#667085]">Nothing has been written down yet.</p>
    );
  }

  return (
    <ol className="max-h-56 space-y-3 overflow-y-auto pr-1">
      {notes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
    </ol>
  );
}
