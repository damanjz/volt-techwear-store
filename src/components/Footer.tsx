import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const quickLinks = [
  { label: "Shop Archive", href: "/shop" },
  { label: "Hardware", href: "/merch" },
  { label: "The Syndicate", href: "/membership" },
  { label: "Black Site", href: "/black-site" },
];

const supportLinks = [
  { label: "Size Guide", href: "/support/size-guide" },
  { label: "Shipping & Returns", href: "/support/shipping" },
  { label: "FAQ", href: "/support/faq" },
  { label: "Contact", href: "/support/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms of Service", href: "/policies/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background/80 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="font-display font-black text-2xl uppercase tracking-tighter mb-4">
              VOLT<span className="text-volt">.</span>
            </div>
            <p className="font-sans text-sm text-foreground/60 leading-relaxed mb-6">
              High-performance tactical apparel for the urban operative. Engineered materials meet cyberpunk aesthetics.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 hover:text-volt transition-colors border border-foreground/10 px-3 py-1.5"
              >
                IG
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 hover:text-volt transition-colors border border-foreground/10 px-3 py-1.5"
              >
                X
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 hover:text-volt transition-colors border border-foreground/10 px-3 py-1.5"
              >
                DC
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
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

          {/* Support */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
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

          {/* Newsletter */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-6">
              Intel Feed
            </h4>
            <p className="font-sans text-sm text-foreground/60 mb-4">
              Subscribe for drop alerts and exclusive access codes.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-[10px] text-foreground/30 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} VOLT System // End Transmission.
          </div>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] text-foreground/30 uppercase tracking-widest hover:text-foreground/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
