import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ROUTES from "./routes";

export async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect(ROUTES.UNAUTHORIZED);
  }

  return session;
}
