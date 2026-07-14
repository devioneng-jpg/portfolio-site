"use client";

import { socialLinks, aboutMe } from "@/lib/data/social-links";
import {
  Code,
  Briefcase,
  Mail,
  MapPin,
  ExternalLink,
  Calendar,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  github: Code,
  linkedin: Briefcase,
  mail: Mail,
  calendar: Calendar,
};

export function ContactApp() {
  return (
    <div
      id="contact-panel"
      role="tabpanel"
      aria-labelledby="contact-tab"
      className="h-full overflow-y-auto p-6 md:p-10 scrollbar-thin"
    >
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="gradient-surface mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-card">
            <span className="gradient-text text-lg font-semibold" aria-hidden="true">
              DT
            </span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {aboutMe.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{aboutMe.title}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{aboutMe.location}</span>
          </div>
        </div>

        <div className="space-y-2">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.icon] ?? ExternalLink;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-border/80 bg-card/80 p-3 transition-[border-color,transform] hover:translate-x-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-4 h-4 text-primary/70" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {link.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {link.url.replace(/^(mailto:|https?:\/\/)/, "")}
                  </p>
                </div>
                <ExternalLink
                  className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary/50 transition-colors"
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
