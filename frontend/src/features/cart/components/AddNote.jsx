import React, { memo } from "react";
import TextButton from "@/components/ui/buttons/TextButton";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

const AddNote = ({
  noteOpen,
  setNoteOpen,
  noteValue,
  setNoteValue,
  savedNote,
  handleSubmit,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TextButton
          onClick={() => setNoteOpen((n) => !n)}
          className="text-[12px]
    tracking-[0.04em]
   "
        >
          {savedNote ? "Edit order note" : "Add order note"}
        </TextButton>

        {noteOpen && (
          <TextButton
            onClick={() => setNoteOpen(false)}
            className="  text-[12px]
        tracking-[0.12em]"
          >
            Close
          </TextButton>
        )}
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]
          ${noteOpen ? "max-h-60 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
      >
        <div className="space-y-3 px-1 py-1">
          <textarea
            rows={3}
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            className="resize-none w-full border-b border-gray-300 py-2 text-base sm:text-sm pr-8
                    focus:outline-none focus:border-black transition-all 
    duration-150 px-2"
            placeholder="Add a note for your order..."
          />

          <PrimaryButton
            disabled={!noteValue || noteValue.trim() === savedNote}
            onClick={handleSubmit}
          >
            Save
          </PrimaryButton>
        </div>
      </div>

      {savedNote && !noteOpen && (
        <p
          className="  text-[12px]
        tracking-[0.04em]
        text-black/40"
        >
          Note saved
        </p>
      )}
    </div>
  );
};

export default memo(AddNote);
