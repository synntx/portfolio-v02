import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

const outfit = Outfit({
  subsets: ["latin"],
  preload: true,
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Harsh's Portfolio | Full Stack Engineer & Designer",
  description:
    "Software engineer working with TypeScript and React. Building web applications and learning systems programming.",
  keywords: [
    "web developer",
    "portfolio",
    "harshyadavone",
    "Full Stack Developer",
    "Full Stack Enginner",
    "Frontend Enginner",
    "Backend Enginner",
    "Web Development",
    "UI/UX Design",
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
  ],
  authors: [{ name: "Harsh Yadav" }],
  openGraph: {
    title: "Harsh's Portfolio | Full Stack Engineer & Designer",
    description:
      "Software engineer working with TypeScript and React. Building web applications and learning systems programming.",
    type: "website",
    url: "https://harshyadavone.vercel.app",
    images: [
      {
        url: "https://harshyadavone.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Harsh Yadav - Full Stack Engineer & Designer",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://harshyadavone.vercel.app",
    languages: {
      "en-US": "https://harshyadavone.vercel.app/en",
      "hi-IN": "https://harshyadavone.vercel.app/hi",
    },
  },
  twitter: {
    card: "summary_large_image",
    site: "@harshyadavone",
    creator: "@harshyadavone",
    images: ["https://harshyadavone.vercel.app/og-image.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="twhv-FtvhTmMu8DrAZbHTaCKsoXamB_xxt-KjZVGEFU"
        />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Harsh Yadav",
              url: "https://harshyadavone.vercel.app",
              jobTitle: "Full stack engineer",
              worksFor: {
                "@type": "Organization",
                name: "Self-Employed",
                description:
                  "Independent Full Stack Engineer open to freelance opportunities",
              },
              skills: [
                "Web Development",
                "UI/UX Design",
                "React",
                "Typescript",
                "Next.js",
                "Node.js",
              ],
              sameAs: [
                "https://www.linkedin.com/in/harshdana",
                "https://twitter.com/harshyadavone",
                "https://instagram.com/harshyadavone",
                "https://harshdana.vercel.app/",
              ],
              description:
                "Software engineer working with TypeScript and React. Building web applications and learning systems programming",
            }),
          }}
        />
      </head>
      <body className={`${outfit.className} antialiased`}>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-F7FRJKW5QH" />
    </html>
  );
}
