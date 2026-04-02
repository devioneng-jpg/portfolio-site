"use client";

import type { Project } from "@/lib/data/projects";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code, Star } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors group">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        {project.featured && <Star className="w-3.5 h-3.5 text-primary/60" />}
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.tech.map((t) => (
          <Badge
            key={t}
            variant="secondary"
            className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary/70 border-0"
          >
            {t}
          </Badge>
        ))}
      </div>

      <div className="flex gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            Code
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live
          </a>
        )}
      </div>
    </div>
  );
}
