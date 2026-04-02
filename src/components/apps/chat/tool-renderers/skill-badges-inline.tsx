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
                className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary/70 border-0 hover:bg-primary/15 transition-colors"
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
