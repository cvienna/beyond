import { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  LoaderCircle,
  Plus,
  Search,
} from "lucide-react";
import { useChatStore } from "@/store/chat";
import { useMessageInputStore } from "@/store/messageInput";
import { useUiStore } from "@/store/ui";
import { getModel, ModelId } from "@shared/models";
import { useCompletionStore } from "@/store/completion";
import { useStreamingStore } from "@/store/streaming";
import Menu from "./menu/Menu";
import MenuGroup from "./menu/Group";
import { getGroupedModels } from "@/utils/models";
import SmallButton from "./button/SmallButton";

const MessageInput = ({
  size,
  onReturn,
  inline = false,
}: {
  size: "sm" | "md" | "lg";
  onReturn?: () => void;
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
      className={`relative flex flex-col w-full bg-messageInput-bg rounded-messageInput border border-messageInput-border cursor-text
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
          className="px-5.5 pt-4.25 pb-2 w-full max-h-64 placeholder:text-text-secondary font-light resize-none field-sizing-content outline-none"
        />
      </div>
      <div className="flex justify-between px-3.75 pb-3.75 w-full">
        <div className="flex items-center gap-2">
          <SmallButton
            className="hover:bg-surface-hover group/text-hover"
            icon={
              <Plus className="size-4.5 text-text-secondary group-hover/text-hover:text-text-primary" />
            }
            label={{ content: "More", tooltip: true, position: "top" }}
            onClick={() => null}
          />
          <SmallButton
            className={
              data[target].search
                ? "bg-blue-200/30 text-blue-600/65"
                : "hover:bg-surface-hover group/text-hover"
            }
            icon={
              <Search
                className={`size-4.5
                ${data[target].search ? "text-blue-600/65" : "text-text-secondary group-hover/text-hover:text-text-primary"}
              `}
              />
            }
            label={{ content: "Search", tooltip: true, position: "top" }}
            onClick={() => toggleSearch(target)}
          />
          <SmallButton
            className={
              data[target].reasoning
                ? "bg-blue-200/30 text-blue-600/65"
                : "hover:bg-surface-hover group/text-hover"
            }
            icon={
              <Clock
                className={`size-4.5
                ${data[target].reasoning ? "text-blue-600/65" : "text-text-secondary group-hover/text-hover:text-text-primary"}
              `}
              />
            }
            label={{ content: "Reasoning", tooltip: true, position: "top" }}
            onClick={() => toggleReasoning(target)}
          />
        </div>
        <div className="relative flex items-center gap-2">
          {modelDropdown && (
            <Menu
              alignment="top"
              offset="start"
              groups={[
                ...Object.entries(getGroupedModels()).map(([_, models]) => (
                  <MenuGroup>
                    {...Object.entries(models).map(([id, model]) => (
                      <button
                        key={id}
                        onClick={() => setModel(target, id as ModelId)}
                        className={`flex items-center gap-2.5 px-2 py-2 rounded-button
                          ${id === data[target].model ? "bg-surface-hover" : "hover:bg-surface-hover"}
                        `}
                      >
                        <img src={getModel(id).icon} className="size-4.5" />
                        <span className="flex whitespace-nowrap text-sm">
                          {model.name}
                        </span>
                      </button>
                    ))}
                  </MenuGroup>
                )),
              ]}
            />
          )}
          <SmallButton
            className="hover:bg-surface-hover group/text-hover"
            icon={<img src={currentModel.icon} className="size-5" />}
            label={{ content: currentModel.name, tooltip: false }}
            onClick={(e) => {
              e.stopPropagation();
              setModelDropdown((prev) => !prev);
            }}
          />
          <SmallButton
            className={
              isStreaming
                ? "bg-surface-hover text-text-secondary"
                : "bg-text-primary text-bg"
            }
            icon={
              isStreaming ? (
                <LoaderCircle className="size-4.5 animate-spin" />
              ) : (
                <ArrowUp className="size-4.5" />
              )
            }
            onClick={handleSubmit}
          />
        </div>
      </div>
      {onReturn && (
        <SmallButton
          className={`absolute left-1/2 -translate-x-1/2 -top-3 -translate-y-full
              bg-surface text-text-secondary
              border border-border
              hover:bg-surface-hover hover:text-text-primary
            `}
          icon={<ArrowDown className="size-4.5" />}
          onClick={onReturn}
        />
      )}
    </div>
  );
};

export default MessageInput;
