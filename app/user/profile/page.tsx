import { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ProfileForm from "./ProfileForm";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: "Customer Profile",
};

export default async function ProfilePage() {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="h2-bold">{CONTENT_PAGE.USER_PROFILE_PAGE.title}</h2>
        <ProfileForm />
      </div>
    </SessionProvider>
  );
}
