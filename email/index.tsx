import { Resend } from "resend";
import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";
import { Order } from "@/types";
import dotenv from "dotenv";
dotenv.config();

import PurchaseReceiptEmail from "./PurchaseReceipt";
import CONTENT_PAGE from "@/lib/content-page";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `${CONTENT_PAGE.COMPONENT.PURCHASE_RECEIPT.orderConfirmation} ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  });
};
