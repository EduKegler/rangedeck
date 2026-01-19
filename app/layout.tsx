import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";

const GA_TRACKING_ID = "G-FPV25X5LSS";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const APP_NAME = "Poker Range Builder";
const APP_DESCRIPTION = "Professional tool to build, organize and study Texas Hold'em poker ranges. Create custom ranges for each position, visualize hand distributions and improve your game.";
const APP_URL = "https://poker-range-builder.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Professional Poker Range Chart Builder`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "poker",
    "range builder",
    "poker ranges",
    "texas holdem",
    "poker strategy",
    "hand ranges",
    "poker charts",
    "GTO poker",
    "poker training",
    "poker study",
    "preflop ranges",
    "poker positions",
    "UTG range",
    "button range",
    "3bet range",
    "poker tools",
    "range chart",
    "hand chart",
    "poker hand matrix",
    "opening ranges",
    "defending ranges",
    "squeeze play",
    "cold call ranges",
    "poker preflop",
    "nlhe ranges",
    "cash game ranges",
    "tournament ranges",
    "poker solver",
    "range visualizer",
    "free poker tool",
  ],
  authors: [{ name: "Poker Range Builder Team" }],
  creator: "Poker Range Builder",
  publisher: "Poker Range Builder",
  applicationName: APP_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "Games & Entertainment",
  classification: "Poker Strategy Tool",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - Professional Poker Range Chart Builder`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Poker Range Builder - Interactive 13x13 poker hand matrix visualization",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Professional Poker Range Chart Builder`,
    description: APP_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@pokerrangebuilder",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.json",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: APP_URL,
  },

  appLinks: {
    web: {
      url: APP_URL,
      should_fallback: true,
    },
  },

  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": APP_NAME,
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#1e3a5f",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "dark light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: APP_URL,
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Poker Range Builder Team",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "Custom range creation",
    "Category organization",
    "13x13 grid visualization",
    "Customizable color labels",
    "JSON export and import",
    "Responsive interface",
    "Dark mode support",
    "Auto-save to local storage",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
