# FU-DEVER Landing Page

The public web presence of FU-DEVER Club at FPT University Da Nang. It introduces the club, showcases projects and activities, and presents public member, alumni, resource, event, blog, Project Lab, and leaderboard information.

## Related services

| Service | Repository | Production |
| --- | --- | --- |
| Landing page | [fu-dever-landingpage](https://github.com/fudever-club/fu-dever-landingpage) | [Open](https://fu-dever-landingpage-v2.vercel.app) |
| Member portal | [dever-client](https://github.com/fudever-club/dever-client) | [Open](https://dever-client-sigma.vercel.app/vi/sign-in) |
| Admin dashboard | [dever-admin](https://github.com/fudever-club/dever-admin) | [Open](https://dever-admin-three.vercel.app/vi/sign-in) |
| Backend API | [dever-backend](https://github.com/fudever-club/dever-backend) | [Open](https://dever-backend-production.up.railway.app/health) |

## Experience principles

- Preserve DEVER blue (`#0066CC`) and the floating DEVER characters on the home hero.
- Use real API content or an explicit loading, empty, or error state—never fabricated public data.
- Use opaque public profile keys; do not expose member identifiers or sensitive contact information.
- Keep interactive content keyboard-accessible and responsive on desktop and mobile.

## Tech stack

Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Swiper, and React Three Fiber.

## Run locally

Requires Node.js 20+ and a running DEVER backend.

```bash
npm ci
npm run dev -- -p 3000
```

Create `.env.local` with the local service URLs:

```env
NEXT_PUBLIC_API_SERVER=http://localhost:5000
NEXT_PUBLIC_CLIENT_URL=http://localhost:3002
NEXT_PUBLIC_ADMIN_URL=http://localhost:3003
```

Open [http://localhost:3000](http://localhost:3000). If a running development server shows stale `/_next/static` assets after a build, stop it and start a fresh development process.

## Quality checks

```bash
npm run lint
npm run build
```

## Contributing

Use real club-provided media or component-native SVG/CSS visuals; do not add AI-generated imagery. Keep one clear primary action per decision area and validate loading, empty, error, success, and disabled states for every data-driven interaction.
