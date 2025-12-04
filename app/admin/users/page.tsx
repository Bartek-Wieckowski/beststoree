import { Metadata } from "next";
import { getAllUsers, deleteUser } from "@/lib/actions/user.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Pagination from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import DeleteDialog from "@/components/DeleteDialog";
import { requireAdmin } from "@/lib/admin-guard";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";

export const metadata: Metadata = {
  title: "Admin Users",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string; query: string }>;
}) {
  await requireAdmin();

  const { page = "1", query: searchText } = await searchParams;

  const users = await getAllUsers({ page: Number(page), query: searchText });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">{CONTENT_PAGE.PAGE.ADMIN_USERS.users}</h1>
        {searchText && (
          <div>
            {CONTENT_PAGE.GLOBAL.filteredBy} <i>&quot;{searchText}&quot;</i>{" "}
            <Link href={ROUTES.ADMIN_USERS}>
              <Button variant="outline" size="sm">
                {CONTENT_PAGE.GLOBAL.removeFilter}
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{CONTENT_PAGE.GLOBAL.id}</TableHead>
              <TableHead>{CONTENT_PAGE.GLOBAL.name}</TableHead>
              <TableHead>{CONTENT_PAGE.GLOBAL.email}</TableHead>
              <TableHead>{CONTENT_PAGE.GLOBAL.role}</TableHead>
              <TableHead>{CONTENT_PAGE.GLOBAL.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === "user" ? (
                    <Badge variant="secondary">
                      {CONTENT_PAGE.GLOBAL.user}
                    </Badge>
                  ) : (
                    <Badge variant="default">{CONTENT_PAGE.GLOBAL.admin}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={ROUTES.ADMIN_USERS_EDIT(user.id)}>
                      {CONTENT_PAGE.GLOBAL.edit}
                    </Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
        )}
      </div>
    </div>
  );
}
