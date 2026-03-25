export type FooterLink = {
  label: string;
  href?: string;
  badge?: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export const footerSections: FooterSection[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Security", href: "/security" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers", badge: "We’re hiring!" },
      { label: "Service Status", href: "/status" },
    ],
  },
  {
    title: "VAAD Products",
    links: [
      { label: "Billboard", href: "/billboard" },
      { label: "Radio", href: "/radio" },
      { label: "Digital Marketing", href: "/digital-marketing" },
      { label: "Tv Advertisement", href: "/tv" },
      { label: "Lamp Post", href: "/lamp-post" },
      { label: "Frequently Purchased", href: "/popular" },
    ],
  },
];

export const footerBottomLinks: FooterLink[] = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Security", href: "/security" },
  { label: "Sitemap", href: "/sitemap" },
];
