"use client";

import { socialLinks, aboutMe } from "@/lib/data/social-links";
import { Code, Briefcase, AtSign, Mail, MapPin, ExternalLink } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Code,
  linkedin: Briefcase,
  twitter: AtSign,
  mail: Mail,
};

export function ContactApp() {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-10 scrollbar-thin">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👋</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">{aboutMe.name}</h2>
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
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-4 h-4 text-primary/70" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {link.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {link.url.replace(/^(mailto:|https?:\/\/)/, "")}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary/50 transition-colors" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
