import FooterBrand from "./footer/FooterBrand";
import FooterLinks from "./footer/FooterLinks";
import FooterNewsletter from "./footer/FooterNewsletter";
import FooterBottom from "./footer/FooterBottom";

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background/80 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <FooterBrand />
          <FooterLinks />
          <FooterNewsletter />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
