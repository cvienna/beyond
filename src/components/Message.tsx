import {
  ChevronRight,
  CircleAlert,
  Copy,
  Pencil,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { Message } from "@server/schemas/message";
import { useState } from "react";
import Feedback from "./modal/Feedback";
import { client } from "@/lib/client";
import { useChatStore } from "@/store/chat";
import Tooltip from "./Tooltip";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

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
        <div className="flex flex-col items-end gap-4 w-full group">
          {editMode ? (
            <div className="flex flex-col gap-3 p-3 w-full bg-light-surface rounded-3xl border border-light-border">
              <div>
                <textarea
                  onChange={(e) => setEditContent(e.target.value)}
                  value={editContent}
                  placeholder="Better get it right this time"
                  className="flex px-3.5 py-2 w-full bg-light-surface-hover text-[15px] font-light rounded-2xl outline-none border border-light-border resize-none field-sizing-content placeholder:text-light-text-secondary"
                />
              </div>
              <div className="flex justify-between gap-4">
                <div className="flex gap-2 text-light-text-secondary">
                  <CircleAlert className="size-5" />
                  <span className="flex text-[13px]">
                    Editing this message will create a new conversation branch.
                    You can switch between branches using the arrow navigation
                    buttons.
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-5 py-1.5 bg-light-surface rounded-2xl border border-light-border cursor-pointer hover:bg-light-surface-hover transition-colors"
                  >
                    <span className="text-[15px]">Cancel</span>
                  </button>
                  <button className="px-5 py-1.5 bg-light-text-primary rounded-2xl cursor-pointer">
                    <span className="text-[15px] text-light-bg">Submit</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 py-2 bg-light-surface rounded-3xl border border-light-border">
                <span className="font-light">{data.content}</span>
              </div>
              <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm text-light-text-secondary">
                  {new Date(data.createdAt).toLocaleTimeString()}
                </span>
                <button
                  onClick={() => {
                    setEditContent(data.content);
                    setEditMode(true);
                  }}
                  className="relative p-1.5 rounded-full hover:bg-light-bg-hover transition-colors group/text-hover group/tooltip"
                >
                  <Pencil className="size-4.25 text-light-text-secondary group-hover/text-hover:text-light-text-primary" />
                  <Tooltip label="Edit" position="top" />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(data.content)}
                  className="relative p-1.5 rounded-full hover:bg-light-bg-hover transition-colors group/text-hover group/tooltip"
                >
                  <Copy className="size-4.25 text-light-text-secondary group-hover/text-hover:text-light-text-primary" />
                  <Tooltip label="Copy" position="top" />
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full group">
          {data.reasoningContent && (
            <div className="flex items-center gap-2">
              <span className="text-light-text-secondary select-none">
                Thought for 14s
              </span>
              <ChevronRight className="size-4.75 text-light-text-secondary" />
              {/*<span className="font-light">{data.reasoningContent}</span>*/}
            </div>
          )}
          <span className="font-light">
            <ReactMarkdown
              components={{
                code({ className, children }) {
                  const language = /language-(\w+)/.exec(className || "")?.[1];
                  return (
                    <CodeBlock language={language}>
                      {String(children)}
                    </CodeBlock>
                  );
                },
              }}
            >
              {data.content}
            </ReactMarkdown>
          </span>
          <div
            className={`flex items-center justify-start gap-2 opacity-0 transition-opacity
              ${isLast && (data.completionTokens || data.ttft || data.duration) && "opacity-100"}
              ${!isLast && "group-hover:opacity-100"}
            `}
          >
            <button
              onClick={() => navigator.clipboard.writeText(data.content)}
              className="relative p-1.5 rounded-full  hover:bg-light-bg-hover transition-colors group/text-hover group/tooltip"
            >
              <Copy className="size-4.25 text-light-text-secondary group-hover/text-hover:text-light-text-primary" />
              <Tooltip label="Copy" position="top" />
            </button>
            <button
              onClick={() => setFeedbackModal("positive")}
              className="relative p-1.5 rounded-full hover:bg-light-bg-hover transition-colors group/text-hover group/tooltip"
            >
              <ThumbsUp className="size-4.25 text-light-text-secondary group-hover/text-hover:text-light-text-primary" />
              <Tooltip label="Good response" position="top" />
            </button>
            <button
              onClick={() => setFeedbackModal("negative")}
              className="relative p-1.5 rounded-full hover:bg-light-bg-hover transition-colors group/text-hover group/tooltip"
            >
              <ThumbsDown className="size-4.25 text-light-text-secondary group-hover/text-hover:text-light-text-primary" />
              <Tooltip label="Bad response" position="top" />
            </button>
            <span className="pl-1 text-sm text-light-text-secondary">
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
          onSubmit={(type, description) => {
            handleSubmit(type, description);
            setFeedbackModal(null);
          }}
          onCancel={() => setFeedbackModal(null)}
        />
      )}
    </div>
  );
};

export default Message;
