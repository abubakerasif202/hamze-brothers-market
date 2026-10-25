import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { MobileActionBar } from "@/components/MobileActionBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { business } from "@/content/business";
import { defaultDescription, JsonLd, localBusinessJsonLd, robots } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} | Fresh. Local. Family. | Guildford`,
    template: `%s | ${business.name}`,
  },
  description: defaultDescription,
  applicationName: business.name,
  robots,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#173f35",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${bricolage.variable} ${figtree.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <JsonLd data={localBusinessJsonLd()} />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileActionBar />
      </body>
    </html>
  );
}
