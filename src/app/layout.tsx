import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { MobileActionBar } from "@/components/MobileActionBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { business } from "@/content/business";
import { defaultDescription, JsonLd, localBusinessJsonLd, robots } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { FunProvider } from "@/components/fun/FunProvider";
import { IntroOverlay } from "@/components/fun/IntroOverlay";
import "./globals.css";
import "./fun.css";

// Runs before first paint: returning visitors and reduced-motion users never see the intro.
const introGate = `try{if(sessionStorage.getItem("hb-intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="skip"}catch(e){}`;

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
    <html lang="en-AU" suppressHydrationWarning className={`${bricolage.variable} ${figtree.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col overflow-x-clip">
        <script dangerouslySetInnerHTML={{ __html: introGate }} />
        <IntroOverlay />
        <FunProvider />
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
