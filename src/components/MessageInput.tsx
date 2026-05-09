import "../App.css";
import { useState, useEffect } from "react";
import { ArrowUp, Clock, LoaderCircle, Plus, Search } from "lucide-react";
import { useChatStore } from "@/store/chat";
import { useMessageInputStore } from "@/store/messageInput";
import { useUiStore } from "@/store/ui";
import { getModel, ModelId, MODELS } from "@shared/models";
import { useCompletionStore } from "@/store/completion";
import Tooltip from "./Tooltip";
import { useStreamingStore } from "@/store/streaming";

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
  const { activeStreams } = useStreamingStore();

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
    submit(data[target].model, data[target].prompt, currentChat?.id);
    setPrompt(target, "");
  };

  const currentModel = getModel(data[target].model);

  // TODO: This is slow, consider extending logic for O(1) lookup
  const isStreaming = !!Object.keys(activeStreams).find(
    (s) => activeStreams[s].chatId === currentChat?.id,
  );

  return (
    <div
      className={`flex flex-col w-full bg-light-surface rounded-4xl border border-light-border cursor-text
        ${inline && "-mt-6.5 mb-4"}
        ${size === "lg" ? "lg:max-w-3xl md:max-w-2xl max-w-160" : size === "md" ? "md:max-w-2xl max-w-160" : "max-w-160"}
      `}
    >
      <div>
        <textarea
          value={data[target].prompt}
          onChange={(e) => setPrompt(target, e.target.value)}
          // NOTE: Not sure how I feel about this feature
          // Keeping it in case ever change my mind.
          //
          // onKeyDown={(e) => {
          //   if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
          //     e.preventDefault();
          //     handleSubmit();
          //   }
          // }}
          placeholder="Ask anything"
          className="px-5.5 pt-4.25 pb-2 w-full max-h-64 placeholder:text-light-text-secondary font-light resize-none field-sizing-content outline-none"
        />
      </div>
      <div className="flex justify-between px-3.75 pb-3.75 w-full">
        <div className="flex items-center gap-2">
          <button className="relative flex gap-2 items-center p-1.5 rounded-full cursor-pointer hover:bg-light-surface-hover transition-colors group/text-hover group/tooltip">
            <Plus className="size-4.5 text-light-text-secondary group-hover/text-hover:text-light-text-primary" />
            <Tooltip label="More" position="top" />
          </button>
          <button
            className={`relative flex gap-2 items-center px-1.5 h-7.5 rounded-full select-none cursor-pointer transition-colors group/text-hover group/tooltip
              ${data[target].search ? "bg-blue-200/30 text-blue-600/65" : "hover:bg-light-surface-hover"}
            `}
            onClick={() => toggleSearch(target)}
          >
            <Search
              className={`size-4.5
                ${data[target].search ? "text-blue-600/65" : "text-light-text-secondary group-hover/text-hover:text-light-text-primary"}
              `}
            />
            {/*{data[target].search && (
              <span className="pr-2 text-sm">Search</span>
            )}*/}
            <Tooltip label="Search" position="top" />
          </button>
          <button
            className={`relative flex gap-2 items-center px-1.5 h-7.5 rounded-full select-none cursor-pointer transition-colors group/text-hover group/tooltip
              ${data[target].reasoning ? "bg-blue-200/30 text-blue-600/65" : "hover:bg-light-surface-hover"}
            `}
            onClick={() => toggleReasoning(target)}
          >
            <Clock
              className={`size-4.5
                ${data[target].reasoning ? "text-blue-600/65" : "text-light-text-secondary group-hover/text-hover:text-light-text-primary"}
              `}
            />
            {/*{data[target].reasoning && (
              <span className="pr-2 text-sm">Reasoning</span>
            )}*/}
            <Tooltip label="Reasoning" position="top" />
          </button>
        </div>
        <div className="relative flex items-center gap-2">
          {modelDropdown && (
            <div className="select-none absolute -top-1 -translate-y-full flex flex-col gap-2 p-2 max-h-60 w-56 overflow-auto cursor-default bg-light-surface rounded-3xl border border-light-border hide-scrollbar">
              {Object.entries(MODELS).map(([id, model], i, arr) => (
                <div key={i} className="flex flex-col gap-2">
                  <button
                    key={id}
                    onClick={() => setModel(target, id as ModelId)}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-2xl
                        ${id === data[target].model ? "bg-light-surface-hover" : "hover:bg-light-surface-hover"}
                      `}
                  >
                    <img src={getModel(id).icon} className="size-4.5" />
                    <span className="flex whitespace-nowrap text-sm">
                      {model.name}
                    </span>
                  </button>
                  {i < arr.length - 1 && (
                    <div className="h-px w-full bg-light-border" />
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
            className="select-none flex gap-2 items-center px-1.5 h-7.5 rounded-full cursor-pointer hover:bg-light-surface-hover transition-colors"
          >
            <img src={currentModel.icon} className="size-5" />
            <span className="pr-1.5 text-sm text-light-text-secondary">
              {currentModel.name}
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isStreaming}
            className={`p-1.5 rounded-full cursor-pointer
              ${isStreaming ? "bg-light-surface-hover text-light-text-secondary" : "bg-light-text-primary text-light-bg"}
            `}
          >
            {isStreaming ? (
              <LoaderCircle className="size-4.5 animate-spin" />
            ) : (
              <ArrowUp className="size-4.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
