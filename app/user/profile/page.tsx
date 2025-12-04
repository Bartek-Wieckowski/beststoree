import { Metadata } from "next";
import ProfileForm from "./ProfileForm";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: "Customer Profile",
};

export default async function ProfilePage() {
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="h2-bold">{CONTENT_PAGE.PAGE.USER_PROFILE.title}</h2>
      <ProfileForm />
    </div>
  );
}
