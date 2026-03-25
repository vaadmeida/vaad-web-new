import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@repo/ui/globals.css";
import { AuthProvider } from "./contexts/auth-context";
import { ToastProvider } from "./contexts/toast-context";
import ScrollProgress from "./components/ui/scroll-progress";
import SplashProvider from "./components/SplashProvider";
import { FavoriteProvider } from "./contexts/favorite-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 🌍 Base URL
const baseUrl = "https://www.vaad.com.ng";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "VAAD Media Ltd | Outdoor Advertising & Media Solutions Nigeria",
    template: "%s | VAAD Media Ltd",
  },

  description:
    "VAAD Media Ltd is a leading outdoor advertising company in Nigeria, delivering innovative billboard, digital signage, and media solutions that transform brand visibility.",

  keywords: [
    "VAAD Media",
    "Outdoor advertising Nigeria",
    "Billboards Lagos",
    "Digital signage Nigeria",
    "Advertising agency Nigeria",
    "OOH advertising",
    "Media buying Nigeria",
  ],

  authors: [{ name: "VAAD Media Ltd" }],
  creator: "VAAD Media Ltd",
  publisher: "VAAD Media Ltd",

  applicationName: "VAAD Media",
  category: "Advertising & Marketing",

  // 🔥 Canonical
  alternates: {
    canonical: baseUrl,
  },

  // 🌐 Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    type: "website",
    url: baseUrl,
    title: "VAAD Media Ltd | Outdoor Advertising Solutions",
    description:
      "Transform your brand visibility with VAAD Media Ltd – Nigeria’s trusted partner for outdoor advertising, billboards, and digital media solutions.",
    siteName: "VAAD Media Ltd",
    locale: "en_NG",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`, // 🔥 Add this image
        width: 1200,
        height: 630,
        alt: "VAAD Media Outdoor Advertising",
      },
    ],
  },

  // 🐦 Twitter SEO
  twitter: {
    card: "summary_large_image",
    title: "VAAD Media Ltd | Outdoor Advertising Nigeria",
    description:
      "Leading outdoor advertising company in Nigeria delivering impactful billboard and digital media campaigns.",
    images: [`${baseUrl}/og-image.jpg`],
  },

  // 🤖 Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },

  // 📱 Icons
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },

  // 🌍 Geo (VERY GOOD for local SEO)
  other: {
    "geo.region": "NG-LA",
    "geo.placename": "Lagos",
    "geo.position": "6.5244;3.3792",
    ICBM: "6.5244, 3.3792",
  },
};

// 📱 Viewport config
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <ScrollProgress />
            <SplashProvider>
              <FavoriteProvider>{children}</FavoriteProvider>
            </SplashProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
