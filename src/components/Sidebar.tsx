import { useEffect, useState } from "react";

import {
  Ellipsis,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Search,
  Settings,
  Smile,
} from "lucide-react";
import { useUiStore } from "@/store/ui";
import { useChatStore } from "@/store/chat";
import { useMessageInputStore } from "@/store/messageInput";
import { client } from "@/lib/client";
import { chatResponseSchema } from "@shared/schemas/chat";
import RenameChat from "./modal/RenameChat";
import { UpdateChatInput } from "@server/schemas/chat";

const Sidebar = () => {
  const { route, navigate } = useUiStore();
  const { chats, setChats, updateChat, removeChat } = useChatStore();
  const { setRecords } = useMessageInputStore();

  const [chatMenu, setChatMenu] = useState<string | null>(null);
  const [chatRename, setChatRename] = useState<string | null>(null);

  // Fetch chats from API
  useEffect(() => {
    const fetchChats = async () => {
      const res = await client.api.chat.$get();
      const data = (await res.json()).data;
      const parsed = chatResponseSchema.array().parse(data);

      setChats(parsed);
      setRecords(parsed);
    };

    fetchChats();
  }, []);

  // Click outside listener for collapse
  useEffect(() => {
    const handler = () => setChatMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleUpdateChat = async (id: string, data: UpdateChatInput) => {
    updateChat(id, data);

    await client.api.chat[":id"].$patch({ param: { id }, json: data });
  };

  const handleDeleteChat = async (id: string) => {
    removeChat(id);

    await client.api.chat[":id"].$delete({ param: { id } });
  };

  return (
    <div
      className="flex flex-col justify-between h-screen w-[256px] bg-light-surface border-r border-light-border"
      id="draggable"
    >
      <div>
        <div className="h-14" />
        <div className="flex flex-col gap-1 px-2">
          <button
            onClick={() => navigate({ page: "home" })}
            className={`flex gap-3 items-center p-2 w-full rounded-[14px] transition-colors
              ${route.page === "home" ? "bg-light-surface-hover" : "hover:bg-light-surface-hover"}
            `}
          >
            <Plus className="size-4.75" />
            <span className="text-sm">New Chat</span>
          </button>
          <button className="flex gap-3 items-center p-2 w-full rounded-[14px] hover:bg-light-surface-hover transition-colors">
            <Search className="size-4.75" />
            <span className="text-sm">Search</span>
          </button>
          <button className="flex gap-3 items-center p-2 w-full rounded-[14px] hover:bg-light-surface-hover transition-colors">
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
                className={`relative flex gap-3 items-center p-2 h-9 w-full rounded-[14px] transition-colors group
              ${route.page === "chat" && route.chatId === c.id ? "bg-light-surface-hover" : "hover:bg-light-surface-hover"}
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
                  <div className="absolute translate-y-full -bottom-2 right-0 z-100 flex flex-col gap-1 p-2 w-48 rounded-3xl bg-light-surface border border-light-border">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatRename(c.id);
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl hover:bg-light-surface-hover"
                    >
                      <Pencil className="size-4.5" />
                      <span className="text-[15px]">Rename</span>
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl hover:bg-light-surface-hover"
                    >
                      <Smile className="size-4.5" />
                      <span className="text-[15px]">Change Icon</span>
                    </button>
                    <div className="h-px w-full bg-light-border" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(c.id);
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-red-400 rounded-2xl hover:bg-light-surface-hover"
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
      <div className="px-2 py-3">
        <button className="flex gap-3 items-center p-2 w-full rounded-[14px] hover:bg-light-surface-hover transition-colors">
          <Settings className="size-4.75" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
      {/* Might be safer to pass chatId to component, but should in theory never fail */}
      {chatRename && (
        <RenameChat
          prevTitle={chats?.find((c) => c.id === chatRename)?.title ?? ""}
          onCancel={() => setChatRename(null)}
          onSubmit={(title) => {
            handleUpdateChat(chatRename, { title });
            setChatRename(null);
          }}
        />
      )}
    </div>
  );
};

export default Sidebar;
