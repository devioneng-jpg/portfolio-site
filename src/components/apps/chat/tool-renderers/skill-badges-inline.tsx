"use client";

import type { SkillCategory } from "@/lib/data/skills";
import { Badge } from "@/components/ui/badge";

interface SkillBadgesInlineProps {
  categories: SkillCategory[];
}

export function SkillBadgesInline({ categories }: SkillBadgesInlineProps) {
  return (
    <div className="space-y-2">
      {categories.map((cat) => (
        <div key={cat.category}>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {cat.category}
          </p>
          <div className="flex flex-wrap gap-1">
            {cat.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="rounded-none border border-border bg-transparent px-2 py-0.5 text-[9px] uppercase tracking-wide text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
