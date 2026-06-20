import Script from "next/script";

/**
 * Charge Google Analytics 4 si NEXT_PUBLIC_GA_ID est défini.
 * Tant que la variable d'env est absente, ce composant ne rend rien
 * (pas de script chargé en local/dev tant que l'ID n'est pas configuré).
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
