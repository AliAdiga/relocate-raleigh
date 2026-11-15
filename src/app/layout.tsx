import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ContactModalProvider from "@/components/ContactModalProvider";
import MoveProfileProvider from "@/components/MoveProfileProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const description =
  "Keep your tech career. Upgrade your life. Compare salaries, neighborhoods and commutes, then plan your move to Raleigh-Durham with a local who made it himself.";

export const metadata: Metadata = {
  metadataBase: new URL("https://relocateraleigh.com"),
  title: "Relocate Raleigh | Move your tech career to the Triangle",
  description,
  openGraph: {
    title: "Relocate Raleigh | Move your tech career to the Triangle",
    description,
    url: "https://relocateraleigh.com",
    siteName: "Relocate Raleigh",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Relocate Raleigh | Move your tech career to the Triangle",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <ContactModalProvider>
          <MoveProfileProvider>{children}</MoveProfileProvider>
        </ContactModalProvider>
      </body>
    </html>
  );
}
