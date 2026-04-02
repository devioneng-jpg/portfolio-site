"use client";

import { experiences } from "@/lib/data/experience";
import { skillCategories } from "@/lib/data/skills";
import { aboutMe } from "@/lib/data/social-links";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Code, Download } from "lucide-react";

export function ResumeApp() {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 scrollbar-thin">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{aboutMe.name}</h2>
            <p className="text-sm text-muted-foreground">{aboutMe.title}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{aboutMe.location}</p>
          </div>
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors bg-card px-3 py-1.5 rounded-lg border border-border hover:border-primary/30"
          >
            <Download className="w-3 h-3" />
            PDF
          </a>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {aboutMe.bio}
        </p>

        <Separator className="bg-border mb-6" />

        {/* Experience */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-primary/60" />
            <h3 className="text-sm font-semibold text-foreground">Experience</h3>
          </div>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-primary/20 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {exp.role}
                    </h4>
                    <p className="text-xs text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground/70 shrink-0">
                    {exp.period}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="text-xs text-muted-foreground flex items-start gap-1.5"
                    >
                      <span className="text-primary/40 mt-0.5">•</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border mb-6" />

        {/* Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-4 h-4 text-primary/60" />
            <h3 className="text-sm font-semibold text-foreground">Skills</h3>
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
                      className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary/70 border-0"
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
