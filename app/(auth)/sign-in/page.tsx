import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ROUTES from '@/lib/routes';
import CONTENT_PAGE from '@/lib/content-page';
import { CredentialsSignInForm } from '@/components/shared/sign-in/CredentialsSignInForm';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default async function SignInPage(props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    redirect(callbackUrl || ROUTES.HOME);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={ROUTES.HOME} className="flex-center">
            <Image
              src="/images/logo.png"
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
              data-testid="sign-in-logo"
            />
          </Link>
          <CardTitle className="text-center" data-testid="sign-in-title">
            {CONTENT_PAGE.SIGN_IN_PAGE.signIn}
          </CardTitle>
          <CardDescription
            className="text-center"
            data-testid="sign-in-description"
          >
            {CONTENT_PAGE.SIGN_IN_PAGE.signInToYourAccount}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
