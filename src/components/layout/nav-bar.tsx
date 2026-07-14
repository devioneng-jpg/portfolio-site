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
    <nav className="sticky top-0 z-50 flex min-h-16 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-3 backdrop-blur-xl sm:px-5">
      <span className="min-w-0 truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
        Devion&apos;s <span className="gradient-text">AI Twin</span>
      </span>

      <div
        role="tablist"
        aria-label="Portfolio sections"
        className="flex items-center gap-0.5 rounded-xl border border-border/70 bg-card/80 p-1"
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
            className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 ${
              activeTab === id
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
