import { SidebarIcon, SquarePen } from "lucide-react";
import { constants } from "@shared/constants";
import { useUiStore } from "@/store/ui";
import Tooltip from "./Tooltip";
import { useChatStore } from "@/store/chat";
import SmallButton from "./button/SmallButton";

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
        <SmallButton
          className={`text-text-secondary
            hover:bg-surface-hover hover:text-text-primary`}
          icon={<SidebarIcon className="size-4.5" />}
          label={{ content: "Sidebar", tooltip: true, position: "bottom" }}
          onClick={toggleSidebar}
        />
        {!sidebar && currentChat && (
          <>
            <SmallButton
              className={`text-text-secondary
                hover:bg-surface-hover hover:text-text-primary`}
              icon={<SquarePen className="size-4.5" />}
              label={{ content: "New chat", tooltip: true, position: "bottom" }}
              onClick={() => navigate({ page: "home" })}
            />
            <span className="pl-1 text-sm text-text-secondary">
              {currentChat.title}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
