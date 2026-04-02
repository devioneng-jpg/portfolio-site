"use client";

import { useTabStore } from "@/stores/tab-store";
import { NavBar } from "./nav-bar";
import { ChatApp } from "@/components/apps/chat/chat-app";
import { ProjectsApp } from "@/components/apps/projects/projects-app";
import { ResumeApp } from "@/components/apps/resume/resume-app";
import { ContactApp } from "@/components/apps/contact/contact-app";

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
    <div className="flex flex-col h-full">
      <NavBar />
      <main className="flex-1 overflow-hidden">
        <Content />
      </main>
    </div>
  );
}
