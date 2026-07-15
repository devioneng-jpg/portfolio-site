"use client";

import type { Experience } from "@/lib/data/experience";

interface ExperienceInlineProps {
  experiences: Experience[];
}

export function ExperienceInline({ experiences }: ExperienceInlineProps) {
  return (
    <div className="space-y-3">
      {experiences.map((exp) => (
        <div
          key={exp.id}
          className="border border-border bg-card p-4"
        >
          <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="text-sm font-bold tracking-tight text-foreground">
                {exp.role}
              </h4>
              <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                {exp.company}
              </p>
            </div>
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.1em] text-primary">
              {exp.period}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mb-1.5">
            {exp.description}
          </p>
          <ul className="space-y-0.5">
            {exp.highlights.slice(0, 2).map((h, i) => (
              <li
                key={i}
                className="text-[10px] text-muted-foreground flex items-start gap-1"
              >
                <span className="text-primary/40 mt-0.5">•</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
