import { Check, Copy } from "lucide-react";
import { useState } from "react";
import SmallButton from "./button/SmallButton";

function formatLanguage(language: string | undefined) {
  if (!language) return "Code";
  const languages: Record<string, string> = {
    ts: "TypeScript",
    js: "JavaScript",
    py: "Python",
    python: "Python",
    sql: "SQL",
    json: "JSON",
    md: "Markdown",
  };

  return languages[language ?? ""] ?? language;
}

const CodeBlock = ({
  language,
  children,
}: {
  language: string | undefined;
  children: string;
}) => {
  const [copied, setCopied] = useState(false);

  return language || children.includes("\n") ? (
    <div className="flex flex-col my-4 w-full bg-codeBlock-bg font-inter rounded-codeBlock border border-codeBlock-border">
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-sm">{formatLanguage(language)}</span>
        <SmallButton
          className={`hover:bg-bg-hover group/text-hover`}
          icon={
            copied ? (
              <Check className="size-4 text-text-secondary group-hover/text-hover:text-text-primary" />
            ) : (
              <Copy className="size-4 text-text-secondary group-hover/text-hover:text-text-primary" />
            )
          }
          label={{
            content: copied ? "Copied" : "Copy",
            tooltip: true,
            position: "top",
          }}
          onClick={() => {
            navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        />
      </div>
      <div className="px-4 pt-1 pb-4 overflow-x-auto">
        <pre>
          <code className="text-sm text-text-secondary font-extralight font-jetbrains-mono">
            {children}
          </code>
        </pre>
      </div>
    </div>
  ) : (
    <span className="px-1.5 bg-surface text-neutral-500 font-jetbrains-mono font-extralight rounded-lg border border-codeBlock-border">
      {children}
    </span>
  );
};

export default CodeBlock;
