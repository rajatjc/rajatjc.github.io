import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { education, profile, socials } from "./data";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const title = `${profile.name} | ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title,
  description: profile.description,
  authors: [{ name: profile.name, url: profile.url }],
  keywords: [
    "Rajat Sharma",
    "Backend Engineer",
    "Platform Engineer",
    "Software Developer",
    "IBM",
    "Java",
    "Go",
    "Spring Boot",
    "Kafka",
    "Cassandra",
    "Kubernetes",
    "Toronto",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: profile.url,
    title,
    description: profile.description,
    siteName: profile.name,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: profile.url,
  email: `mailto:${profile.email}`,
  image: `${profile.url}/profile.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "Toronto", addressRegion: "ON", addressCountry: "CA" },
  worksFor: { "@type": "Organization", name: "IBM", url: "https://www.ibm.com" },
  alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
  sameAs: socials.map((s) => s.href),
  knowsAbout: ["Java", "Go", "Spring Boot", "Kafka", "Cassandra", "Kubernetes", "Distributed Systems", "Storage Engines"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint, so reveal animations never hide content from no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
