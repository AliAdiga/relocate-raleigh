import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ContactModalProvider from "@/components/ContactModalProvider";
import MoveProfileProvider from "@/components/MoveProfileProvider";
import RevealObserver from "@/components/RevealObserver";
import { ShortlistTray } from "@/components/Shortlist";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const description =
  "Keep your career, upgrade your life. Explore Raleigh-Durham neighborhoods by commute and budget, compare costs, plan a scouting trip and get local relocation help from Nick, a licensed NC Realtor®.";
const title = "Relocate Raleigh | Your next chapter in the Triangle";

export const metadata: Metadata = {
  metadataBase: new URL("https://relocateraleigh.com"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "https://relocateraleigh.com",
    siteName: "Relocate Raleigh",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <MoveProfileProvider>
          <ContactModalProvider>
            {children}
            <ShortlistTray />
            <RevealObserver />
          </ContactModalProvider>
        </MoveProfileProvider>
      </body>
    </html>
  );
}
