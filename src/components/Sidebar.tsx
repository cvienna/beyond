import { forwardRef, useEffect, useRef, useState } from "react";

import { Ellipsis, Package, Pencil, Plus, Settings, Smile } from "lucide-react";
import { useUiStore } from "@/store/ui";
import { useChatStore } from "@/store/chat";
import { useMessageInputStore } from "@/store/messageInput";
import { client } from "@/lib/client";
import { chatResponseSchema } from "@shared/schemas/chat";
import RenameChat from "./modal/RenameChat";
import { UpdateChatInput } from "@server/schemas/chat";
import Menu from "./menu/Menu";
import MenuGroup from "./menu/Group";

const Sidebar = () => {
  const { route, navigate, sidebar, toggleSidebar } = useUiStore();
  const { chats, setChats, updateChat, removeChat } = useChatStore();
  const { setRecords } = useMessageInputStore();

  const chatMenuRef = useRef<HTMLDivElement | null>(null);
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
    const handler = (e: MouseEvent) => {
      if (
        chatMenuRef.current &&
        !chatMenuRef.current.contains(e.target as Node)
      ) {
        setChatMenu(null);
      }
    };

    document.addEventListener("click", handler);

    return () => document.removeEventListener("click", handler);
  }, [chatMenu]);

  const handleUpdateChat = async (id: string, data: UpdateChatInput) => {
    updateChat(id, data);

    await client.api.chat[":id"].$patch({ param: { id }, json: data });
  };

  const handleDeleteChat = async (id: string) => {
    removeChat(id);

    await client.api.chat[":id"].$delete({ param: { id } });
  };

  return (
    <>
      <div
        className="fixed flex flex-col justify-between h-screen w-[256px] bg-light-surface border-r border-light-border lg:static z-100"
        // id="draggable" // NOTE: Broken because of chatMenuRef click outside logic
      >
        <div>
          <div className="h-14" />
          <div className="flex flex-col gap-1 px-2">
            <button
              onClick={() => navigate({ page: "home" })}
              className={`flex gap-3 items-center p-2 w-full rounded-[14px] transition-colors hover:text-light-text-primary
              ${route.page === "home" ? "bg-light-surface-hover text-light-text-primary" : "text-light-text-secondary hover:bg-light-surface-hover"}
            `}
            >
              <Plus className="size-4.75" />
              <span className="text-sm">New Chat</span>
            </button>
            {/*<button className="flex gap-3 items-center p-2 w-full rounded-[14px] hover:bg-light-surface-hover text-light-text-secondary hover:text-light-text-primary transition-colors">
              <Search className="size-4.75" />
              <span className="text-sm">Search</span>
            </button>
            <button className="flex gap-3 items-center p-2 w-full rounded-[14px] hover:bg-light-surface-hover text-light-text-secondary hover:text-light-text-primary transition-colors">
              <MessageCircle className="size-4.75" />
              <span className="text-sm">Chats</span>
            </button>*/}
          </div>
          <div className="h-8" />
          <div className="relative flex flex-col gap-1 px-2">
            {chats &&
              chats.map((c) => (
                <div className="relative">
                  <button
                    key={c.id}
                    onClick={() => navigate({ page: "chat", chatId: c.id })}
                    className={`flex gap-3 items-center p-2 h-9 w-full rounded-[14px] hover:text-light-text-primary transition-colors group
                      ${
                        chatMenu === c.id ||
                        (route.page === "chat" && route.chatId === c.id)
                          ? "bg-light-surface-hover text-light-text-primary"
                          : "text-light-text-secondary hover:bg-light-surface-hover"
                      }
                    `}
                  >
                    <span className="flex text-lg">{c.icon}</span>
                    <span className="text-sm truncate">{c.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatMenu((prev) => (prev === c.id ? null : c.id));
                      }}
                      className={`absolute -translate-y-1/2 right-0 top-1/2 flex p-2.25 bg-light-surface-hover rounded-[14px] transition-opacity
                        ${chatMenu !== c.id && "opacity-0 group-hover:opacity-100"}
                      `}
                    >
                      <Ellipsis className="size-4.5" />
                    </button>
                  </button>
                  {chatMenu === c.id && (
                    <Menu
                      ref={chatMenuRef}
                      alignment="bottom"
                      offset="end"
                      groups={[
                        <MenuGroup>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatRename(c.id);
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 text-light-text-secondary rounded-2xl hover:bg-light-surface-hover hover:text-light-text-primary transition-colors"
                          >
                            <Pencil className="size-4.5" />
                            <span className="text-[15px]">Rename</span>
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-2.5 py-1.5 text-light-text-secondary rounded-2xl hover:bg-light-surface-hover hover:text-light-text-primary transition-colors"
                          >
                            <Smile className="size-4.5" />
                            <span className="text-[15px]">Change Icon</span>
                          </button>
                        </MenuGroup>,
                        <MenuGroup>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(c.id);
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 text-red-400/70 rounded-2xl hover:bg-light-surface-hover hover:text-red-400 transition-colors"
                          >
                            <Package className="size-4.5" />
                            <span className="text-[15px]">Archive</span>
                          </button>
                        </MenuGroup>,
                      ]}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
        <div className="px-2 py-3">
          <button className="flex gap-3 items-center p-2 w-full rounded-[14px] hover:bg-light-surface-hover text-light-text-secondary hover:text-light-text-primary transition-colors">
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
      {sidebar && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-linear-to-r from-neutral-500/50 to-neutral-500/1 lg:hidden z-90"
        />
      )}
    </>
  );
};

export default Sidebar;
