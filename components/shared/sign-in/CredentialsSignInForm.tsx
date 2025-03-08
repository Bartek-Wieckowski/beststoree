'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CONTENT_PAGE from '@/lib/content-page';
import { signInDefaultValues } from '@/lib/constants';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import ROUTES from '@/lib/routes';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function CredentialsSignInForm() {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: '',
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || ROUTES.HOME;

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
          ? CONTENT_PAGE.BUTTON_CREDENTIALS_SIGN_IN.signing
          : CONTENT_PAGE.BUTTON_CREDENTIALS_SIGN_IN.signIn}
      </Button>
    );
  }
  
  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">
            {CONTENT_PAGE.SIGN_UP_PAGE_CREDENTIALS_FORM.email}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">
            {CONTENT_PAGE.SIGN_UP_PAGE_CREDENTIALS_FORM.password}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div>
          <SignInButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          {CONTENT_PAGE.SIGN_UP_PAGE_CREDENTIALS_FORM.text}{' '}
          <Link href={ROUTES.SIGN_UP} target="_self" className="link">
            {CONTENT_PAGE.SIGN_UP_PAGE_CREDENTIALS_FORM.signUp}
          </Link>
        </div>
      </div>
    </form>
  );
}
