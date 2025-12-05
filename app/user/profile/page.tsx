import { Metadata } from "next";
import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccountDialog from "./DeleteAccountDialog";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: "Customer Profile",
};

export default async function ProfilePage() {
  return (
    <div className="max-w-md mx-auto space-y-8">
      <h2 className="h2-bold">{CONTENT_PAGE.PAGE.USER_PROFILE.title}</h2>
      <div className="space-y-4">
        <ProfileForm />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {CONTENT_PAGE.PAGE.USER_PROFILE.changePassword}
        </h3>
        <ChangePasswordForm />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {CONTENT_PAGE.PAGE.USER_PROFILE.deleteAccount}
        </h3>
        <DeleteAccountDialog />
      </div>
    </div>
  );
}
