"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CONTENT_PAGE from "@/lib/content-page";
// import { signInDefaultValues } from '@/lib/constants';
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import ROUTES from "@/lib/routes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SignInActionResponse } from "@/types";

export function CredentialsSignInForm() {
  const initialState: SignInActionResponse = {
    success: false,
    message: "",
    fieldErrors: null,
    generalError: null,
    prismaError: null,
    inputs: { email: "" },
  };

  const [data, action] = useActionState(signInWithCredentials, initialState);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || ROUTES.HOME;

  function SignInButton() {
    const { pending } = useFormStatus();

    return (
      <Button
        disabled={pending}
        className="w-full"
        variant="default"
        data-testid="sign-in-button"
      >
        {pending
          ? CONTENT_PAGE.COMPONENT.BUTTON_SIGN_IN.signing
          : CONTENT_PAGE.GLOBAL.signIn}
      </Button>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        {data?.success && (
          <div className="text-sm text-green-500 text-center">
            {data.message}
          </div>
        )}
        <div>
          <Label htmlFor="email">{CONTENT_PAGE.GLOBAL.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={data.inputs.email as string}
          />
          {data.fieldErrors?.email && (
            <p className="text-sm text-red-500 mt-1">
              {data.fieldErrors.email[0]}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="password">{CONTENT_PAGE.GLOBAL.password}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            // defaultValue={signInDefaultValues.password}
          />
          {data.fieldErrors?.password && (
            <p className="text-sm text-red-500 mt-1">
              {data.fieldErrors.password[0]}
            </p>
          )}
        </div>
        <div>
          <SignInButton />
        </div>

        {data.generalError && (
          <div className="text-sm text-red-500 text-center">
            {data.generalError}
          </div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          {CONTENT_PAGE.COMPONENT.SIGN_IN_FORM.text}{" "}
          <Link
            href={ROUTES.SIGN_UP}
            target="_self"
            className="link"
            data-testid="sign-in-sign-up-link"
          >
            {CONTENT_PAGE.GLOBAL.signUp}
          </Link>
        </div>
      </div>
    </form>
  );
}
