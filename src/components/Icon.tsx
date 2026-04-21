import { forwardRef } from "react";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}

/** Material Symbols Outlined icon. */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ name, className = "", filled, style }, ref) => (
    <span
      ref={ref}
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : undefined,
        ...style,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  ),
);
Icon.displayName = "Icon";
