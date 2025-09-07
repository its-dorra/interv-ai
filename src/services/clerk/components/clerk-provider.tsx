import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";

export default function ClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OriginalClerkProvider>{children}</OriginalClerkProvider>;
}
