import { Check, Copy } from "lucide-react";
import Tooltip from "./Tooltip";
import { useState } from "react";

function formatLanguage(language: string | undefined) {
  switch (language) {
    case "ts":
      return "TypeScript";
    case "js":
      return "JavaScript";
    case "py":
      return "Python";
    case "sql":
      return "SQL";
    case "json":
      return "JSON";
    default:
      return language ?? "Code";
  }
}

const CodeBlock = ({
  language,
  children,
}: {
  language: string | undefined;
  children: string;
}) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col my-4 w-full bg-light-surface font-inter rounded-[18px] border border-light-border">
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-sm">{formatLanguage(language)}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="relative p-1.5 rounded-full  hover:bg-light-bg-hover transition-colors group/text-hover group/tooltip"
        >
          {copied ? (
            <Check className="size-4 text-light-text-secondary group-hover/text-hover:text-light-text-primary" />
          ) : (
            <Copy className="size-4 text-light-text-secondary group-hover/text-hover:text-light-text-primary" />
          )}
          <Tooltip label={copied ? "Copied" : "Copy"} position="bottom" />
        </button>
      </div>
      <div className="px-4 pt-1 pb-4">
        <code className="text-sm text-light-text-secondary font-extralight font-jetbrains-mono">
          {children}
        </code>
      </div>
    </div>
  );
};

export default CodeBlock;
