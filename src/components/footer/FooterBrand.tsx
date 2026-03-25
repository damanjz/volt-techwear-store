const socialLinks = [
  { label: "IG", href: "https://instagram.com" },
  { label: "X", href: "https://x.com" },
  { label: "DC", href: "https://discord.com" },
];

export default function FooterBrand() {
  return (
    <div>
      <div className="font-display font-black text-2xl uppercase tracking-tighter mb-4">
        VOLT<span className="text-volt">.</span>
      </div>
      <p className="font-sans text-sm text-foreground/60 leading-relaxed mb-6">
        High-performance tactical apparel for the urban operative. Engineered
        materials meet cyberpunk aesthetics.
      </p>
      <div className="flex gap-4">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 hover:text-volt transition-colors border border-foreground/10 px-3 py-1.5"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
