import { SidebarIcon, SquarePen } from "lucide-react";
import { constants } from "../constants";
import { Pages } from "../types";

const Navbar = ({
  handleSidebar,
  isSidebar,
  page,
  handlePage,
  width,
}: {
  handleSidebar: () => void;
  isSidebar: boolean;
  page: Pages;
  handlePage: ({ name, id }: { name: Pages; id: string | null }) => void;
  width: number;
}) => {
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
        className={`flex items-center gap-1 px-1.5 ${isSidebar ? "justify-end" : "justify-start"}`}
        style={
          isSidebar
            ? { width: `${width - trafficLightOffset}px` }
            : { width: "100%" }
        }
      >
        <button
          onClick={handleSidebar}
          className="p-1.5 rounded-full hover:bg-neutral-200/60 transition-colors"
        >
          <SidebarIcon className="size-4.5" />
        </button>
        {!isSidebar && page !== "home" && (
          <>
            <button className="p-1.5 rounded-full hover:bg-neutral-200/60 transition-colors">
              <SquarePen
                onClick={() => handlePage({ name: "home", id: null })}
                className="size-4.5"
              />
            </button>
            <span className="pl-1 text-neutral-500">Untitled</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
