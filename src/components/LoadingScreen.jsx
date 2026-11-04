import { useEffect, useRef } from 'react';

const DRAW_DURATION = 4200;
const COMPLETE_HOLD = 650;

function LoadingScreen({ shouldExit, onAnimationComplete, onExit }) {
  const logoRef = useRef(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return undefined;

    const paths = Array.from(logo.querySelectorAll('path'));
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducedMotion) {
      paths.forEach((path) => {
        path.style.strokeDasharray = 'none';
        path.style.strokeDashoffset = '0';
        path.style.opacity = '1';
      });

      const timeout = window.setTimeout(() => onAnimationComplete?.(), COMPLETE_HOLD);
      return () => window.clearTimeout(timeout);
    }

    const lengths = paths.map((path) => path.getTotalLength());
    const totalLength = lengths.reduce((total, length) => total + length, 0);
    let elapsed = 0;

    paths.forEach((path, index) => {
      const length = lengths[index];
      const duration = (length / totalLength) * DRAW_DURATION;

      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);
      path.style.transition = 'none';
      path.style.opacity = '1';

      // Each path starts exactly when the previous path finishes.
      path.dataset.drawDelay = String(elapsed);
      path.dataset.drawDuration = String(duration);
      elapsed += duration;
    });


    logo.getBoundingClientRect(); // Force reflow to apply the initial styles before starting the animation.

    let frameId;
    frameId = window.requestAnimationFrame(() => {
      paths.forEach((path) => {
        path.style.transition = `stroke-dashoffset ${path.dataset.drawDuration}ms linear ${path.dataset.drawDelay}ms`;
        path.style.strokeDashoffset = '0';
      });
    });

    const timeout = window.setTimeout(
      () => onAnimationComplete?.(),
      DRAW_DURATION + COMPLETE_HOLD
    );

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeout);
    };
  }, [onAnimationComplete]);

  useEffect(() => {
    if (!shouldExit) return undefined;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const timeout = window.setTimeout(onExit, reducedMotion ? 0 : 700);

    return () => window.clearTimeout(timeout);
  }, [shouldExit, onExit]);

  return (
    <div className={`marsali-loading-screen${shouldExit ? " is-exiting" : ""}`} aria-label="Carregando Marsali Tattoo">
      <svg
        ref={logoRef}
        className="marsali-loading-logo"
        viewBox="0 0 375 334"
        role="img"
        aria-label="Logo Marsali Tattoo"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform="translate(0 334) scale(0.1 -0.1)"
          fill="none"
          stroke="#DCBD24"
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M170 3035 c0 -41 5 -43 128 -47 59 -2 85 -7 92 -18 20 -33 22 -198 18 -1382 -4 -1087 -6 -1241 -19 -1254 -11 -10 -47 -17 -115 -22 l-99 -7 -3 -37 -3 -38 93 -2 c196 -3 523 4 531 12 5 4 7 20 5 36 -3 28 -5 29 -83 37 -99 11 -134 23 -140 51 -2 11 -6 456 -8 989 l-4 967 56 2 c53 2 52 2 -19 7 l-75 6 -3 313 -2 312 180 0 c99 0 180 4 180 9 0 5 -9 29 -20 55 l-21 46 -334 0 -335 0 0 -35z" />
          <path d="M2780 3038 c-11 -18 -20 -43 -20 -55 l0 -23 180 0 180 0 0 -315 0 -315 -80 0 -79 0 -12 43 c-45 169 -185 345 -323 407 -120 55 -203 71 -393 77 -115 4 -173 2 -173 -4 0 -7 67 -13 178 -16 183 -5 259 -18 353 -58 27 -12 49 -27 49 -34 0 -7 -8 -32 -19 -56 -10 -24 -38 -89 -61 -144 -23 -55 -73 -167 -110 -250 -61 -134 -180 -401 -215 -480 -8 -16 -55 -121 -105 -233 l-90 -202 2 -160 3 -159 40 87 c21 48 54 119 71 157 18 39 61 135 97 215 144 322 246 549 282 625 20 44 63 139 95 210 131 293 137 303 166 260 17 -25 18 -94 16 -1124 -1 -603 -6 -1110 -10 -1126 -8 -28 -13 -31 -73 -41 -35 -7 -80 -12 -100 -13 -43 -1 -62 -20 -57 -58 l3 -28 275 1 c151 1 353 2 448 3 l172 1 0 29 c0 17 -4 32 -8 35 -5 3 -51 10 -103 16 -55 7 -100 18 -109 26 -13 13 -15 174 -18 1309 -3 1498 -18 1328 118 1339 106 10 110 11 110 52 l0 34 -330 0 -330 0 -20 -32z" />
          <path d="M1231 2845 c-80 -12 -235 -65 -213 -73 6 -2 21 2 33 8 69 37 156 52 334 57 99 3 187 9 195 14 24 13 -254 9 -349 -6z" />
          <path d="M942 2733 c-78 -59 -158 -169 -202 -277 l-22 -55 50 -108 c28 -59 78 -172 111 -251 68 -157 131 -299 306 -687 64 -143 137 -307 161 -364 116 -273 247 -561 255 -561 5 0 9 205 9 479 0 416 -2 480 -15 485 -8 3 -15 12 -15 19 0 8 -30 79 -66 158 -326 710 -515 1141 -518 1176 0 13 -2 23 -2 23 -1 0 -24 -17 -52 -37z" />
        </g>
      </svg>

      <style>{`
        .marsali-loading-screen {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #000;
          opacity: 1;
          transition: opacity 700ms ease;
        }

        .marsali-loading-screen.is-exiting {
          opacity: 0;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .marsali-loading-screen {
            transition: none;
          }
        }

        .marsali-loading-logo {
          display: block;
          width: min(52vw, 290px);
          height: auto;
          overflow: visible;
        }

        .marsali-loading-logo path {
          opacity: 0;
        }

        @media (max-width: 600px) {
          .marsali-loading-logo {
            width: min(68vw, 250px);
          }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;
