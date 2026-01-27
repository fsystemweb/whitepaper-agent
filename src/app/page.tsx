import { ChatContainer } from "@/components/chat";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ChatContainer systemPromptKey="default" />
    </main>
  );
}
