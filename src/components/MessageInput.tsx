import "../App.css";
import { useState, useEffect } from "react";
import { ArrowUp, Clock, Plus, Search } from "lucide-react";
import { useChatStore } from "@/store/chat";
import { useMessageInputStore } from "@/store/messageInput";
import { useUiStore } from "@/store/ui";
import { getModel, ModelId, MODELS } from "@shared/models";
import { useCompletionStore } from "@/store/completion";

const MessageInput = ({
  size,
  inline = false,
}: {
  size: "sm" | "md" | "lg";
  inline?: boolean;
}) => {
  const { route } = useUiStore();
  const { chats } = useChatStore();
  const { data, setPrompt, setModel, toggleReasoning, toggleSearch } =
    useMessageInputStore();
  const { submit } = useCompletionStore();

  const currentChat = chats
    ? chats.find((c) => route.page === "chat" && c.id === route.chatId)
    : undefined;
  const target = currentChat ? currentChat.id : "home";

  const [modelDropdown, setModelDropdown] = useState(false);

  useEffect(() => {
    const handler = () => setModelDropdown(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleSubmit = () => {
    submit(
      data[target].model,
      data[target].prompt,
      new Date(),
      currentChat?.id,
    );
  };

  const currentModel = getModel(data[target].model);

  return (
    <div
      className={`flex flex-col w-full bg-neutral-100/50 rounded-4xl border border-neutral-200 cursor-text
        ${inline && "-mt-6.5 mb-4"}
        ${size === "lg" ? "lg:max-w-3xl md:max-w-2xl max-w-160" : size === "md" ? "md:max-w-2xl max-w-160" : "max-w-160"}
      `}
    >
      <div>
        <textarea
          value={data[target].prompt}
          onChange={(e) => setPrompt(target, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Search..."
          className="px-5.5 pt-4.25 pb-2 w-full max-h-64 placeholder:text-neutral-500 font-light resize-none field-sizing-content outline-none"
        />
      </div>
      <div className="flex justify-between px-3.75 pb-3.75 w-full">
        <div className="flex items-center gap-2">
          <button className="flex gap-2 items-center p-1.5 rounded-full cursor-pointer hover:bg-neutral-200/60 transition-colors">
            <Plus className="size-4.5 text-[#333]" />
          </button>
          <button
            className={`select-none flex gap-2 items-center px-1.5 h-7.5 rounded-full cursor-pointer transition-colors
              ${data[target].search ? "bg-blue-200/30 text-blue-600/65" : "hover:bg-neutral-200/60 text-black"}
            `}
            onClick={() => toggleSearch(target)}
          >
            <Search className="size-4.5" />
            {/*{data[target].search && (
              <span className="pr-2 text-sm">Search</span>
            )}*/}
          </button>
          <button
            className={`select-none flex gap-2 items-center px-1.5 h-7.5 rounded-full cursor-pointer transition-colors
              ${data[target].reasoning ? "bg-blue-200/30 text-blue-600/65" : "hover:bg-neutral-200/60 text-black"}
            `}
            onClick={() => toggleReasoning(target)}
          >
            <Clock className="size-4.5" />
            {/*{data[target].reasoning && (
              <span className="pr-2 text-sm">Reasoning</span>
            )}*/}
          </button>
        </div>
        <div className="relative flex items-center gap-2">
          {modelDropdown && (
            <div className="select-none absolute -top-1 -translate-y-full flex flex-col gap-2 p-2 max-h-60 w-56 overflow-auto cursor-default bg-neutral-100 rounded-3xl border border-neutral-200 hide-scrollbar">
              {Object.entries(MODELS).map(([id, model], i, arr) => (
                <div key={i} className="flex flex-col gap-2">
                  <button
                    key={id}
                    onClick={() => setModel(target, id as ModelId)}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-2xl
                        ${id === data[target].model ? "bg-neutral-200/75" : "hover:bg-neutral-200/50"}
                      `}
                  >
                    <img src={getModel(id).icon} className="size-4.5" />
                    <span className="flex whitespace-nowrap text-sm">
                      {model.name}
                    </span>
                  </button>
                  {i < arr.length - 1 && (
                    <div className="h-px w-full bg-neutral-300" />
                  )}
                </div>
              ))}
            </div>
          )}

          <div
            onClick={(e) => {
              e.stopPropagation();
              setModelDropdown((prev) => !prev);
            }}
            className="select-none flex gap-2 items-center px-1.5 h-7.5 rounded-full cursor-pointer hover:bg-neutral-200/60 transition-colors"
          >
            <img src={currentModel.icon} className="size-5" />
            <span className="pr-1.5 text-sm text-neutral-500">
              {currentModel.name}
            </span>
          </div>
          <button
            onClick={handleSubmit}
            className="p-1.5 bg-black text-white rounded-full cursor-pointer"
          >
            <ArrowUp className="size-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
