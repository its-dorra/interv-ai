import UserAvatar from "@/features/users/components/user-avatar";
import { cn } from "@/lib/utils";
import { BrainCircuitIcon } from "lucide-react";

interface CondensedMessagesProps {
  messages: { isUser: boolean; content: string[] }[];
  user: { name: string; imageUrl: string };
  maxFft: number;
  className?: string;
}

export default function CondensedMessages({
  maxFft,
  messages,
  user,
  className,
}: CondensedMessagesProps) {
  console.dir({ maxFft, messages });
  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {messages.map((message, index) => {
        const shouldAnimate = index === messages.length - 1 && maxFft > 0;

        return (
          <div
            className={cn(
              "flex items-center gap-5 border pl-4 pr-6 py-4 rounded max-w-3/4 ",
              message.isUser ? "self-end" : "self-start"
            )}
            // biome-ignore lint/suspicious/noArrayIndexKey: <>
            key={index}
          >
            {message.isUser ? (
              <UserAvatar className="size-6 shrink-0" user={user} />
            ) : (
              <div className="relative">
                <div
                  className={cn(
                    "absolute inset-0 border-muted border-4 rounded-full",
                    shouldAnimate ? "animate-ping" : "hidden"
                  )}
                />
                <BrainCircuitIcon
                  className="size-6 relative shrink-0"
                  style={shouldAnimate ? { scale: maxFft / 8 + 1 } : undefined}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              {message.content.map((text, textIndex) => (
                <span
                  key={`${text}-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <>
                    textIndex
                  }`}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
