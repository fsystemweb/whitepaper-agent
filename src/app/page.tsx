import { ChatContainer } from "@/components/chat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-4 md:p-8">
      <ChatContainer systemPromptKey="default" />
    </main>
  );
}
