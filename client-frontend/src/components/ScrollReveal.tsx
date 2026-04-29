import { Children, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/** Premium ease-out — slow start, confident finish (no bounce). */
const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1];

export type ScrollRevealVariant = "fade-up" | "fade-down" | "fade" | "fade-left" | "fade-right" | "zoom";

const DIST = 40;

function buildVariants(variant: ScrollRevealVariant): Variants {
  switch (variant) {
    case "fade-down":
      return {
        hidden: { opacity: 0, y: -DIST },
        visible: { opacity: 1, y: 0 },
      };
    case "fade-left":
      return {
        hidden: { opacity: 0, x: DIST },
        visible: { opacity: 1, x: 0 },
      };
    case "fade-right":
      return {
        hidden: { opacity: 0, x: -DIST },
        visible: { opacity: 1, x: 0 },
      };
    case "zoom":
      return {
        hidden: { opacity: 0, scale: 0.94 },
        visible: { opacity: 1, scale: 1 },
      };
    case "fade":
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
    case "fade-up":
    default:
      return {
        hidden: { opacity: 0, y: DIST },
        visible: { opacity: 1, y: 0 },
      };
  }
}

/** Staggered lists / grids — parent variants */
export const revealContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.06,
    },
  },
};

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.82,
      ease: easeLuxury,
    },
  },
};

export type ScrollRevealProps<T extends ElementType = "div"> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  variant?: ScrollRevealVariant;
  /** Seconds — applied after intersection triggers */
  delay?: number;
  duration?: number;
  once?: boolean;
  /** Portion of element that must be visible (0–1) */
  amount?: number | "some" | "all";
  /** Extra viewport margin so reveals trigger slightly before entering frame */
  margin?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "initial" | "animate" | "variants">;

/**
 * Smooth scroll-into-view reveal. Respects `prefers-reduced-motion`.
 */
export function ScrollReveal<T extends ElementType = "div">({
  as,
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 0.88,
  once = true,
  amount = 0.12,
  margin = "0px 0px -12% 0px",
  ...rest
}: ScrollRevealProps<T>) {
  const prefersReducedMotion = useReducedMotion();
  const Component = (as || "div") as ElementType;
  const MotionComponent = motion(Component as keyof JSX.IntrinsicElements) as typeof motion.div;

  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin }}
      variants={buildVariants(variant)}
      transition={{
        duration,
        delay,
        ease: easeLuxury,
      }}
      {...(rest as object)}
    >
      {children}
    </MotionComponent>
  );
}

type ScrollRevealListProps = {
  children: ReactNode;
  className?: string;
  /** Delay between each child (seconds) */
  stagger?: number;
  variant?: ScrollRevealVariant;
};

/**
 * Wraps each direct child in its own ScrollReveal with incremental delay (no staggerChildren nesting issues).
 */
export function ScrollRevealList({ children, className, stagger = 0.055, variant = "fade-up" }: ScrollRevealListProps) {
  const items = Children.toArray(children);
  return (
    <div className={className}>
      {items.map((child, i) => (
        <ScrollReveal key={i} delay={i * stagger} variant={variant}>
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
