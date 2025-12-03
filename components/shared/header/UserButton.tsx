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
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            data-testid="user-button"
            variant="ghost"
            size="icon"
            className="relative overflow-visible rounded-full flex items-center justify-center bg-gray-200 dark:text-stone-900 dark:hover:text-white outline-none focus:!outline-none focus-visible:!outline-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 active:!outline-none"
          >
            {firstInitial}
          </Button>
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

          <DropdownMenuItem>
            <Link href={ROUTES.USER_PROFILE} className="w-full">
              {CONTENT_PAGE.USER_BUTTON.userProfile}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={ROUTES.USER_ORDERS} className="w-full">
              {CONTENT_PAGE.USER_BUTTON.orderHistory}
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === "admin" && (
            <DropdownMenuItem>
              <Link href={ROUTES.ADMIN_OVERVIEW} className="w-full">
                {CONTENT_PAGE.USER_BUTTON.admin}
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                data-testid="sign-out-button"
                variant="ghost"
              >
                {CONTENT_PAGE.USER_BUTTON.signOut}
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
