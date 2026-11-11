/**
 * Local links for the lightweight /links page. Profile-specific external links are
 * added from content/profile.json at build time.
 */
export type BioLink = { label: string; href: string; hint: string; external?: boolean };

export const BIO_LINKS: BioLink[] = [
  { label: "Writing & notes", href: "/writeups", hint: "articles and technical notes" },
  { label: "Projects", href: "/projects", hint: "selected work and experiments" },
  { label: "Portfolio", href: "/", hint: "home" },
  { label: "Contact", href: "/#contact", hint: "collaborations and enquiries" },
];
