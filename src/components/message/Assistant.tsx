import { ChevronRight, Copy, CircleDashed, Star, Check } from "lucide-react";
import type { Message } from "@server/schemas/message";
import { useState } from "react";
import Feedback from "../modal/Feedback";
import { client } from "@/lib/client";
import { useChatStore } from "@/store/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../CodeBlock";
import SmallButton from "../button/SmallButton";

const Assistant = ({
  data,
  isLast = false,
}: {
  data: Message;
  isLast?: boolean;
}) => {
  const { updateMessage } = useChatStore();
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (feedback: {
    length?: "too_long" | "just_right" | "too_short";
    tone?: "good" | "bad";
    contentQuality?: "good" | "bad";
    details?: string;
  }) => {
    updateMessage(data.chatId, data.id, { feedback });
    await client.api.message[":id"].$patch({
      param: { id: data.id },
      json: { feedback },
    });
  };

  return (
    <div
      key={data.id}
      className={`flex w-full
        ${data.role === "user" && "justify-end"}
      `}
    >
      <div className="flex flex-col gap-4 w-full group">
        {data.reasoningContent && (
          <div className="flex items-center gap-2">
            <span className="text-text-secondary select-none">
              Thought for 14s
            </span>
            <ChevronRight className="size-4.75 text-text-secondary" />
            {/*<span className="font-light">{data.reasoningContent}</span>*/}
          </div>
        )}
        <span className="font-light">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children }) {
                const language = /language-(\w+)/.exec(className || "")?.[1];
                return (
                  <CodeBlock language={language}>{String(children)}</CodeBlock>
                );
              },
              table({ children }) {
                return (
                  <div className="my-4 overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      {children}
                    </table>
                  </div>
                );
              },
              th({ children }) {
                return (
                  <th className="px-4 py-2 bg-surface text-left font-normal border border-border">
                    {children}
                  </th>
                );
              },
              td({ children }) {
                return (
                  <td className="border border-border px-4 py-2">{children}</td>
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
          <SmallButton
            className="hover:bg-bg-hover group/text-hover"
            onClick={() => {
              navigator.clipboard.writeText(data.content);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            icon={
              copied ? (
                <Check className="size-4.25 text-text-secondary group-hover/text-hover:text-text-primary" />
              ) : (
                <Copy className="size-4.25 text-text-secondary group-hover/text-hover:text-text-primary" />
              )
            }
            label={{
              content: copied ? "Copied" : "Copy",
              tooltip: true,
              position: "top",
            }}
          />
          {data.feedback ? (
            <SmallButton
              onClick={() => setFeedbackModal(true)}
              className="hover:bg-bg-hover group/text-hover"
              icon={
                <Star className="size-4.25 text-text-secondary group-hover/text-hover:text-text-primary" />
              }
              label={{
                content: "Update feedback",
                tooltip: true,
                position: "top",
              }}
            />
          ) : (
            <SmallButton
              onClick={() => setFeedbackModal(true)}
              className="hover:bg-bg-hover group/text-hover"
              icon={
                <CircleDashed className="size-4.25 text-text-secondary group-hover/text-hover:text-text-primary" />
              }
              label={{
                content: "Give feedback",
                tooltip: true,
                position: "top",
              }}
            />
          )}
          <span className="pl-1 text-sm text-text-secondary">
            {data.duration}s ·{" "}
            {(data.completionTokens! / data.duration!).toFixed(2)} tok/s ·{" "}
            {data.completionTokens} tokens
          </span>
        </div>
      </div>
      {feedbackModal && (
        <Feedback
          onSubmit={(feedback) => {
            handleSubmit(feedback);
            setFeedbackModal(null);
          }}
          onCancel={() => setFeedbackModal(null)}
        />
      )}
    </div>
  );
};

export default Assistant;
