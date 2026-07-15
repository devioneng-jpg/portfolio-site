"use client";

import { useTabStore, type TabId } from "@/stores/tab-store";
import {
  MessageSquare,
  FolderKanban,
  FileText,
  Mail,
  type LucideIcon,
} from "lucide-react";

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "contact", label: "Contact", icon: Mail },
];

export function NavBar() {
  const activeTab = useTabStore((s) => s.activeTab);
  const setActiveTab = useTabStore((s) => s.setActiveTab);

  return (
    <nav className="sticky top-0 z-50 flex min-h-20 min-w-0 items-center justify-between gap-3 border-b border-border bg-background/95 px-1 sm:min-h-24 sm:gap-4">
      <div className="min-w-0">
        <span className="block truncate text-base font-bold uppercase tracking-[-0.04em] text-foreground sm:text-xl">
          Devion Tharpe<span className="text-primary">.</span>
        </span>
        <span className="hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block">
          Solutions engineer / AI systems
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Portfolio sections"
        className="flex shrink-0 items-center border border-border bg-card"
      >
        {tabs.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            id={`${id}-tab`}
            role="tab"
            type="button"
            aria-selected={activeTab === id}
            aria-controls={`${id}-panel`}
            tabIndex={activeTab === id ? 0 : -1}
            onClick={() => setActiveTab(id)}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
                return;
              }
              event.preventDefault();
              const nextIndex =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? tabs.length - 1
                    : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
                      tabs.length;
              const nextTab = tabs[nextIndex];
              setActiveTab(nextTab.id);
              document.getElementById(`${nextTab.id}-tab`)?.focus();
            }}
            aria-label={label}
            className={`flex h-9 items-center gap-1.5 border-r border-border px-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors last:border-r-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-10 sm:px-4 ${
              activeTab === id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
