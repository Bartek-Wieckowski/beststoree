"use client";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import CONTENT_PAGE from "@/lib/content-page";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.png"
        width={48}
        height={48}
        alt={`${APP_NAME} logo`}
        priority={true}
      />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4" data-testid="not-found-heading">
          {CONTENT_PAGE.PAGE.NOT_FOUND.pageNotFound}
        </h1>
        <p className="text-destructive">
          {CONTENT_PAGE.PAGE.NOT_FOUND.couldNotFindRequestedPage}
        </p>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => (window.location.href = "/")}
          data-testid="back-to-home"
        >
          {CONTENT_PAGE.PAGE.NOT_FOUND.backToHome}
        </Button>
      </div>
    </div>
  );
}
