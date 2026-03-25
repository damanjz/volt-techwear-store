import Link from "next/link";

const legalLinks = [
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms of Service", href: "/policies/terms" },
] as const;

export default function FooterBottom() {
  return (
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
  );
}
