interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}

/** Material Symbols Outlined icon. */
export const Icon = ({ name, className = "", filled, style }: IconProps) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{
      fontVariationSettings: filled ? "'FILL' 1" : undefined,
      ...style,
    }}
    aria-hidden="true"
  >
    {name}
  </span>
);
