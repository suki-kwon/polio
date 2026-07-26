import { ImageResponse } from 'next/og';

import { routing } from '@/i18n/routing';
import { OG_IMAGE_ALT, OG_IMAGE_CONTENT_TYPE, OG_IMAGE_SIZE } from '@/lib/og-image';

/**
 * 소셜 공유 카드 이미지. `[locale]` 세그먼트 아래 있어 모든 하위 라우트가 상속받는다.
 *
 * 이미지 안의 문구는 의도적으로 영문 Hero 카피만 쓴다 — `next/og`(satori)는 시스템 폰트를
 * 쓸 수 없어 폰트 데이터를 직접 임베드해야 하고, 한글을 넣으려면 한글 웹폰트를 레포에
 * 커밋하거나 빌드 타임에 네트워크로 받아와야 한다. 로케일별 차이는 og:title/og:description
 * (`buildPageMetadata`)이 담당하므로 이미지까지 한글화할 이유가 없다고 판단.
 *
 * `alt`는 파일 스코프 상수라 로케일별로 분기할 수 없다(Next.js 파일 컨벤션 제약).
 */
export const alt = OG_IMAGE_ALT;

export const size = OG_IMAGE_SIZE;

export const contentType = OG_IMAGE_CONTENT_TYPE;

/**
 * 이 파일은 레이아웃과 별개의 라우트 핸들러라 `layout.tsx`의 `generateStaticParams`를
 * 상속받지 않는다. 없으면 이미지가 요청마다 다시 렌더링되는 동적 라우트(ƒ)로 떨어진다.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// globals.css의 다크 테마 토큰과 동일한 값. satori는 CSS 변수를 해석하지 못해 하드코딩한다.
const COLOR_BG_MAIN = '#060816';
const COLOR_TEXT_MAIN = '#f8fafc';
const COLOR_TEXT_SUB = '#9aa8c3';
const COLOR_ACCENT = '#22d3ee';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: COLOR_BG_MAIN,
          backgroundImage: [
            `radial-gradient(circle at 10% 4%, ${COLOR_ACCENT}38, transparent 45%)`,
            'radial-gradient(circle at 94% 98%, #1d4ed845, transparent 52%)',
          ].join(', '),
          color: COLOR_TEXT_MAIN,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              marginRight: 18,
              borderRadius: 9999,
              backgroundColor: COLOR_ACCENT,
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: COLOR_ACCENT,
            }}
          >
            Frontend Architect
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.14,
              letterSpacing: -1.5,
            }}
          >
            Complex problems,
          </div>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.14,
              letterSpacing: -1.5,
              color: COLOR_ACCENT,
            }}
          >
            Structured systems.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 32,
            borderTop: `1px solid ${COLOR_TEXT_SUB}30`,
            fontSize: 28,
            color: COLOR_TEXT_SUB,
          }}
        >
          <div
            style={{
              display: 'flex',
            }}
          >
            Polio · Portfolio of Sukhyeon
          </div>
          <div
            style={{
              display: 'flex',
            }}
          >
            Frontend Engineer
          </div>
        </div>
      </div>
    ),
    size,
  );
}
