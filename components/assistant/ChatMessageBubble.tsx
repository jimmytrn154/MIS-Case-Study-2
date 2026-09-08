import { Sparkles, AlertCircle } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

export default function ChatMessageBubble({
  message,
  isError = false,
}: {
  message: ChatMessage;
  isError?: boolean;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-2 text-sm text-white">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isError ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {isError ? (
          <AlertCircle className="h-4 w-4" strokeWidth={1.75} />
        ) : (
          <Sparkles className="h-4 w-4" strokeWidth={1.75} />
        )}
      </span>
      <p
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-bl-sm px-4 py-2 text-sm ${
          isError
            ? "bg-red-50 text-red-700"
            : "bg-zinc-100 text-zinc-800"
        }`}
      >
        {message.content}
      </p>
    </div>
  );
}
