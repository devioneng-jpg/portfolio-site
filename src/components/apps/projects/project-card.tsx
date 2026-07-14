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
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group rounded-2xl border border-border/80 bg-card/80 p-5 shadow-lg shadow-black/10 transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/5 md:p-7">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {project.title}
              </h3>
              {project.featured && (
                <Badge
                  variant="secondary"
                  className="gap-1 border-0 bg-primary/10 text-[10px] text-primary"
                >
                  <Sparkles className="size-3" aria-hidden="true" />
                  Featured
                </Badge>
              )}
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                {project.status}
              </Badge>
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
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              <Code className="size-4" aria-hidden="true" />
              View source
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </header>

        <div className="grid gap-3 md:grid-cols-3">
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

        <div className="grid gap-5 border-t border-border pt-5 lg:grid-cols-2">
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
              className="border-0 bg-primary/10 px-2.5 py-0.5 text-xs text-primary/80"
            >
              {technology}
            </Badge>
          ))}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-xs text-primary hover:underline"
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
    <section className="rounded-xl border border-border/60 bg-muted/35 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground">
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
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/80">
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
