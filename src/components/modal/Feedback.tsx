import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Feedback = ({
  type,
  onSubmit,
  onCancel,
}: {
  type: "positive" | "negative";
  onSubmit: (
    type: "positive" | "negative",
    description: string | undefined,
  ) => void;
  onCancel: () => void;
}) => {
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 backdrop-blur-[1px] bg-neutral-500/10 z-100">
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-4 px-6 py-5 w-xl bg-neutral-100 rounded-[28px] border border-neutral-300/75">
        <h1 className="text-[22px]">Give {type} feedback</h1>
        {type === "negative" && (
          <div className="flex flex-col gap-2">
            <span>What type of issue do you wish to report? (optional)</span>
            <button className="flex justify-between items-center px-4.5 py-2.25 bg-neutral-200/50 rounded-2xl border border-neutral-300">
              <span className="font-normal text-neutral-500 select-none">
                Select...
              </span>
              <ChevronDown className="size-4.5" />
            </button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <span>Please provide details (optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4.5 py-3 min-h-19 max-h-49 bg-neutral-200/50 placeholder:text-neutral-500 rounded-3xl outline-none border border-neutral-300 resize-none field-sizing-content hide-scrollbar"
            placeholder={`What was ${type === "positive" ? "satisfying" : "unsatisfying"} about this response?`}
          />
        </div>
        <div className="flex justify-end gap-2 w-full">
          <button
            onClick={onCancel}
            className="px-5 py-1.5 bg-neutral-200 rounded-2xl border border-neutral-300 cursor-pointer"
          >
            <span className="text-[15px]">Cancel</span>
          </button>
          <button
            onClick={() =>
              onSubmit(type, description ? description : undefined)
            }
            className="px-5 py-1.5 bg-neutral-800 rounded-2xl cursor-pointer"
          >
            <span className="text-[15px] text-white">Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
