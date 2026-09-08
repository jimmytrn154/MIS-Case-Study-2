import { Sparkles } from "lucide-react";
import ChatInterface from "@/components/assistant/ChatInterface";

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="hidden items-center gap-3 sm:flex">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Sparkles className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">
            FreshWave Assistant
          </h1>
          <p className="text-xs text-zinc-500">
            Grounded in Riverside&apos;s live inventory and promotions
          </p>
        </div>
      </div>

      <ChatInterface />
    </div>
  );
}
