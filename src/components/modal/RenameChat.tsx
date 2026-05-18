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
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-4 px-6 py-5 w-xl bg-modal-bg rounded-modal border border-modal-border"
      >
        <h1 className="text-[22px]">Rename chat</h1>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3.5 py-2 bg-surface placeholder:text-text-secondary rounded-button outline-none border border-border resize-none field-sizing-content hide-scrollbar"
            placeholder={"New chat title"}
          />
        </div>
        <div className="flex justify-end gap-2 w-full">
          <button
            onClick={onCancel}
            className="px-5 py-1.5 bg-surface rounded-button border border-border cursor-pointer hover:bg-surface-hover transition-colors"
          >
            <span className="text-[15px]">Cancel</span>
          </button>
          <button
            onClick={() => onSubmit(title)}
            className="px-5 py-1.5 bg-text-primary rounded-button cursor-pointer"
          >
            <span className="text-[15px] text-bg">Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameChat;
