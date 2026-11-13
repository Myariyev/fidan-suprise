# For Fidan 💗

A personalized interactive adventure from Mehdi: six scenes, a runaway button, a love meter, a breaking card, and a cosmic finale. All website text is in Russian.

## Getting started

Install Node.js 20.19+ (a current LTS release is recommended), then run these commands in this folder:

```sh
npm install
npm run dev
```

Open the URL printed by Vite. To view the website on your phone, connect both devices to the same network and use Vite's Network URL.

## Build and deployment

```sh
npm run build
npm run preview
```

Upload the contents of `dist` to a static hosting service, such as Netlify, Vercel, or GitHub Pages. No backend or environment variables are required. The `base: './'` setting supports deployment in a subdirectory.

## Project structure

- `src/main.jsx` — scenes and reusable components, Motion animations, button behavior, and state reset.
- `src/styles.css` — responsive styling, Tailwind, CSS shard animations, and reduced-motion support.
- `vite.config.js` — React and Tailwind CSS configuration.

The answer entered in the first scene exists only in page memory; it is never sent or saved. Google Fonts requires an internet connection; system fonts are used as a fallback. All main controls support keyboard interaction. The slider supports the arrow keys and End; the No button responds to clicks and taps.

## Manual testing

1. Submit any answer (or leave it empty), wait for the joke, and continue.
2. Click the No button 10 times: it stays the same size for the first five attempts, then shrinks and disappears. The Yes button remains accessible.
3. Click Yes and wait for the next question to appear.
4. Check the slider reactions at 20, 40, 60, 80, and 99. At 100, the card cracks and breaks apart before the cosmic scene appears.
5. Wait for the text, open the final surprise, and open the letter. Restarting resets the answer, attempt count, and slider value.
6. Repeat on a narrow screen and with your system's reduced-motion setting enabled.

## Quick launch on this computer

Double-click `start.cmd`. It finds an installed Node.js runtime or the portable version prepared for this project and starts Vite.

## Automated tests

```sh
npx playwright install chromium
npm test
```

The tests cover the full journey at 1440 × 1000 and 375 × 812: button boundaries and movement, ten No attempts, the slider, card breaking, the finale, the letter, restart, and the absence of JavaScript errors. A separate test checks the normal animation sequence; the other scenarios use reduced motion.
