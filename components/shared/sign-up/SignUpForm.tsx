"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { SignUpActionResponse } from "@/types";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";

const initialState: SignUpActionResponse = {
  success: false,
  fieldErrors: null,
  message: "",
  generalError: null,
  prismaError: null,
  inputs: {
    name: "",
    email: "",
  },
};

export default function SignUpForm() {
  const [data, action] = useActionState(signUpUser, initialState);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || ROUTES.HOME;

  function SignUpButton() {
    const { pending } = useFormStatus();

    return (
      <Button
        disabled={pending}
        className="w-full"
        variant="default"
        data-testid="sign-up-button"
      >
        {pending
          ? CONTENT_PAGE.COMPONENT.BUTTON_SIGN_UP.submitting
          : CONTENT_PAGE.COMPONENT.BUTTON_SIGN_UP.signUp}
      </Button>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        {data.success && (
          <div className="text-sm text-green-500 text-center">
            {data.message}
          </div>
        )}

        <div>
          <Label htmlFor="name">{CONTENT_PAGE.GLOBAL.name}</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={data.inputs.name as string}
          />
          {data.fieldErrors?.name && (
            <p className="text-sm text-red-500 mt-1">
              {data.fieldErrors.name[0]}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="email">{CONTENT_PAGE.GLOBAL.email}</Label>
          <Input
            id="email"
            name="email"
            type="text"
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
          <Input id="password" name="password" type="password" />
          {data.fieldErrors?.password && (
            <p className="text-sm text-red-500 mt-1">
              {data.fieldErrors.password[0]}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="confirmPassword">
            {CONTENT_PAGE.GLOBAL.confirmPassword}
          </Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" />
          {data.fieldErrors?.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {data.fieldErrors.confirmPassword[0]}
            </p>
          )}
        </div>

        {data.prismaError && (
          <div className="text-sm text-red-500 text-center">
            {data.prismaError.message}
          </div>
        )}

        {data.generalError && (
          <div className="text-sm text-red-500 text-center">
            {data.generalError}
          </div>
        )}

        <div>
          <SignUpButton />
        </div>

        <div className="text-sm text-center text-muted-foreground">
          {CONTENT_PAGE.COMPONENT.SIGN_UP_FORM.alreadyHaveAccount}{" "}
          <Link
            href={ROUTES.SIGN_IN}
            target="_self"
            className="link"
            data-testid="sign-up-sign-in-link"
          >
            {CONTENT_PAGE.GLOBAL.signIn}
          </Link>
        </div>
      </div>
    </form>
  );
}
