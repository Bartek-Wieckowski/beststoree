import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: "Unauthorized Access",
};

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-200px)] flex-col items-center justify-center space-y-4">
      <h1 className="h1-bold text-4xl">
        {CONTENT_PAGE.PAGE.UNAUTHORIZED.title}
      </h1>
      <p className="text-muted-foreground">
        {CONTENT_PAGE.PAGE.UNAUTHORIZED.text}
      </p>
      <Button asChild>
        <Link href={ROUTES.HOME}>
          {CONTENT_PAGE.PAGE.UNAUTHORIZED.returnHome}
        </Link>
      </Button>
    </div>
  );
}
