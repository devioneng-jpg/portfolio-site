"use client";

import { useTabStore } from "@/stores/tab-store";
import { NavBar } from "./nav-bar";
import { ChatApp } from "@/components/apps/chat/chat-app";
import { ResumeApp } from "@/components/apps/resume/resume-app";
import { ContactApp } from "@/components/apps/contact/contact-app";
import { ProjectsApp } from "@/components/apps/projects/projects-app";

const tabContent = {
  chat: ChatApp,
  projects: ProjectsApp,
  resume: ResumeApp,
  contact: ContactApp,
} as const;

export function Shell() {
  const activeTab = useTabStore((s) => s.activeTab);
  const Content = tabContent[activeTab];

  return (
    <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col px-2 pb-2 sm:px-4 sm:pb-4">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-card px-4 py-2 text-sm text-foreground ring-1 ring-border focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>
      <NavBar />
      <main
        id="main-content"
        className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/70 bg-background/80 shadow-2xl shadow-black/30"
        tabIndex={-1}
      >
        <Content />
      </main>
    </div>
  );
}
