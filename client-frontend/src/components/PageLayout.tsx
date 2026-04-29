import { ReactNode } from "react";
import { SiteShell } from "./SiteShell";
import { Icon } from "./Icon";
import { ScrollReveal } from "./ScrollReveal";

interface PageLayoutProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
}

export const PageLayout = ({ eyebrow, title, subtitle, icon, children }: PageLayoutProps) => (
  <SiteShell>
    <section className="relative pt-32 pb-16 bg-surface-container-low overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-fixed opacity-20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-fixed opacity-15 rounded-full blur-[100px] pointer-events-none" />
      <ScrollReveal variant="fade-up" duration={0.9} className="max-w-4xl mx-auto px-6 relative">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 bg-secondary-container px-4 py-1.5 rounded-full mb-6">
            {icon && <Icon name={icon} className="text-on-secondary-container text-base" />}
            <span className="text-on-secondary-container text-xs font-bold tracking-wider uppercase">{eyebrow}</span>
          </div>
        )}
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-on-background">{title}</h1>
        {subtitle && <p className="text-lg text-outline max-w-2xl leading-relaxed">{subtitle}</p>}
      </ScrollReveal>
    </section>
    <section className="py-16 bg-surface">
      <ScrollReveal variant="fade-up" duration={0.88} delay={0.06} className="max-w-4xl mx-auto px-6 prose prose-lg max-w-none">
        {children}
      </ScrollReveal>
    </section>
  </SiteShell>
);

export const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <ScrollReveal as="div" variant="fade-up" duration={0.82} className="mb-12">
    <h2 className="font-headline text-2xl md:text-3xl font-extrabold mb-4 text-on-background flex items-center gap-3">
      <span className="w-1.5 h-7 bg-primary rounded-full" /> {title}
    </h2>
    <div className="text-on-surface-variant leading-relaxed space-y-3 pl-5">{children}</div>
  </ScrollReveal>
);