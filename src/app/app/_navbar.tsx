"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  BookOpenIcon,
  BrainCircuitIcon,
  FileSlidersIcon,
  LogOut,
  SpeechIcon,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import UserAvatar from "@/features/users/components/user-avatar";
import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "interviews", label: "Interviews", Icon: SpeechIcon },
  { href: "questions", label: "Questions", Icon: BookOpenIcon },
  { href: "resume", label: "Resume", Icon: FileSlidersIcon },
] as const;

export default function NavBar({
  user,
}: {
  user: { name: string; imageUrl: string };
}) {
  const { openUserProfile, signOut } = useClerk();
  const { id: jobInfoId } = useParams();
  const pathname = usePathname();

  console.log({ pathname, jobInfoId });

  return (
    <header className="h-header border-b">
      <nav className="container flex h-full items-center justify-between">
        <Link href="/app" className="flex items-center space-x-2">
          <BrainCircuitIcon className="size-8 text-primary" />
          <span className="font-semibold">IntervAI</span>
        </Link>

        <div className="flex items-center space-x-4">
          {typeof jobInfoId === "string" &&
            navLinks.map((link) => {
              const hrefPath =
                `/app/job-infos/${jobInfoId}/${link.href}` as const;

              const isActive = pathname === hrefPath;

              return (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  key={link.label}
                  asChild
                  className="max-sm:hidden"
                >
                  <Link href={hrefPath}>
                    <link.Icon />
                    {link.label}
                  </Link>
                </Button>
              );
            })}

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
