import NewsletterForm from "./NewsletterForm";

export default function FooterNewsletter() {
  return (
    <div>
      <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-6">
        Intel Feed
      </h4>
      <p className="font-sans text-sm text-foreground/60 mb-4">
        Subscribe for drop alerts and exclusive access codes.
      </p>
      <NewsletterForm />
    </div>
  );
}
