const Tooltip = ({
  label,
  position,
}: {
  label: string;
  position: "top" | "bottom" | "left" | "right";
}) => {
  return (
    <div
      className={`absolute px-2.5 py-1.25 bg-neutral-900 rounded-xl cursor-default
        ${position === "top" && "-top-2 -translate-y-full left-1/2 -translate-x-1/2"}
        ${position === "bottom" && "-bottom-2 translate-y-full left-1/2 -translate-x-1/2"}
        ${position === "left" && "top-1/2 -translate-y-1/2 -left-2 -translate-x-full"}
        ${position === "right" && "top-1/2 -translate-y-1/2 -right-2 translate-x-full"}
      `}
    >
      {/* TODO: Not entirely happy with left & right */}
      <div
        className={`absolute size-4 bg-neutral-900 rounded-sm rotate-45
          ${position === "top" && "-bottom-0.75 left-1/2 -translate-x-1/2"}
          ${position === "bottom" && "-top-0.75 left-1/2 -translate-x-1/2"}
          ${position === "left" && "top-1/2 -translate-y-1/2 -right-0.75"}
          ${position === "right" && "top-1/2 -translate-y-1/2 -left-0.75"}
        `}
      />
      <span className="relative flex text-sm text-white select-none">
        {label}
      </span>
    </div>
  );
};

export default Tooltip;
