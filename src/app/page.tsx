import { ThemeToggle } from "@/components/theme-toggle";
import PricingTable from "@/services/clerk/components/pricing-table";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <SignedIn>
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <UserButton />
        <ThemeToggle />
      </div>

      <PricingTable />
    </div>
  );
}
