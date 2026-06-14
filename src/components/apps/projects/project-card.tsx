"use client";

import type { Project } from "@/lib/data/projects";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code, Star } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="w-full bg-card rounded-xl p-6 md:p-8 border border-border hover:border-primary/30 transition-colors group">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.featured && <Star className="w-4 h-4 text-primary/60" />}
        </div>

        <div className="flex shrink-0 gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
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
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Live
            </a>
          )}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground mb-4 max-w-3xl">
        {project.longDescription ?? project.description}
      </p>

      {project.benefit && (
        <div className="mb-4 rounded-lg border-l-2 border-primary/40 bg-primary/5 px-4 py-3 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/70 mb-1">
            Impact
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            {project.benefit}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
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
  );
}
