"use client";

import { experiences } from "@/lib/data/experience";
import { skillCategories } from "@/lib/data/skills";
import { aboutMe } from "@/lib/data/social-links";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Code } from "lucide-react";

export function ResumeApp() {
  return (
    <div
      id="resume-panel"
      role="tabpanel"
      aria-labelledby="resume-tab"
      className="h-full overflow-y-auto p-5 scrollbar-thin sm:p-8 md:p-12"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 grid gap-8 border-b border-border pb-10 md:grid-cols-[1fr_20rem] md:items-end">
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              03 / Experience & capability
            </p>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.82] tracking-[-0.07em] text-foreground">
              {aboutMe.name}<span className="text-primary">.</span>
            </h1>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-lg font-semibold text-foreground">{aboutMe.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{aboutMe.location}</p>
          </div>
        </div>

        <p className="mb-10 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {aboutMe.bio}
        </p>

        <Separator className="bg-border mb-6" />

        {/* Experience */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="size-4 text-primary" aria-hidden="true" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
              Experience
            </h2>
          </div>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id} className="grid gap-3 border-t border-border pt-5 md:grid-cols-[10rem_1fr]">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                  {exp.period}
                </span>
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-foreground">
                        {exp.role}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {exp.company}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-xs text-muted-foreground"
                      >
                        <span className="mt-0.5 text-primary/60">•</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border mb-6" />

        {/* Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code className="size-4 text-primary" aria-hidden="true" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
              Capabilities
            </h2>
          </div>
          <div className="space-y-3">
            {skillCategories.map((cat) => (
              <div key={cat.category}>
                <p className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider mb-1.5">
                  {cat.category}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="rounded-none border border-border bg-transparent px-2.5 py-1 text-[9px] uppercase tracking-wider text-muted-foreground"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
