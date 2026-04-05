import "../App.css";
import { useState } from "react";
import { ArrowUp, Plus, Search } from "lucide-react";
import MetaLogo from "../assets/meta.svg?url";

const MessageInput = ({
  size,
  inline = false,
}: {
  size: "sm" | "md" | "lg";
  inline?: boolean;
}) => {
  const [search, setSearch] = useState(true);

  return (
    <div
      className={`flex flex-col w-full bg-neutral-50 rounded-[28px] border border-neutral-200 cursor-text
        ${inline && "-mt-6.5 mb-4"}
        ${size === "lg" ? "lg:max-w-3xl md:max-w-2xl max-w-xl" : size === "md" ? "md:max-w-2xl max-w-xl" : "max-w-xl"}
      `}
    >
      <div className="">
        <textarea
          placeholder="Search..."
          className="px-5 py-3.5 w-full max-h-64 placeholder:text-neutral-500 resize-none field-sizing-content outline-none"
        />
      </div>
      <div className="flex justify-between px-3 pb-3 w-full">
        <div className="flex gap-2">
          <button className="flex gap-2 items-center p-1.25 rounded-full cursor-pointer hover:bg-neutral-200/50 transition-colors">
            <Plus className="size-5" />
          </button>
          <button
            className={`flex gap-2 items-center p-1.25 rounded-full cursor-pointer transition-colors
              ${search ? "bg-blue-200/40 text-blue-600/70" : "hover:bg-neutral-200/40 text-black"}
            `}
            onClick={() => setSearch(!search)}
          >
            <Search className="size-5" />
            {search && <span className="flex pr-2 text-sm">Search</span>}
          </button>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-2 items-center px-3 h-7.5 rounded-full cursor-pointer hover:bg-neutral-200/50 transition-colors">
            <img src={MetaLogo} className="size-5" />
            <span className="text-sm text-neutral-500">Llama 3.2 3B</span>
          </div>
          <button className="p-1.25 bg-black text-white rounded-full cursor-pointer">
            <ArrowUp className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
