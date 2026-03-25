import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Syndicate - Membership",
  description:
    "Join The Syndicate. Earn Volt Points, unlock exclusive drops, and access the Black Site Vault.",
  openGraph: {
    title: "The Syndicate | VOLT",
    description:
      "Join The Syndicate. Earn Volt Points and access exclusive drops.",
  },
};

export default function MembershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
