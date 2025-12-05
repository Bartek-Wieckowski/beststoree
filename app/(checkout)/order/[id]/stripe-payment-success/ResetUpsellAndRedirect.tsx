"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ROUTES from "@/lib/routes";

const UPSELL_DISMISSED_KEY = "upsell_dismissed";

export default function ResetUpsellAndRedirect({
  orderId,
}: {
  orderId: string;
}) {
  const router = useRouter();

  useEffect(() => {
    // Reset localStorage for upsell when order is paid
    if (typeof window !== "undefined") {
      localStorage.removeItem(UPSELL_DISMISSED_KEY);
    }
    // Redirect to order page
    router.push(ROUTES.ORDER(orderId));
  }, [orderId, router]);

  return null;
}
