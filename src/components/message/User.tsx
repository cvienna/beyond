import { CircleAlert, Copy, Pencil, Check } from "lucide-react";
import type { Message } from "@server/schemas/message";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../CodeBlock";
import SmallButton from "../button/SmallButton";

const User = ({ data }: { data: Message }) => {
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(data.content);
  const [copied, setCopied] = useState(false);

  return (
    <div
      key={data.id}
      className={`flex w-full
        ${data.role === "user" && "justify-end"}
      `}
    >
      <div className="flex flex-col items-end gap-4 w-full group">
        {editMode ? (
          <div className="flex flex-col gap-3 p-3 w-full bg-surface rounded-3xl border border-border">
            <div>
              <textarea
                onChange={(e) => setEditContent(e.target.value)}
                value={editContent}
                placeholder="Better get it right this time"
                className="flex px-3.5 py-2 w-full bg-surface-hover text-[15px] font-light rounded-2xl outline-none border border-border resize-none field-sizing-content placeholder:text-text-secondary"
              />
            </div>
            <div className="flex justify-between gap-4">
              <div className="flex gap-2 text-text-secondary">
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
                  className="px-5 py-1.5 bg-surface rounded-2xl border border-border cursor-pointer hover:bg-surface-hover transition-colors"
                >
                  <span className="text-[15px]">Cancel</span>
                </button>
                <button className="px-5 py-1.5 bg-text-primary rounded-2xl cursor-pointer">
                  <span className="text-[15px] text-bg">Submit</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4 py-2 max-w-full bg-surface rounded-3xl border border-border overflow-x-auto">
              <span className="font-light">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children }) {
                      const language = /language-(\w+)/.exec(
                        className || "",
                      )?.[1];
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
            </div>
            <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm text-text-secondary">
                {new Date(data.createdAt).toLocaleTimeString()}
              </span>
              <SmallButton
                className="hover:bg-bg-hover group/text-hover"
                onClick={() => {
                  setEditContent(data.content);
                  setEditMode(true);
                }}
                icon={
                  <Pencil className="size-4.25 text-text-secondary group-hover/text-hover:text-text-primary" />
                }
                label={{ content: "Edit", tooltip: true, position: "top" }}
              />
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default User;
