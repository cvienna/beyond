import { SidebarIcon, SquarePen } from "lucide-react";
import { constants } from "@shared/constants";
import { useUiStore } from "@/store/ui";
import Tooltip from "./Tooltip";
import { useChatStore } from "@/store/chat";

const Navbar = ({ width }: { width: number }) => {
  const { route, navigate, sidebar, toggleSidebar } = useUiStore();
  const { chats } = useChatStore();

  const trafficLightOffset =
    constants.trafficLight.position.x +
    3 * constants.trafficLight.diameter +
    2 * constants.trafficLight.spacing;

  const navbarHeight =
    constants.trafficLight.position.y * 2 + constants.trafficLight.diameter;

  const currentChat = chats?.find(
    (c) => route.page === "chat" && c.id === route.chatId,
  );

  return (
    <div
      className="fixed top-0 right-0 flex items-center z-100"
      id="draggable"
      style={{
        left: `${trafficLightOffset}px`,
        height: `${navbarHeight}px`,
      }}
    >
      <div
        className={`flex items-center gap-1 px-1.5 ${sidebar ? "justify-end" : "justify-start"}`}
        style={
          sidebar
            ? { width: `${width - trafficLightOffset}px` }
            : { width: "100%" }
        }
      >
        <button
          onClick={toggleSidebar}
          className="relative p-1.5 rounded-full hover:bg-light-surface-hover transition-colors group/tooltip"
        >
          <SidebarIcon className="size-4.5" />
          <Tooltip label="Sidebar" position="bottom" />
        </button>
        {!sidebar && currentChat && (
          <>
            <button
              onClick={() => navigate({ page: "home" })}
              className="relative p-1.5 rounded-full hover:bg-light-surface-hover transition-colors group/tooltip"
            >
              <SquarePen className="size-4.5" />
              <Tooltip label="New Chat" position="bottom" />
            </button>
            <span
              className={`pl-1 text-sm
                ${"text-neutral-500"}
              `}
            >
              {currentChat.title}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
