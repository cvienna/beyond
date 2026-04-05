import type { Message } from "../types";

const Message = ({ data }: { data: Message }) => {
  return (
    <div
      key={data.id}
      className={`flex w-full
        ${data.from === "user" && "justify-end"}
      `}
    >
      {/* Come back later to this */}
      {data.from === "user" ? (
        <div className="px-4.5 py-3 max-w-100 bg-neutral-100 rounded-3xl border border-neutral-200">
          <span>{data.content}</span>
        </div>
      ) : (
        <div className="">
          <span>{data.content}</span>
        </div>
      )}
    </div>
  );
};

export default Message;
