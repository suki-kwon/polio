const FALLBACK_SITE_URL = 'http://localhost:3000';

/**
 * 사이트의 정식 origin. `metadataBase`와 og:image 같은 절대 URL 생성의 기준점.
 *
 * 우선순위:
 * 1. `NEXT_PUBLIC_SITE_URL` — 커스텀 도메인이 정해지면 이걸 지정한다(프로토콜 포함).
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — Vercel이 프로덕션 도메인을 자동 주입한다(프로토콜 없음).
 *    배포 단위로 바뀌는 `VERCEL_URL`이 아니라 이 값을 쓰는 이유는, og:image URL이
 *    프리뷰 배포마다 달라지면 소셜 플랫폼 캐시가 무의미해지기 때문.
 * 3. localhost — 로컬 개발. 이 값이 쓰이면 소셜 크롤러는 이미지를 가져갈 수 없다.
 */
function resolveSiteUrl(): string {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicitUrl) {
    return explicitUrl;
  }

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProductionUrl) {
    return `https://${vercelProductionUrl}`;
  }

  return FALLBACK_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();
