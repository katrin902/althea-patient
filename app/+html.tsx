import type { PropsWithChildren } from 'react';

/**
 * Custom HTML document for the Expo web build.
 *
 * On desktop (viewport > 430 px): the app is displayed in a centered
 * phone-shaped frame (390 × 844 px, rounded corners, shadow).
 * On actual mobile devices: full-screen, no changes.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* ── Expo reset (required when using +html.tsx) ── */}
        <style id="expo-reset" dangerouslySetInnerHTML={{ __html: EXPO_RESET }} />

        {/* ── Desktop phone-frame ── */}
        <style dangerouslySetInnerHTML={{ __html: PHONE_FRAME }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

/** Expo's standard web reset — keeps ScrollView + SafeAreaView working correctly. */
const EXPO_RESET = `
  html, body { height: 100%; }
  body { overflow: hidden; }
  #root { display: flex; height: 100%; flex: 1; }
`;

/**
 * On screens wider than a phone (> 430 px CSS pixels):
 *   - body becomes a dark full-viewport centering container
 *   - #root is constrained to a phone-sized frame with rounded corners + shadow
 *
 * Below 430 px (real phones): nothing changes — full-screen as usual.
 */
const PHONE_FRAME = `
  @media (min-width: 431px) {
    html {
      background: linear-gradient(145deg, #12121f 0%, #1a1f35 100%);
    }

    body {
      display: flex !important;
      justify-content: center;
      align-items: center;
      height: 100%;
      overflow: hidden;
    }

    #root {
      /* phone dimensions — iPhone 14 footprint */
      flex: none !important;
      width: 390px !important;
      height: min(844px, 100vh) !important;

      /* phone chrome */
      border-radius: 44px !important;
      overflow: hidden !important;

      /* layered shadow: bezel ring + depth */
      box-shadow:
        0 0 0 10px #22223a,
        0 0 0 11px #2e2e50,
        0 40px 100px rgba(0, 0, 0, 0.7) !important;
    }
  }

  /* Slightly shorter viewports (laptops): shrink height, keep corners */
  @media (min-width: 431px) and (max-height: 860px) {
    #root {
      height: 100vh !important;
      border-radius: 0 !important;
      box-shadow:
        0 0 0 10px #22223a,
        0 0 0 11px #2e2e50,
        0 40px 100px rgba(0, 0, 0, 0.7) !important;
    }
  }
`;
