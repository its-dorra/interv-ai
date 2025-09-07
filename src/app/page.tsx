import { ThemeToggle } from "@/components/theme-toggle";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <div className="text-4xl font-bold text-green-400">Hi there</div>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
}
