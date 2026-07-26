import { ReactNode } from 'react'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";

import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import Header from "@components/layout/Header";
import "@styles/globals.css";

import styles from "./layout.module.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    // og:image 등 파일 컨벤션이 만드는 URL을 절대 경로로 해석하기 위한 기준점.
    // 하위 라우트는 이 값을 상속받으므로 루트 레이아웃에서만 지정한다.
    metadataBase: new URL(SITE_URL),
    ...buildPageMetadata({
      locale,
      title: t("title"),
      description: t("description"),
      path: "/",
    }),
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html suppressHydrationWarning className={`${inter.variable} ${styles.html}`} lang={locale}>
      <body className={styles.body}>
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <Header />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
