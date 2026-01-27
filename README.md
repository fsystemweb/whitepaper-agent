# Modern AI Chatbot

A production-ready chatbot application built with Next.js 14, shadcn/ui, and LangChain integration.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![LangChain](https://img.shields.io/badge/LangChain-🦜-green)

## Features

- 🚀 **Next.js 14** with App Router and Server Components
- 💬 **Streaming responses** via Server-Sent Events (SSE)
- 🎨 **shadcn/ui** components for a polished, accessible UI
- 🤖 **LangChain** integration with ChatGPT API
- 📝 **Decoupled prompts** - update prompts without touching code
- ⌨️ **Full keyboard navigation** support
- 📱 **Responsive design** for all screen sizes

## Project Structure

```
src/
├── app/
│   ├── api/chat/          # Streaming chat API endpoint
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main chat page
├── components/
│   ├── chat/              # Chat-specific components
│   │   ├── chat-container.tsx
│   │   ├── chat-input.tsx
│   │   ├── message-bubble.tsx
│   │   ├── message-list.tsx
│   │   └── typing-indicator.tsx
│   └── ui/                # shadcn/ui base components
├── hooks/
│   └── use-chat.ts        # Chat state management hook
└── lib/
    ├── config/            # Environment configuration
    ├── langchain/         # LangChain client and services
    │   ├── client.ts      # ChatOpenAI singleton
    │   ├── chat-service.ts
    │   └── types.ts
    └── prompts/           # Decoupled prompt management
        ├── system-prompts.ts
        └── templates.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- OpenAI API key

### Installation

1. **Clone and install dependencies:**

   ```bash
   cd chatbot-app
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your OpenAI API key:

   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `OPENAI_MODEL` | Model to use | `gpt-4o` |
| `OPENAI_TEMPERATURE` | Response creativity (0-1) | `0.2` |
| `OPENAI_MAX_TOKENS` | Maximum response length | `2048` |

### Customizing Prompts

Prompts are decoupled in `src/lib/prompts/system-prompts.ts`. To add a new prompt:

```typescript
export const SYSTEM_PROMPTS = {
  // ... existing prompts
  
  custom: {
    version: '1.0.0',
    content: `Your custom system prompt here...`,
  },
} as const;
```

Then use it in the ChatContainer:

```tsx
<ChatContainer systemPromptKey="custom" />
```

## Best Practices Applied

This project follows best practices from:

- **[React Best Practices](https://vercel.com/blog)** - Parallel fetching, Suspense boundaries, memoization
- **AI Product Patterns** - Streaming, prompt versioning, structured validation
- **UI/UX Guidelines** - Touch targets, color contrast, loading states

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
