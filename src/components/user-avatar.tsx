import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar({
  user,
  ...props
}: {
  user: { imageUrl: string; name: string };
} & React.ComponentProps<typeof Avatar>) {
  return (
    <Avatar {...props}>
      <AvatarImage src={user.imageUrl} alt={user.name ?? ""} />
      <AvatarFallback className="uppercase">
        {user.name
          .split(" ")
          .slice(0, 2)
          .map((s) => s[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
