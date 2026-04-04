import { useState } from "react";
import { SidebarIcon } from "lucide-react";

const Navbar = ({
  handleSidebar,
  isSidebar,
  width,
}: {
  handleSidebar: () => void;
  isSidebar: boolean;
  width: number;
}) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 flex items-center"
      id="navbar"
      style={{ height: `${16 * 2 + 14}px` }}
    >
      <div
        className={`flex ${isSidebar ? "justify-end" : "justify-start"}`}
        style={{ width: `${width}px` }}
      >
        <button
          onClick={handleSidebar}
          className="p-1.5 rounded-full hover:bg-neutral-200/60 transition-colors"
        >
          <SidebarIcon className="size-4.5" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
