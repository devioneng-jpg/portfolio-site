"use client";

import type { Project } from "@/lib/data/projects";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code, Star } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-colors group">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            {project.featured && <Star className="w-4 h-4 text-primary/60 shrink-0" />}
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {project.longDescription || project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="text-xs px-2.5 py-0.5 bg-primary/10 text-primary/70 border-0"
              >
                {t}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex sm:flex-col gap-3 sm:items-end shrink-0">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Code className="w-4 h-4" />
              Code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
