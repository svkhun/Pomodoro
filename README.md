# Festive Focus

A browser-local Pomodoro timer for Windows, macOS and mobile browsers. The Christmas countdown hangs above an original, code-drawn winter village. Its brass rim carries 72 lights that go dark as time passes. Cormorant Garamond and DM Sans are bundled locally, with Thai-capable system fallbacks.

## Run

Use Node.js 22.13+ or Node.js 24 and npm. In the project directory, run:

```powershell
npm install
npm run dev
```

Open the local address printed by Vite. Run `npm run build` for TypeScript checks and a production bundle in `dist/`. Run `npm run preview` to serve that bundle and `npm test` for the clock regression tests.

## Christmas concepts

| Concept | Focus | Short break | Long break | Build complexity |
| --- | --- | --- | --- | --- |
| Heirloom ornament | Read the countdown in ruby glass as perimeter lights fade over a snowy village | Warm rose lighting and livelier flakes | Cool blue-green sky and slower snowfall | Moderate. One readable focal point across screen sizes |
| Midnight railway | A station clock counts down as a train approaches | Steam drifts past the platform lamps | The train stops under an illuminated tree | High. Moving scenery needs careful framing on narrow screens |
| Clockwork skating rink | Read time on the plinth as the rink turns | Skaters trace paths in the ice | The music box reveals a second village tier | High. Choreography and depth require additional animation |

The ornament was selected because it keeps time and progress together, with the village free to move gently behind the controls.

## Using the timer

- Start with 25 minutes of focus, take a 5-minute short break, and earn a 15-minute long break after every fourth completed focus. Settings accepts whole minutes from 1 through 180 for each phase.
- Space starts or pauses, R resets, S skips, and T opens themes. When a button has keyboard focus, Space activates that button. Escape closes a panel and restores focus to its opener.
- Switching mode or resetting starts a fresh, paused interval. Skipping a focus moves to a short break without earning credit. Auto-start applies to the next phase after completion or a skip. A duration edit applies to a fresh timer immediately and to running or paused work on the next reset or phase.
- Sound begins after a user gesture. Choose the volume or mute in Settings. Browser notifications request permission only when selected and depend on browser support. If the page is suspended or closed, callbacks resume when it next runs.
- Theme choices and stats are specific to the browser and origin. Clearing site storage clears them.

## Clock and persistence

`src/timer.ts` contains pure transitions. Starting a phase stores its absolute completion timestamp. Each display refresh reads the wall clock, subtracts it from the deadline, and rounds the remaining seconds up. A pause stores the exact millisecond remainder. Refresh frequency affects animation smoothness only. A manual change to the device clock can change the remaining time.

When a deadline has passed, the timer records the completion against its local calendar date. With auto-start enabled, each following deadline is anchored to the previous one until the clock catches up. This includes time spent away from the app. With auto-start disabled, catch-up stops at the next ready phase. Completed focus minutes use the duration of the completed interval. The timer snapshot, cycle position, daily totals and preferences survive a reload via localStorage. Storage events keep open tabs in sync.

## Theme registry

`src/themes/types.ts` describes the contract. Every theme supplies CSS tokens, a headline font, a phase-specific light color and particle speed, a Canvas particle palette, a Web Audio note sequence, a scene component and a timer illustration. An optional canopy draws above the scene. The shared controls and accessible time readout stay usable across all themes.

The registry discovers every `src/themes/*/theme.ts` with Vite's eager glob. Auto by date compares the local device date with each predicate in display order. The bundled calendar uses December for Christmas, April 13–15 for Songkran, and a year-specific November entry for Loy Krathong. Update the lunar festival entry for each supported year. Christmas is the default outside the configured windows. A manual choice takes precedence.

### Add a festival

1. Create a folder in `src/themes/`, for example `sakura/`, and copy the small `songkran/theme.ts` descriptor into it.
2. Give the descriptor a unique ID, name, scene title, order and date predicate. Choose an existing icon or add a matching outline to `src/icons.tsx`.
3. Add your scene and dial as React components in the folder, then reference them as `Scene` and `Dial`. The dial accepts a remaining fraction in `progress` (1 to 0). Use a 360 × 350 viewBox and leave space for the shared digits at the center. Prefix SVG definition IDs to avoid collisions.
4. Set colors, typography, three phase moods, a particle kind and count, and bell notes in hertz. Existing particle kinds cover snow, floating embers and water. A new physical behavior can extend `Atmosphere.tsx`.
5. Export the descriptor as the default with `satisfies Theme`. It appears in the picker automatically. Select it, run through the three phases and check reduced-motion mode and a 360px viewport.

Theme changes use a circular View Transition when supported and a short fade otherwise. Reduced-motion preferences disable reveals, particles, parallax and animated digits. The Canvas pauses in hidden tabs and caps particle count and backing resolution. Device tilt reacts where the browser exposes orientation events, with pointer parallax on desktop.

## Further festivals

- **Halloween** — Read the time through a lantern carved into a pumpkin as candlelight retreats along the rim.
- **Chinese New Year** — A paper-cut dragon winds around a moon gate and lights a lantern for each completed focus.
- **Sakura** — A petal-shaped dial hangs above a stream, releasing a blossom at each progress milestone.
- **Diwali** — Lamps around a rangoli light the path to the next break.
- **Valentine’s Day** — Read the countdown on a folded paper heart that opens when the session ends.
