import { MessageCircle, Plus, Search } from "lucide-react";
import { Chat, Pages } from "../types";

const Sidebar = ({
  page,
  handlePage,
}: {
  page: Pages;
  handlePage: ({ name, id }: { name: Pages; id: string | null }) => void;
}) => {
  const getChats = (): Chat[] => {
    return [
      { id: "0", title: "Lorem ipsum, dolor sit amet.", emoji: "🪼" },
      { id: "1", title: "Lorem ipsum, dolor sit amet.", emoji: "🎀" },
      { id: "2", title: "Lorem ipsum, dolor sit amet.", emoji: "🌺" },
    ];
  };

  const chats = getChats();

  // TODO - at breaking point md, make sidebar fixed position

  return (
    <div
      className="h-screen w-[256px] bg-[#FAFAFA] border-r border-[#E3E3E3]"
      id="draggable"
    >
      <div className="h-14" />
      <div className="flex flex-col gap-1 px-2">
        <button
          onClick={() => handlePage({ name: "home", id: null })}
          className="flex gap-3 items-center p-2 w-full rounded-xl hover:bg-neutral-200/50"
        >
          <Plus className="size-4.75" />
          <span className="text-sm">New Chat</span>
        </button>
        <button className="flex gap-3 items-center p-2 w-full rounded-xl hover:bg-neutral-200/50">
          <Search className="size-4.75" />
          <span className="text-sm">Search</span>
        </button>
        <button className="flex gap-3 items-center p-2 w-full rounded-xl hover:bg-neutral-200/50">
          <MessageCircle className="size-4.75" />
          <span className="text-sm">Chats</span>
        </button>
      </div>
      <div className="h-8" />
      <div className="px-2">
        {/* TODO - Chat items have an awkward height, caused by emoji icon being too tall - fix somehow */}
        {chats.map((c) => (
          <button
            key={c.id}
            onClick={() => handlePage({ name: "chat", id: c.id })}
            className="flex gap-3 items-center p-2 w-full rounded-xl hover:bg-neutral-200/50"
          >
            <span className="text-xl">{c.emoji}</span>
            <span className="text-sm">{c.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
