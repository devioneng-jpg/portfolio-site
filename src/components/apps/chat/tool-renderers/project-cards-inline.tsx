"use client";

import type { Project } from "@/lib/data/projects";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code } from "lucide-react";

interface ProjectCardsInlineProps {
  projects: Project[];
}

export function ProjectCardsInline({ projects }: ProjectCardsInlineProps) {
  return (
    <div
      className="flex max-w-full gap-2 overflow-x-auto pb-2 scrollbar-thin"
      aria-label="Project previews"
    >
      {projects.map((project) => (
        <div
          key={project.id}
          className="w-60 shrink-0 border border-border bg-card p-4"
        >
          <h4 className="mb-1 text-sm font-bold tracking-tight text-foreground">
            {project.title}
          </h4>
          <p className="text-[10px] text-muted-foreground mb-2 line-clamp-3">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {project.tech.slice(0, 3).map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="rounded-none border border-border bg-transparent px-1.5 py-0 text-[9px] uppercase tracking-wide text-muted-foreground"
              >
                {t}
              </Badge>
            ))}
          </div>
          <div className="flex gap-1.5">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} source code`}
                className="inline-flex size-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Code className="size-3.5" aria-hidden="true" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} live demo`}
                className="inline-flex size-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
