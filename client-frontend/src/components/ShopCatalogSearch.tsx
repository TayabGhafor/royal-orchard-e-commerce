import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import type { Product } from "@/data/products";

const MAX_SUGGESTIONS = 8;
const MAX_QUERY = 80;

type ShopVariety = "All" | "Sindhri" | "Chaunsa" | "Anwar Ratol" | "Langra";

type Props = {
  value: string;
  onChange: (value: string) => void;
  items: Product[];
  variety: ShopVariety;
  /** For associating the sidebar label with the input (accessibility). */
  inputId?: string;
};

function scoreMatch(p: Product, q: string): number {
  const ql = q.trim().toLowerCase();
  if (!ql) return 0;
  const name = p.name.toLowerCase();
  const variety = p.variety.toLowerCase();
  const tag = p.tagline.toLowerCase();
  const coll = p.collection.toLowerCase();
  if (name === ql) return 1000;
  if (name.startsWith(ql)) return 500;
  if (name.split(/\s+/).some((w) => w.startsWith(ql))) return 450;
  if (name.includes(ql)) return 300;
  if (variety === ql) return 280;
  if (variety.startsWith(ql)) return 240;
  if (variety.includes(ql)) return 200;
  if (tag.includes(ql)) return 120;
  if (coll.includes(ql)) return 100;
  return 0;
}

function baseFilter(items: Product[], variety: ShopVariety): Product[] {
  return items.filter((p) => variety === "All" || p.variety === variety);
}

export function ShopCatalogSearch({ value, onChange, items, variety, inputId: inputIdProp }: Props) {
  const genId = useId();
  const id = inputIdProp ?? genId;
  const listId = `${id}-listbox`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [highlight, setHighlight] = useState(0);
  const [focused, setFocused] = useState(false);

  const pool = useMemo(() => baseFilter(items, variety), [items, variety]);

  const suggestions = useMemo(() => {
    const q = value.trim();
    if (!q) return [];
    const scored = pool
      .map((p) => ({ p, s: scoreMatch(p, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.p.name.localeCompare(b.p.name));
    return scored.slice(0, MAX_SUGGESTIONS).map((x) => x.p);
  }, [pool, value]);

  const showPanel = focused && value.trim().length > 0;

  useEffect(() => {
    setHighlight(0);
  }, [value, variety]);

  useEffect(() => {
    if (!showPanel) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [showPanel]);

  const applySuggestion = useCallback(
    (p: Product) => {
      onChange(p.name);
      setFocused(false);
      inputRef.current?.blur();
    },
    [onChange],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showPanel || suggestions.length === 0) {
      if (e.key === "Escape") {
        onChange("");
        inputRef.current?.blur();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      applySuggestion(suggestions[highlight]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      inputRef.current?.blur();
      setFocused(false);
    }
  };

  const hasQuery = value.trim().length > 0;
  const showEmpty = showPanel && hasQuery && suggestions.length === 0;

  return (
    <div ref={wrapperRef} className="relative z-20">
      <div
        className={[
          "group relative rounded-full transition-all duration-300 ease-out",
          "border border-transparent",
          "hover:border-primary/25 hover:shadow-md hover:shadow-primary/5 hover:scale-[1.005]",
          "focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/45 focus-within:shadow-lg focus-within:shadow-primary/10 focus-within:scale-[1.01]",
        ].join(" ")}
      >
        <Icon
          name="search"
          className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-base pointer-events-none text-on-surface-variant transition-all duration-300 group-hover:text-primary/80 group-hover:scale-105 group-focus-within:text-primary group-focus-within:scale-110"
        />
        <input
          ref={inputRef}
          id={inputIdProp ? inputIdProp : `${id}-search`}
          type="search"
          role="combobox"
          aria-expanded={showPanel && (suggestions.length > 0 || showEmpty)}
          aria-controls={listId}
          aria-activedescendant={
            showPanel && suggestions.length > 0 ? `${listId}-opt-${highlight}` : undefined
          }
          aria-autocomplete="list"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_QUERY))}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            // Delay so mousedown on suggestion still fires
            window.setTimeout(() => {
              if (!wrapperRef.current?.contains(document.activeElement)) {
                setFocused(false);
              }
            }, 0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Find a mango…"
          className="w-full rounded-full bg-surface-container-low pl-10 pr-9 py-2.5 text-sm outline-none text-on-surface placeholder:text-on-surface-variant transition-[background-color,box-shadow] duration-300 focus:bg-surface-container-high"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-on-surface-variant transition-transform duration-200 hover:scale-110 hover:text-on-surface"
            aria-label="Clear search"
          >
            <Icon name="close" className="text-base" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showPanel && (suggestions.length > 0 || showEmpty) && (
          <motion.div
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest shadow-xl shadow-primary/5"
          >
            {suggestions.length > 0 ? (
              <ul className="max-h-72 overflow-y-auto py-1.5">
                {suggestions.map((p, i) => {
                  const active = i === highlight;
                  return (
                    <li key={p.id} role="presentation">
                      <div
                        className={[
                          "flex w-full items-stretch gap-1 text-sm transition-colors duration-200",
                          active ? "bg-primary/10" : "hover:bg-surface-container-high",
                        ].join(" ")}
                      >
                        <button
                          type="button"
                          id={`${listId}-opt-${i}`}
                          role="option"
                          aria-selected={active}
                          onMouseEnter={() => setHighlight(i)}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => applySuggestion(p)}
                          className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left text-on-surface"
                        >
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                            <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">{p.name}</p>
                            <p className="truncate text-xs text-on-surface-variant">
                              {p.variety} · {p.collection}
                            </p>
                          </div>
                        </button>
                        <Link
                          to={`/product/${p.slug}`}
                          onMouseEnter={() => setHighlight(i)}
                          className="flex shrink-0 items-center px-2 text-on-surface-variant transition-all duration-200 hover:text-primary"
                          aria-label={`Open ${p.name}`}
                        >
                          <Icon name="arrow_forward" className="text-base transition-transform duration-200 hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
                No mangoes match &ldquo;{value.trim()}&rdquo; with current filters. Try another term or choose All
                varieties.
              </div>
            )}
            {suggestions.length > 0 && (
              <div className="border-t border-outline-variant/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-outline">
                Results refine live · ↑↓ Enter · Esc to close
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
