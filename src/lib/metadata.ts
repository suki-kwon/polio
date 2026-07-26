import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';

import { routing } from '@/i18n/routing';
import { OG_IMAGE_ALT, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_PATH, OG_IMAGE_SIZE } from '@/lib/og-image';

/** og:site_name. 로케일과 무관한 브랜드명이라 messages가 아니라 코드에 둔다. */
const SITE_NAME = 'Polio';

/**
 * 소셜 카드 이미지를 명시적으로 지정한다.
 *
 * `opengraph-image.tsx` 파일 컨벤션은 openGraph를 정의하지 않은 세그먼트에만 이미지를
 * 자동으로 채워준다. 메타데이터 병합이 얕은 병합이라(Next.js 문서 "Merging"), 하위 페이지가
 * 자기 openGraph를 정의하는 순간 부모의 openGraph가 이미지까지 통째로 교체돼 사라진다.
 * 그래서 문서가 권장하는 대로 공유 필드를 변수로 빼서 모든 페이지에 다시 넣어준다.
 */
const OG_IMAGE = {
  url: OG_IMAGE_PATH,
  alt: OG_IMAGE_ALT,
  type: OG_IMAGE_CONTENT_TYPE,
  ...OG_IMAGE_SIZE,
};

/** Open Graph의 locale은 언어 코드가 아니라 `언어_지역` 형식을 요구한다. */
const OG_LOCALES = {
  ko: 'ko_KR',
  en: 'en_US',
} as const satisfies Record<(typeof routing.locales)[number], string>;

type BuildPageMetadataOptions = {
  locale: string;
  title: string;
  description: string;
  /** 사이트 루트 기준 경로. og:url을 절대 URL로 만드는 데 쓰인다. */
  path: string;
};

/**
 * 페이지의 title/description을 Open Graph·Twitter 카드까지 한 번에 펼쳐준다.
 *
 * 각 페이지가 `openGraph`를 직접 정의하지 않으면 루트 레이아웃의 값을 그대로 상속받아
 * 모든 하위 페이지의 og:title/og:url이 홈 것으로 노출된다(Next.js 메타데이터 병합은
 * 필드 단위 얕은 병합). 그래서 페이지마다 이 헬퍼를 호출해 자기 값으로 덮어쓴다.
 *
 * og:image는 `opengraph-image.tsx` 파일 컨벤션이 자동으로 주입하므로 여기서 다루지 않는다.
 */
export function buildPageMetadata({
  description,
  locale,
  path,
  title,
}: BuildPageMetadataOptions): Metadata {
  const resolvedLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      locale: OG_LOCALES[resolvedLocale],
      alternateLocale: routing.locales
        .filter((candidate) => candidate !== resolvedLocale)
        .map((candidate) => OG_LOCALES[candidate]),
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
