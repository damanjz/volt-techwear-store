import Link from "next/link";

interface FooterLink {
  readonly label: string;
  readonly href: string;
}

interface LinkColumnProps {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

const quickLinks: readonly FooterLink[] = [
  { label: "Shop Archive", href: "/shop" },
  { label: "Hardware", href: "/merch" },
  { label: "The Syndicate", href: "/membership" },
  { label: "Black Site", href: "/black-site" },
];

const supportLinks: readonly FooterLink[] = [
  { label: "Size Guide", href: "/support/size-guide" },
  { label: "Shipping & Returns", href: "/support/shipping" },
  { label: "FAQ", href: "/support/faq" },
  { label: "Contact", href: "/support/contact" },
];

function LinkColumn({ title, links }: LinkColumnProps) {
  return (
    <div>
      <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-6">
        {title}
      </h4>
      <ul role="list" className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-mono text-sm text-foreground/60 hover:text-volt transition-colors uppercase tracking-wider"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FooterLinks() {
  return (
    <>
      <LinkColumn title="Navigation" links={quickLinks} />
      <LinkColumn title="Support" links={supportLinks} />
    </>
  );
}
