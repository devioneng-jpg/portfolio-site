"use client";

import type { Project } from "@/lib/data/projects";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code } from "lucide-react";

interface ProjectCardsInlineProps {
  projects: Project[];
}

export function ProjectCardsInline({ projects }: ProjectCardsInlineProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {projects.map((project) => (
        <div
          key={project.id}
          className="min-w-[200px] max-w-[220px] bg-card rounded-lg p-3 border border-border shrink-0"
        >
          <h4 className="text-xs font-semibold text-foreground/90 mb-1">
            {project.title}
          </h4>
          <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {project.tech.slice(0, 3).map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary/60 border-0"
              >
                {t}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Code className="w-3 h-3" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
