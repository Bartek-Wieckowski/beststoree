import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";
import UpdateUserForm from "@/components/admin/UpdateUserForm";
import { requireAdmin } from "@/lib/admin-guard";
import CONTENT_PAGE from "@/lib/content-page";

export const metadata: Metadata = {
  title: "Update User",
};

export default async function AdminUserUpdatePage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  await requireAdmin();

  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">
        {CONTENT_PAGE.ADMIN_USERS_UPDATE_PAGE.updateUser}
      </h1>
      <UpdateUserForm user={user} />
    </div>
  );
}
