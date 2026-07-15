"use client";

import { projects } from "@/lib/data/projects";
import { ProjectCard } from "./project-card";

export function ProjectsApp() {
  return (
    <div
      id="projects-panel"
      role="tabpanel"
      aria-labelledby="projects-tab"
      className="h-full overflow-y-auto p-4 scrollbar-thin sm:p-8 md:p-12"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_18rem] lg:items-end">
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              02 / Selected case studies
            </p>
            <h1 className="max-w-5xl text-[clamp(2.5rem,6vw,5.75rem)] font-bold leading-[0.9] tracking-[-0.06em] text-foreground">
              From customer problem to production path
              <span className="text-primary">.</span>
            </h1>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              These case studies show how I translate ambiguous business needs
              into demonstrable AI systems with a credible path beyond the
              prototype.
            </p>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">
              {projects.length.toString().padStart(2, "0")} systems / AI +
              automation
            </p>
          </div>
        </header>
        <div className="grid grid-cols-1 gap-px border border-border bg-border">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
