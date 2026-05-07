import { useEffect, useState } from "react";

import {
  Ellipsis,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Search,
  Smile,
} from "lucide-react";
import { useUiStore } from "@/store/ui";
import { useChatStore } from "@/store/chat";
import { Chat } from "@server/schemas/chats";
import { useMessageInputStore } from "@/store/messageInput";

const Sidebar = () => {
  const { route, navigate } = useUiStore();
  const { chats, setChats, updateChat, removeChat } = useChatStore();
  const { setRecords } = useMessageInputStore();

  const [chatMenu, setChatMenu] = useState<string | null>(null);

  // Fetch chats from API
  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat`);
      const data: Chat[] = (await res.json()).data;

      setChats(data);
      setRecords(data);
    };

    fetchChats();
  }, []);

  // Click outside listener for collapse
  useEffect(() => {
    const handler = () => setChatMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleUpdateChat = async (id: string, data: Partial<object>) => {
    updateChat(id, data);

    await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const handleDeleteChat = async (id: string) => {
    removeChat(id);

    await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/${id}`, {
      method: "DELETE",
    });
  };

  return (
    <div
      className="h-screen w-[256px] bg-[#FAFAFA] border-r border-[#E3E3E3]"
      id="draggable"
    >
      <div className="h-14" />
      <div className="flex flex-col gap-1 px-2">
        <button
          onClick={() => navigate({ page: "home" })}
          className={`flex gap-3 items-center p-2 w-full rounded-xl
          ${route.page === "home" ? "bg-neutral-200/50" : "hover:bg-neutral-200/50"}
          `}
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
      <div className="flex flex-col gap-1 px-2">
        {chats &&
          chats.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate({ page: "chat", chatId: c.id })}
              className={`relative flex gap-3 items-center p-2 h-9 w-full rounded-xl group
              ${route.page === "chat" && route.chatId === c.id ? "bg-neutral-200/50" : "hover:bg-neutral-200/50"}
            `}
            >
              <span className="flex text-lg">{c.icon}</span>
              <span className="text-sm">{c.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChatMenu(c.id);
                }}
                className="absolute -translate-y-1/2 right-0 top-1/2 p-2.25 hidden group-hover:flex"
              >
                <Ellipsis className="size-4.5" />
              </button>
              {chatMenu === c.id && (
                <div className="absolute translate-y-full -bottom-2 right-0 z-100 flex flex-col gap-1 p-2 w-48 rounded-3xl bg-neutral-100 border border-neutral-200">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl hover:bg-neutral-200/50"
                  >
                    <Pencil className="size-4.5" />
                    <span className="text-[15px]">Rename</span>
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl hover:bg-neutral-200/50"
                  >
                    <Smile className="size-4.5" />
                    <span className="text-[15px]">Change Icon</span>
                  </button>
                  <div className="h-px w-full bg-neutral-200" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(c.id);
                    }}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-red-400 rounded-2xl hover:bg-neutral-200/50"
                  >
                    <Package className="size-4.5" />
                    <span className="text-[15px]">Archive</span>
                  </button>
                </div>
              )}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
