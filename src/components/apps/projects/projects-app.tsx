"use client";

import { projects } from "@/lib/data/projects";
import { ProjectCard } from "./project-card";

export function ProjectsApp() {
  return (
    <div
      id="projects-panel"
      role="tabpanel"
      aria-labelledby="projects-tab"
      className="h-full overflow-y-auto p-4 scrollbar-thin sm:p-6 md:p-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="gradient-text mb-2 w-fit text-xs font-semibold uppercase tracking-[0.2em]">
            Solutions engineering in practice
          </p>
          <h1 className="mb-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            From customer problem to production path
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            These case studies show how I translate ambiguous business needs into
            demonstrable AI systems, explain the architecture, and plan for the
            controls required beyond a prototype.
        </p>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
