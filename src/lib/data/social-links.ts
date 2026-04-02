export interface SocialLink {
  label: string;
  url: string;
  icon: string; // lucide icon name
}

export const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    url: "https://linkedin.com/in/devion-tharpe",
    icon: "linkedin",
  },
  {
    label: "Email",
    url: "mailto:tharpedevion@gmail.com",
    icon: "mail",
  },
];

export const aboutMe = {
  name: "Devion Tharpe",
  title: "Solutions Engineer",
  bio: "Accomplished Solutions Engineer with over 6 years of experience bridging the technical and business worlds to evangelize products and drive strategic deals. Proven record of delivering compelling product demos, navigating complex sales cycles with diverse stakeholders, and providing consultative support to close key and strategic accounts. Deeply passionate about the AI era — with hands-on experience building and deploying AI agents, working across LLM frameworks, and leveraging tools across the modern AI stack.",
  location: "Austin, TX",
  avatar: "/icons/avatar.svg",
};
