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
      className="h-full overflow-y-auto p-5 scrollbar-thin sm:p-8 md:p-12"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_20rem] lg:items-end">
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              04 / Start a conversation
            </p>
            <h1 className="max-w-5xl text-[clamp(3rem,8vw,7.5rem)] font-bold leading-[0.84] tracking-[-0.07em] text-foreground">
              Let&apos;s build what&apos;s next
              <span className="text-primary">.</span>
            </h1>
          </div>
          <div className="border-t border-border pt-5">
            <p className="text-lg font-semibold text-foreground">{aboutMe.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{aboutMe.title}</p>
            <div className="mt-3 flex items-center gap-1.5">
              <MapPin
                className="size-3 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-xs text-muted-foreground">
                {aboutMe.location}
              </span>
            </div>
          </div>
        </header>

        <div className="grid border border-border md:grid-cols-2">
          {socialLinks.map((link, index) => {
            const Icon = iconMap[link.icon] ?? ExternalLink;
            const isBookingLink = link.icon === "calendar";

            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex min-h-40 min-w-0 items-end gap-4 border-b border-border p-5 transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:border-r md:p-6 md:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-child(2n)]:border-r-0 ${
                  isBookingLink
                    ? "bg-primary text-primary-foreground hover:bg-foreground"
                    : "bg-card hover:bg-foreground"
                }`}
              >
                <span
                  className={`self-start text-[10px] font-bold tracking-[0.18em] ${
                    isBookingLink
                      ? "text-primary-foreground/60 group-hover:text-primary"
                      : "text-primary"
                  }`}
                >
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div
                  className={`flex size-10 items-center justify-center border ${
                    isBookingLink
                      ? "border-primary-foreground/30 group-hover:border-background/30"
                      : "border-border group-hover:border-background/30"
                  }`}
                >
                  <Icon
                    className={`size-4 ${
                      isBookingLink
                        ? "text-primary-foreground group-hover:text-primary"
                        : "text-primary"
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  {isBookingLink && (
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-primary-foreground/65 group-hover:text-background/60">
                      Preferred next step
                    </p>
                  )}
                  <p
                    className={`text-xl font-bold tracking-tight group-hover:text-background ${
                      isBookingLink
                        ? "text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {isBookingLink ? "Book a conversation" : link.label}
                  </p>
                  <p
                    className={`mt-1 break-all text-[10px] group-hover:text-background/60 ${
                      isBookingLink
                        ? "text-primary-foreground/65"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isBookingLink
                      ? "Choose a time on Cal.com"
                      : link.url.replace(/^(mailto:|https?:\/\/)/, "")}
                  </p>
                </div>
                <ExternalLink
                  className={`size-4 ${
                    isBookingLink
                      ? "text-primary-foreground group-hover:text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  }`}
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
