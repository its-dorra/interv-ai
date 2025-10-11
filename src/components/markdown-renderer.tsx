import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps extends ComponentProps<typeof ReactMarkdown> {
  className?: string;
}

export default function MarkdownRenderer({
  className,
  ...props
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "max-w-none prose prose-neutral dark:prose-invert font-sans",
        className
      )}
    >
      <ReactMarkdown {...props} />
    </div>
  );
}
