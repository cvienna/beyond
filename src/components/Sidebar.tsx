import { MessageCircle, Plus, Search } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="h-screen w-xs bg-[#FAFAFA] border-r border-[#E3E3E3]">
      <div className="h-14" />
      <div className="flex flex-col gap-1 px-2">
        <button className="flex gap-3 items-center p-2 w-full rounded-xl hover:bg-neutral-200/50">
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
        <button className="flex gap-3 items-center p-2 w-full rounded-xl hover:bg-neutral-200/50">
          <span className="text-xl">🪼</span>
          <span className="text-sm">Lorem ipsum, dolor sit amet.</span>
        </button>
        <button className="flex gap-3 items-center p-2 w-full rounded-xl hover:bg-neutral-200/50">
          <span className="text-xl">🎀</span>
          <span className="text-sm">Lorem ipsum, dolor sit amet.</span>
        </button>
        <button className="flex gap-3 items-center p-2 w-full rounded-xl hover:bg-neutral-200/50">
          <span className="text-xl">🌺</span>
          <span className="text-sm">Lorem ipsum, dolor sit amet.</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
