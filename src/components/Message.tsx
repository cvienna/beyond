import { ChevronRight, Copy, Pencil, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Message } from "@server/schemas/message";
import { useState } from "react";
import Feedback from "./Feedback";
import { client } from "@/lib/client";
import { useChatStore } from "@/store/chat";
import Tooltip from "./Tooltip";

const Message = ({
  data,
  isLast = false,
}: {
  data: Message;
  isLast?: boolean;
}) => {
  const { updateMessage } = useChatStore();
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(data.content);
  const [feedbackModal, setFeedbackModal] = useState<
    "positive" | "negative" | null
  >(null);

  const handleSubmit = async (
    type: "positive" | "negative",
    description: string | undefined,
  ) => {
    updateMessage(data.chatId, data.id, {
      feedback: {
        review: type === "positive" ? "good" : "bad",
        note: description,
      },
    });
    await client.api.message[":id"].$patch({
      param: { id: data.id },
      json: {
        feedback: {
          review: type === "positive" ? "good" : "bad",
          note: description,
        },
      },
    });
  };

  return (
    <div
      key={data.id}
      className={`flex w-full
        ${data.role === "user" && "justify-end"}
      `}
    >
      {/* Come back later to this - is key needed here or pass as a prop? ^^^ */}
      {data.role === "user" ? (
        <div className="flex flex-col items-end gap-4 group">
          <div className="px-4 py-2 max-w-100 bg-neutral-100 rounded-3xl border border-neutral-200">
            {editMode ? (
              <input
                type="text"
                onChange={(e) => setEditContent(e.target.value)}
                value={editContent}
                className="outline-none"
              />
            ) : (
              <span className="font-light">{data.content}</span>
            )}
          </div>
          <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm text-neutral-600">
              {new Date(data.createdAt).toLocaleTimeString()}
            </span>
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className="relative p-1.25 rounded-full hover:bg-neutral-100 transition-colors group/tooltip"
            >
              <Pencil className="size-4.5 text-neutral-600" />
              <Tooltip label="Edit" position="bottom" />
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(data.content)}
              className="relative p-1.25 rounded-full hover:bg-neutral-100 transition-colors group/tooltip"
            >
              <Copy className="size-4.5 text-neutral-600" />
              <Tooltip label="Copy" position="bottom" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 group">
          {data.reasoningContent && (
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 select-none">
                Thought for 14s
              </span>
              <ChevronRight className="size-4.75 text-neutral-500" />
              {/*<span className="font-light">{data.reasoningContent}</span>*/}
            </div>
          )}
          <span className="font-light">{data.content}</span>
          <div
            className={`flex items-center justify-start gap-2 opacity-0 transition-opacity
              ${isLast && (data.completionTokens || data.ttft || data.duration) && "opacity-100"}
              ${!isLast && "group-hover:opacity-100"}
            `}
          >
            <button
              onClick={() => navigator.clipboard.writeText(data.content)}
              className="relative p-1.25 rounded-full  hover:bg-neutral-100 transition-colors group/tooltip"
            >
              <Copy className="size-4.5 text-neutral-600" />
              <Tooltip label="Copy" position="bottom" />
            </button>
            <button
              onClick={() => setFeedbackModal("positive")}
              className="relative p-1.25 rounded-full hover:bg-neutral-100 transition-colors group/tooltip"
            >
              <ThumbsUp className="size-4.5 text-neutral-600" />
              <Tooltip label="Good response" position="bottom" />
            </button>
            <button
              onClick={() => setFeedbackModal("negative")}
              className="relative p-1.25 rounded-full hover:bg-neutral-100 transition-colors group/tooltip"
            >
              <ThumbsDown className="size-4.5 text-neutral-600" />
              <Tooltip label="Bad response" position="bottom" />
            </button>
            <span className="pl-1 text-sm text-neutral-600">
              {data.duration}s ·{" "}
              {(data.completionTokens! / data.duration!).toFixed(2)} tok/s ·{" "}
              {data.completionTokens} tokens
            </span>
          </div>
        </div>
      )}
      {feedbackModal && (
        <Feedback
          type={feedbackModal}
          onSubmit={(type, description) => handleSubmit(type, description)}
          onCancel={() => setFeedbackModal(null)}
        />
      )}
    </div>
  );
};

export default Message;
