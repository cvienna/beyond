import React, { forwardRef } from "react";

const Menu = forwardRef<
  HTMLDivElement,
  {
    alignment: "top" | "bottom"; // left, right
    offset: "start" | "end"; // center
    groups: React.ReactElement<{ children: React.ReactNode }>[];
  }
>(({ alignment, offset, groups }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute z-100 flex flex-col gap-1 p-2 w-48 rounded-3xl bg-light-surface border border-light-border
        ${alignment === "top" && "-translate-y-full -top-2"}
        ${alignment === "bottom" && "translate-y-full -bottom-2"}
        ${offset === "start" && "left-0"}
        ${offset === "end" && "right-0"}
      `}
    >
      {groups.map((group, i, arr) => (
        <React.Fragment key={i}>
          {group}
          {i !== arr.length - 1 && (
            <div className="h-px w-full bg-light-border" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

export default Menu;
