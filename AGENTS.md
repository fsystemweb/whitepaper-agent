# AGENTS.md

Chat web app where a LangChain agent researches scientific papers on Arxiv and answers in the user's language (English or Spanish), streaming replies over SSE.

## Commands
- Install: `npm install`
- Dev server (`http://localhost:3000`): `npm run dev`
- Build: `npm run build`; serve the build: `npm run start`
- Lint: `npm run lint`
- Tests: none configured yet

## Conventions
- Next.js 16 (App Router), React 19, TypeScript 5, Tailwind 4, shadcn/ui (`components.json`), LangChain with OpenAI, npm (`package-lock.json`). The README still says Next.js 14; trust `package.json`.
- `src/app/api/chat/route.ts`: streaming chat endpoint. `src/app/page.tsx`: main chat page.
- `src/components/chat/`: chat UI. `src/components/ui/`: shadcn/ui primitives. `src/components/providers/`: app providers.
- `src/hooks/use-chat.ts` and `use-chat-history.ts`: chat state; history is kept in browser Local Storage.
- `src/lib/langchain/`: `client.ts` (model), `chat-service.ts`, `tools.ts` (Arxiv tool).
- `src/lib/prompts/`: system prompts and templates, kept apart from the code. Edit prompts there.
- `src/lib/config/index.ts`: reads env vars. The README documents `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_TEMPERATURE` and `OPENAI_MAX_TOKENS`, set in `.env.local`. There is no example env file.
- `src/lib/i18n.ts` loads `locales/en.json` and `locales/es.json`; add UI strings to both.
- `docs/` has architecture notes. `.agent/skills/` holds helper skills for other agents.

## Boundaries
- Always: add UI strings to both `locales/en.json` and `locales/es.json`.
- Ask first: adding a dependency, changing the default OpenAI model or prompts in `src/lib/prompts/`, changing the `/api/chat` stream format.
- Never: commit secrets or read `.env` files.
