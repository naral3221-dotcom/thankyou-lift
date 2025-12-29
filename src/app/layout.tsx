import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://balancelab.kr"),
  title: "리프팅후기 | 밸런스랩 성형외과 리프팅 전후사진",
  description: "강남 밸런스랩 성형외과 리프팅 실제 후기와 전후사진. 투명브이리프팅, 안면거상, 미니리프팅 비포애프터를 직접 확인하세요. 임수성, 이장원, 강민구 원장 1:1 상담.",
  keywords: ["밸런스랩 성형외과", "리프팅", "안면거상", "미니리프팅", "투명브이리프팅", "밸런스랩", "강남 성형외과", "얼굴 리프팅", "피부 탄력", "리프팅후기", "실리프팅후기", "안면거상후기", "미니리프팅후기", "리프팅전후", "리프팅비포애프터", "강남리프팅", "리프팅잘하는곳", "리프팅전후사진", "실제리프팅후기"],
  authors: [{ name: "밸런스랩 성형외과" }],
  creator: "밸런스랩 성형외과",
  publisher: "밸런스랩 성형외과",
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: "https://balancelab.kr/thankyou/lift/",
    languages: {
      "ko": "https://www.balancelab.kr/",
      "en": "http://en.balancelab.kr/lng/en/",
      "zh": "http://cn.balancelab.kr/lng/cn/",
      "ja": "http://jp.balancelab.kr/lng/jp/",
      "th": "http://th.balancelab.kr/lng/th/",
    },
  },
  openGraph: {
    title: "리프팅후기 | 밸런스랩 성형외과 리프팅 전후사진",
    siteName: "밸런스랩 성형외과",
    description: "강남 밸런스랩 성형외과 리프팅 실제 후기와 전후사진. 투명브이리프팅, 안면거상, 미니리프팅 비포애프터를 직접 확인하세요.",
    type: "website",
    locale: "ko_KR",
    url: "https://balancelab.kr/thankyou/lift/",
    images: [
      {
        url: "https://balancelab.kr/img/kakao.jpg",
        width: 1200,
        height: 630,
        alt: "밸런스랩 성형외과 리프팅 센터",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "리프팅후기 | 밸런스랩 성형외과 리프팅 전후사진",
    site: "@balancelab",
    description: "강남 밸런스랩 리프팅 실제 후기와 전후사진. 투명브이리프팅, 안면거상, 미니리프팅.",
    images: ["https://balancelab.kr/img/kakao.jpg"],
  },
  icons: {
    icon: [
      { url: "/img/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/img/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/img/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/img/favicon/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/img/favicon/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/img/favicon/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/img/favicon/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/img/favicon/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/img/favicon/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/img/favicon/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/img/favicon/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/img/favicon/apple-icon-180x180.png", sizes: "180x180" },
    ],
  },
  other: {
    "msapplication-TileColor": "#ffffff",
    "theme-color": "#ffffff",
    "naver-site-verification": "a31941be55d9672fa7afa2751fa2555fb390cf24",
    "facebook-domain-verification": "t3pvankquurf0q2uz4n9p6zpulraal",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* JSON-LD Structured Data - MedicalBusiness & LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["MedicalBusiness", "LocalBusiness"],
              "name": "밸런스랩 성형외과",
              "alternateName": "BalanceLab Plastic Surgery",
              "description": "강남 밸런스랩 성형외과 리프팅 센터. 투명브이리프팅, 안면거상, 미니리프팅 전문.",
              "url": "https://balancelab.kr/thankyou/lift/",
              "logo": "https://balancelab.kr/img/logo.png",
              "image": "https://balancelab.kr/img/kakao.jpg",
              "telephone": "+82-2-512-8888",
              "priceRange": "$$$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "강남대로 422",
                "addressLocality": "강남구",
                "addressRegion": "서울특별시",
                "postalCode": "06192",
                "addressCountry": "KR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 37.501286,
                "longitude": 127.024776
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "10:00",
                  "closes": "19:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Saturday",
                  "opens": "10:00",
                  "closes": "16:00"
                }
              ],
              "sameAs": [
                "https://www.instagram.com/balancelab_official/",
                "https://www.youtube.com/@balancelab",
                "https://blog.naver.com/balancelab"
              ],
              "medicalSpecialty": "PlasticSurgery",
              "availableService": [
                {
                  "@type": "MedicalProcedure",
                  "name": "투명브이리프팅",
                  "procedureType": "https://schema.org/NoninvasiveProcedure"
                },
                {
                  "@type": "MedicalProcedure",
                  "name": "안면거상술",
                  "procedureType": "https://schema.org/SurgicalProcedure"
                },
                {
                  "@type": "MedicalProcedure",
                  "name": "미니리프팅",
                  "procedureType": "https://schema.org/SurgicalProcedure"
                }
              ]
            })
          }}
        />

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TQXZWKLX');`}
        </Script>

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4HX67VWEL1"
          strategy="afterInteractive"
        />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4HX67VWEL1');`}
        </Script>

        {/* Facebook Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '882327017053303');
          fbq('init', '788737450091524');
          fbq('init', '1306056114300147');
          fbq('init', '1348599113061333');
          fbq('track', 'PageView');`}
        </Script>

        {/* TikTok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('D4EHT5BC77UBVM8PB1QG');
          ttq.page();
          }(window, document, 'ttq');`}
        </Script>

        {/* Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16544305243"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-16544305243');`}
        </Script>

        {/* Enliple Tracker */}
        <Script
          src="https://cdn.onetag.co.kr/0/tcs.js?eid=1ieya55u3alib1ieya55u3"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TQXZWKLX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
