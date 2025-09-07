"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { BrainCircuitIcon, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";

export default function NavBar({
  user,
}: {
  user: { name: string; imageUrl: string };
}) {
  const { openUserProfile, signOut } = useClerk();

  return (
    <header className="h-header border-b">
      <nav className="container flex h-full items-center justify-between">
        <Link href="/app" className="flex items-center space-x-2">
          <BrainCircuitIcon className="size-8 text-primary" />
          <span className="font-semibold">Meet AI</span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => openUserProfile()}>
                <User className="mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
