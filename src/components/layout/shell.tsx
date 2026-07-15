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
    <div className="mx-auto flex h-full w-full max-w-[1600px] min-w-0 flex-col px-3 pb-3 sm:px-6 sm:pb-6">
      <a
        href="#main-content"
        className="sr-only z-[100] bg-foreground px-4 py-2 text-sm font-semibold text-background focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>
      <NavBar />
      <main
        id="main-content"
        className="min-h-0 min-w-0 flex-1 overflow-hidden border border-border bg-background"
        tabIndex={-1}
      >
        <Content />
      </main>
    </div>
  );
}
