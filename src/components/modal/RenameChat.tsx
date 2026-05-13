import { useState } from "react";

const RenameChat = ({
  prevTitle,
  onSubmit,
  onCancel,
}: {
  prevTitle: string;
  onSubmit: (title: string) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(prevTitle);

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 backdrop-blur-[1px] bg-neutral-500/10 z-100"
    >
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-4 px-6 py-5 w-xl bg-light-bg rounded-[28px] border border-light-border">
        <h1 className="text-[22px]">Rename chat</h1>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3.5 py-2 bg-light-surface placeholder:text-light-text-secondary rounded-2xl outline-none border border-light-border resize-none field-sizing-content hide-scrollbar"
            placeholder={"New chat title"}
          />
        </div>
        <div className="flex justify-end gap-2 w-full">
          <button
            onClick={onCancel}
            className="px-5 py-1.5 bg-light-surface rounded-2xl border border-light-border cursor-pointer hover:bg-light-surface-hover transition-colors"
          >
            <span className="text-[15px]">Cancel</span>
          </button>
          <button
            onClick={() => onSubmit(title)}
            className="px-5 py-1.5 bg-light-text-primary rounded-2xl cursor-pointer"
          >
            <span className="text-[15px] text-light-bg">Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameChat;
