import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { inter } from "./font/font";

/*
const SITE_URL = 'https://talenia.com';

export const metadata: Metadata = {
  title: {
    default: 'TalenIA | Plataforma de Gestión de Talento y Reclutamiento Inteligente',
    template: '%s | TalenIA',
  },
  description: 'Optimiza tu proceso de reclutamiento con TalenIA. Encuentra y gestiona el mejor talento para tu empresa con nuestra plataforma de gestión de reclutamiento impulsada por IA. Herramientas avanzadas para la selección, evaluación y seguimiento de candidatos.',
  keywords: ['reclutamiento', 'talento', 'selección de personal', 'gestión de RRHH', 'inteligencia artificial', 'reclutamiento inteligente', 'software de reclutamiento'],
  authors: [{ name: 'RyC Group' }],
  creator: 'RyC Group',
  publisher: 'Genesis Partners',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TalenIA - Revoluciona tu proceso de reclutamiento con IA',
    description: 'Descubre cómo nuestra plataforma de gestión de talento puede transformar tu proceso de contratación con tecnología de punta e inteligencia artificial.',
    url: SITE_URL,
    siteName: 'TalenIA',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'TalenIA - Plataforma de Gestión de Talento',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalenIA - Reclutamiento Inteligente con IA',
    description: 'Transforma tu proceso de selección con nuestra plataforma de gestión de talento impulsada por inteligencia artificial.',
    images: [`${SITE_URL}/twitter-image.jpg`],
    creator: '@talenia_ai',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E9E3FF' },
    { media: '(prefers-color-scheme: dark)', color: '#2F2943' },
  ],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  category: 'Tecnología y Recursos Humanos',
};*/

export const metadata: Metadata = {
  title: {
    default:
      "TalenIA | Plataforma de Gestión de Talento y Reclutamiento Inteligente",
    template: "%s | TalenIA",
  },
  description:
    "Optimiza tu proceso de reclutamiento con TalenIA. Encuentra y gestiona el mejor talento para tu empresa con nuestra plataforma de gestión de reclutamiento impulsada por IA. Herramientas avanzadas para la selección, evaluación y seguimiento de candidatos.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={` ${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
