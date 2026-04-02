"use client";

import { projects } from "@/lib/data/projects";
import { ProjectCard } from "./project-card";

export function ProjectsApp() {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 scrollbar-thin">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-foreground mb-1">Projects</h2>
        <p className="text-sm text-muted-foreground mb-6">
          A collection of things I&apos;ve built
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
