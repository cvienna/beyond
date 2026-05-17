import { ChevronRight } from "lucide-react";
import { useState } from "react";

const Select = ({
  label,
  choices,
  optional,
  onSelect,
}: {
  label: string;
  choices: { id: string; label: string }[];
  optional: boolean;
  onSelect: (choice: string) => void;
}) => {
  const [selectMenu, setSelectMenu] = useState(false);

  return (
    <div className="relative flex flex-col gap-2">
      <span>{label}</span>
      <button
        onClick={() => setSelectMenu(!selectMenu)}
        className={`flex justify-between items-center px-4.5 py-2.25 rounded-2xl border border-modal-border transition-colors
          ${selectMenu ? "bg-surface-hover" : "bg-surface hover:bg-surface-hover"}
        `}
      >
        <span className="font-normal text-text-secondary select-none">
          Select
        </span>
        <ChevronRight
          className={`size-4.5 transition-transform
          ${selectMenu ? "rotate-90" : "rotate-0"}
        `}
        />
      </button>
      {selectMenu && (
        <>
          <div
            onClick={() => setSelectMenu(false)}
            className="fixed inset-0 z-90"
          />
          <div className="absolute -bottom-1 translate-y-full flex flex-col gap-2 p-2 w-full bg-modal-bg border border-modal-border rounded-modal z-100">
            {choices.map((c) => (
              <button
                onClick={() => {
                  onSelect(c.id);
                  setSelectMenu(false);
                }}
                className="flex px-3.5 py-1.75 rounded-2xl hover:bg-surface-hover transition-colors"
              >
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Feedback = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (feedback: {
    length?: "too_long" | "just_right" | "too_short";
    tone?: "good" | "bad";
    contentQuality?: "good" | "bad";
    details?: string;
  }) => void;
  onCancel: () => void;
}) => {
  const [feedback, setFeedback] = useState<{
    length?: "too_long" | "just_right" | "too_short";
    tone?: "good" | "bad";
    contentQuality?: "good" | "bad";
    details?: string;
  }>();

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 backdrop-blur-[1px] bg-neutral-500/10 z-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-4 px-6 py-5 w-xl bg-modal-bg rounded-[28px] border border-modal-border"
      >
        <h1 className="text-[22px]">Give feedback</h1>
        <Select
          label="Message length 😉"
          choices={[
            { id: "too_long", label: "Too long" },
            { id: "just_right", label: "Just right" },
            { id: "too_short", label: "Too short" },
          ]}
          optional
          onSelect={() => null}
        />
        <Select
          label="Tone"
          choices={[
            { id: "good", label: "Excellent" },
            { id: "bad", label: "Poor" },
          ]}
          optional
          onSelect={() => null}
        />
        <Select
          label="Content quality"
          choices={[
            { id: "good", label: "Excellent" },
            { id: "bad", label: "Poor" },
          ]}
          optional
          onSelect={() => null}
        />
        <div className="flex flex-col gap-2">
          <span>Details</span>
          <textarea
            value={feedback?.details ?? ""}
            onChange={(e) =>
              setFeedback((prev) => ({ ...prev, details: e.target.value }))
            }
            className="px-4.5 py-3 min-h-19 max-h-49 bg-surface focus:bg-surface-hover placeholder:text-text-secondary rounded-3xl outline-none border border-border resize-none field-sizing-content hide-scrollbar transition-colors"
            placeholder="What was unique about this response?"
          />
        </div>
        <div className="flex justify-end gap-2 w-full">
          <button
            onClick={onCancel}
            className="px-5 py-1.5 bg-surface rounded-2xl border border-border cursor-pointer hover:bg-bg-hover transition-colors"
          >
            <span className="text-[15px]">Cancel</span>
          </button>
          <button
            onClick={() => {
              if (feedback) onSubmit(feedback);
              else onCancel();
            }}
            className="px-5 py-1.5 bg-text-primary rounded-2xl cursor-pointer"
          >
            <span className="text-[15px] text-bg">Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
