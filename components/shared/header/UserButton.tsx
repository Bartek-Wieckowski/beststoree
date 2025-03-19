import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export default async function UserButton() {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild data-testid="sign-in-button">
        <Link href={ROUTES.SIGN_IN}>
          <UserIcon /> {CONTENT_PAGE.HEADER.signIn}
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center">
          <Button
            data-testid="user-button"
            variant="ghost"
            className="relativee w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
          >
            {firstInitial}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div
              className="text-sm font-medium leading-none"
              data-testid="user-name"
            >
              {session.user?.name}
            </div>
            <div
              className="text-sm text-muted-foreground leading-none"
              data-testid="user-email"
            >
              {session.user?.email}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem className="p-0 mb-1">
          <form action={signOutUser} className="w-full">
            <Button
              data-testid="sign-out-button"
              className="w-full py-4 px-2 h-4 justify-start"
              variant="ghost"
            >
              Sign Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
