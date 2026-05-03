"use client";

import { useTabStore, type TabId } from "@/stores/tab-store";
import { MessageSquare, FolderOpen, FileText, Mail } from "lucide-react";

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "contact", label: "Contact", icon: Mail },
];

export function NavBar() {
  const activeTab = useTabStore((s) => s.activeTab);
  const setActiveTab = useTabStore((s) => s.setActiveTab);

  return (
    <nav className="glass sticky top-0 z-50 flex items-center justify-between px-6 py-3 rounded-none border-x-0 border-t-0">
      <span className="text-sm font-semibold tracking-tight text-foreground">
        Devion&apos;s AI Twin
      </span>

      <div className="flex items-center gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === id
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
