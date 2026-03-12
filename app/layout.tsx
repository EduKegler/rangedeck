import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { parseSettingsCookie, SETTINGS_COOKIE_NAME } from "./lib/settings";

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

const APP_NAME = "RangeDeck";
const APP_TITLE = "RangeDeck - Free Poker Range Builder & Hand Chart Tool";
const APP_DESCRIPTION = "Free online poker range builder tool. Create, organize and study Texas Hold'em hand ranges with our interactive 13x13 grid. Build preflop charts for any position - 100% free, no signup required.";
const APP_URL = "https://rangedeck.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "free poker range builder",
    "poker range builder free",
    "free poker tool",
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
    "free poker software",
    "poker range calculator",
    "free hand range chart",
    "poker AI tool",
    "AI poker ranges",
    "poker range generator",
    "preflop chart builder",
    "poker study tool free",
    "poker training free",
    "range deck",
    "rangedeck",
    "best free poker range builder",
    "online poker range builder",
    "poker range maker",
    "poker hand chart maker",
    "free GTO poker tool",
    "poker range editor",
    "build poker ranges online",
    "poker strategy tool free",
  ],
  authors: [{ name: "RangeDeck Team" }],
  creator: "RangeDeck",
  publisher: "RangeDeck",
  applicationName: APP_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "Games & Entertainment",
  classification: "Free Poker Strategy Tool",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RangeDeck - Free Poker Range Builder with Interactive Hand Chart",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@rangedeck",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
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
    "msapplication-TileColor": "#3b82f6",
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
    { media: "(prefers-color-scheme: dark)", color: "#0c1220" },
  ],
  colorScheme: "dark light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: APP_NAME,
  alternateName: ["Range Deck", "RangeDeck Poker", "Free Poker Range Builder"],
  description: APP_DESCRIPTION,
  url: APP_URL,
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    description: "Free poker range builder - no payment required",
  },
  author: {
    "@type": "Organization",
    name: "RangeDeck",
    url: APP_URL,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "324",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "Free to use - no signup required",
    "Custom range creation",
    "Category organization",
    "13x13 grid visualization",
    "Customizable color labels",
    "JSON export and import",
    "Responsive interface",
    "Dark mode support",
    "Auto-save to local storage",
    "Offline support",
    "AI-optimized range building",
    "Preflop chart builder",
    "Position-based ranges",
    "GTO-style range organization",
  ],
  screenshot: `${APP_URL}/og-image.png`,
  softwareVersion: "2.0",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().split('T')[0],
  inLanguage: "en",
  isAccessibleForFree: true,
  isFamilyFriendly: true,
  keywords: "free poker range builder, poker hand chart, preflop ranges, GTO poker, poker strategy tool",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is RangeDeck really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! RangeDeck is 100% free to use. No signup, no credit card, no hidden fees. All features are available to everyone.",
      },
    },
    {
      "@type": "Question",
      name: "What is a poker range builder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A poker range builder is a tool that helps you create and visualize the hands you should play from each position. RangeDeck uses an interactive 13x13 grid representing all 169 unique starting hands in Texas Hold'em.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use RangeDeck offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! RangeDeck saves all your ranges locally in your browser. Once loaded, you can use it without an internet connection. Your data stays private on your device.",
      },
    },
    {
      "@type": "Question",
      name: "How do I export my ranges?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Click the 'Export JSON' button in the header to download all your ranges as a JSON file. You can import this file later or share it with other players.",
      },
    },
    {
      "@type": "Question",
      name: "Can AI help me build poker ranges?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RangeDeck provides the perfect interface for building and studying ranges. You can use AI assistants to suggest optimal ranges, then input them into RangeDeck for visualization and practice.",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const settingsCookie = cookieStore.get(SETTINGS_COOKIE_NAME)?.value;
  const settings = parseSettingsCookie(settingsCookie);

  return (
    <html 
      lang="en" 
      className="dark"
      style={{
        '--settings-card-size': `${settings.cardSize}px`,
        '--settings-grid-font-size': `${settings.gridFontSize}px`,
      } as React.CSSProperties}
    >
      <head>
       <meta name="google" content="notranslate" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>
        <Providers>
          {children}
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
