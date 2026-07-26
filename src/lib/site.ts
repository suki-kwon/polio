const FALLBACK_SITE_URL = 'http://localhost:3000';

/**
 * 절대 URL로 쓸 수 있는 값인지 검증하고 후행 슬래시를 떼서 정규화한다.
 *
 * 검증 없이 넘기면 `layout.tsx`의 `new URL(SITE_URL)`에서 `TypeError: Invalid URL`만 뜨고
 * 어떤 환경변수가 잘못됐는지 알 수 없다. 실패 지점을 설정값 바로 옆으로 끌어온다.
 */
function normalizeSiteUrl(value: string, source: string): string {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(
      `${source}이 유효한 절대 URL이 아닙니다: "${value}". `
      + '프로토콜을 포함해 지정해 주세요 (예: https://example.com).',
    );
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(
      `${source}의 프로토콜이 http/https가 아닙니다: "${value}".`,
    );
  }

  // 'https://example.com' → new URL이 'https://example.com/'로 만들므로 다시 떼어낸다.
  // og:url이 경로와 이어붙을 때 슬래시가 겹치는 것을 막는다.
  return parsed.href.replace(/\/$/, '');
}

/**
 * 사이트의 정식 origin. `metadataBase`와 og:image 같은 절대 URL 생성의 기준점.
 *
 * 우선순위:
 * 1. `NEXT_PUBLIC_SITE_URL` — 커스텀 도메인이 정해지면 이걸 지정한다(프로토콜 포함).
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — Vercel이 프로덕션 도메인을 자동 주입한다(프로토콜 없음).
 *    배포 단위로 바뀌는 `VERCEL_URL`이 아니라 이 값을 쓰는 이유는, og:image URL이
 *    프리뷰 배포마다 달라지면 소셜 플랫폼 캐시가 무의미해지기 때문.
 * 3. localhost — 로컬 개발. 이 값이 쓰이면 소셜 크롤러는 이미지를 가져갈 수 없다.
 *    배포 시 1번을 설정하는 것이 전제이고, 그 확인은 배포 작업의 체크리스트에 둔다.
 */
function resolveSiteUrl(): string {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicitUrl) {
    return normalizeSiteUrl(explicitUrl, 'NEXT_PUBLIC_SITE_URL');
  }

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProductionUrl) {
    return normalizeSiteUrl(`https://${vercelProductionUrl}`, 'VERCEL_PROJECT_PRODUCTION_URL');
  }

  return FALLBACK_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();
