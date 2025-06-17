import { Allura, IBM_Plex_Mono } from "next/font/google";

export const allura = Allura({
  subsets: ["latin"],
  preload: true,
  display: "swap",
  weight: ["400"],
  variable: "--font-allura",
});

export const IBM_PLEX_MONO = IBM_Plex_Mono({
  subsets: ["latin"],
  preload: true,
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});
