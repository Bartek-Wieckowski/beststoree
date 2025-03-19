import { render, RenderResult, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SignInPage from '@/app/(auth)/sign-in/page';
import CONTENT_PAGE from '@/lib/content-page';

vi.mock('@/auth', () => ({
  auth: vi.fn(() => Promise.resolve(null)),
}));

// vi.mock('@/components/shared/sign-in/CredentialsSignInForm', () => ({
//   CredentialsSignInForm: () => (
//     <div>
//       <div>{CONTENT_PAGE.SIGN_UP_PAGE_CREDENTIALS_FORM.email}</div>
//       <div>{CONTENT_PAGE.SIGN_UP_PAGE_CREDENTIALS_FORM.password}</div>
//     </div>
//   )
// }));

async function renderSignInPage(): Promise<RenderResult> {
  const Component = await SignInPage({
    searchParams: Promise.resolve({ callbackUrl: '/' }),
  });
  return render(Component);
}

describe.skip('SignInPage()', () => {
  it('should show sign in title', async () => {
    await renderSignInPage();

    await waitFor(() => {
      expect(screen.getByTestId('sign-in-title')).toBeInTheDocument();
      expect(screen.getByTestId('sign-in-title')).toHaveTextContent('Sign In');
    });
  });

  it('should render credentials form component', async () => {
    await renderSignInPage();
    expect(
      screen.getByText(CONTENT_PAGE.SIGN_IN_PAGE_CREDENTIALS_FORM.email)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.SIGN_IN_PAGE_CREDENTIALS_FORM.password)
    ).toBeInTheDocument();
  });
});
