import Tooltip from "../Tooltip";

const SmallButton = ({
  icon,
  label,
  onClick,
  className,
  disabled = false,
}: {
  icon: React.ReactNode;
  label?:
    | { content: string; tooltip: false }
    | {
        content: string;
        tooltip: true;
        position: "top" | "bottom" | "left" | "right";
      };
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      className={`flex gap-2 items-center px-1.5 h-7.5 rounded-button select-none cursor-pointer transition-colors
        ${label?.tooltip && "relative group/tooltip"}
        ${className}
      `}
      onClick={(e) => {
        onClick(e);
      }}
    >
      {icon}
      {label && !label.tooltip && (
        <span className="pr-1.5 text-sm text-text-secondary group-hover/text-hover:text-text-primary">
          {label.content}
        </span>
      )}
      {label && label.tooltip && (
        <Tooltip label={label.content} position={label.position} />
      )}
    </button>
  );
};

export default SmallButton;
