import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { CookieBanner } from "@/components/cookie-banner";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Data Universe — La référence data & IA en français",
  description: "Actualités, glossaire, métiers et formations sur la data et l'intelligence artificielle. Le hub francophone de la communauté data.",
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('datauniverse_theme');
    var d = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Nav />
        <div style={{ flex: 1 }}>{children}</div>
        <BackToTop />
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
