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
          className="bg-card rounded-lg p-3 border border-border"
        >
          <div className="flex items-start justify-between mb-1">
            <div>
              <h4 className="text-xs font-semibold text-foreground/90">
                {exp.role}
              </h4>
              <p className="text-[10px] text-muted-foreground">{exp.company}</p>
            </div>
            <span className="text-[10px] text-muted-foreground/70">{exp.period}</span>
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
