import { SidebarIcon, SquarePen } from "lucide-react";
import { constants } from "@shared/constants";
import { useUiStore } from "@/store/ui";

const Navbar = ({ width }: { width: number }) => {
  const { route, navigate, sidebar, toggleSidebar } = useUiStore();

  const trafficLightOffset =
    constants.trafficLight.position.x +
    3 * constants.trafficLight.diameter +
    2 * constants.trafficLight.spacing;

  const navbarHeight =
    constants.trafficLight.position.y * 2 + constants.trafficLight.diameter;

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
          className="p-1.5 rounded-full hover:bg-neutral-200/60 transition-colors"
        >
          <SidebarIcon className="size-4.5" />
        </button>
        {!sidebar && route.page !== "home" && (
          <>
            <button className="p-1.5 rounded-full hover:bg-neutral-200/60 transition-colors">
              <SquarePen
                onClick={() => navigate({ page: "home" })}
                className="size-4.5"
              />
            </button>
            <span
              className={`pl-1 text-sm
              ${"text-neutral-500"}
            `}
            >
              {"Untitled"}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
