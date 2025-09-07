import { Loader2Icon } from "lucide-react";

export default function AppLoading() {
  return (
    <div className="h-screen-header flex items-center justify-center">
      <Loader2Icon className="size-24 text-primary animate-spin" />
    </div>
  );
}
