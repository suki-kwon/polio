/**
 * `src/app/[locale]/opengraph-image.tsx`가 만드는 소셜 카드 이미지의 명세.
 *
 * 이미지 생성 파일과 `buildPageMetadata` 양쪽이 같은 값을 알아야 해서 별도 모듈로 뺐다.
 * (생성 파일에서 직접 import하면 모든 페이지가 `next/og`까지 끌고 오게 된다)
 */

export const OG_IMAGE_ALT = 'Polio — Complex problems, Structured systems.';

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

export const OG_IMAGE_CONTENT_TYPE = 'image/png';

/**
 * 로케일 프리픽스 없는 경로. `localePrefix: 'never'` 정책상 프록시가 기본 로케일 세그먼트로
 * 재작성해준다. 이미지 내용이 로케일과 무관하므로 어느 쪽으로 재작성되든 결과는 같다.
 */
export const OG_IMAGE_PATH = '/opengraph-image';
