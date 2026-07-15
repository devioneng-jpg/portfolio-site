"use client";

import type { Project } from "@/lib/data/projects";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code,
  Layers3,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="group bg-background p-5 transition-colors hover:bg-card md:p-8">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              {(index + 1).toString().padStart(2, "0")} / {project.status}
            </p>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold leading-none tracking-[-0.04em] text-foreground transition-colors group-hover:text-primary sm:text-4xl">
                {project.title}
              </h2>
              {project.featured && (
                <Badge
                  variant="secondary"
                  className="gap-1 rounded-none border border-primary bg-transparent text-[9px] uppercase tracking-wider text-primary"
                >
                  <Sparkles className="size-3" aria-hidden="true" />
                  Featured
                </Badge>
              )}
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 border border-border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Code className="size-4" aria-hidden="true" />
              View source
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </header>

        <div className="grid border border-border md:grid-cols-3">
          <CaseStudySection
            icon={BriefcaseBusiness}
            title="Customer problem"
            content={project.problem}
          />
          <CaseStudySection
            icon={Layers3}
            title="Solution"
            content={project.solution}
          />
          <CaseStudySection
            icon={ShieldCheck}
            title="Business value"
            content={project.businessValue}
          />
        </div>

        <div className="grid gap-8 border-t border-border pt-6 lg:grid-cols-2">
          <DetailList title="Architecture" items={project.architecture} />
          <DetailList
            title="Production considerations"
            items={project.productionConsiderations}
          />
        </div>

        <footer className="flex flex-wrap gap-1.5">
          {project.tech.map((technology) => (
            <Badge
              key={technology}
              variant="secondary"
              className="rounded-none border border-border bg-transparent px-2.5 py-1 text-[9px] uppercase tracking-wider text-muted-foreground"
            >
              {technology}
            </Badge>
          ))}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 border border-primary px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Open live demo
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </footer>
      </div>
    </article>
  );
}

function CaseStudySection({
  icon: Icon,
  title,
  content,
}: {
  icon: LucideIcon;
  title: string;
  content: string;
}) {
  return (
    <section className="border-b border-border bg-card p-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 md:p-5">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground">
        <Icon className="size-4 text-primary" aria-hidden={true} />
        {title}
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{content}</p>
    </section>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground">
        {title}
      </h4>
      <ul className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
