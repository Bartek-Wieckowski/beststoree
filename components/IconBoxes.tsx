import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import CONTENT_PAGE from "@/lib/content-page";

export default function IconBoxes() {
  return (
    <div className="wrapper">
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold">
              {CONTENT_PAGE.ICON_BOXES.freeShipping}
            </div>
            <div className="text-sm text-muted-foreground">
              {CONTENT_PAGE.ICON_BOXES.freeShippingDescription}
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign />
            <div className="text-sm font-bold">
              {CONTENT_PAGE.ICON_BOXES.moneyBackGuarantee}
            </div>
            <div className="text-sm text-muted-foreground">
              {CONTENT_PAGE.ICON_BOXES.moneyBackGuaranteeDescription}
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold">
              {CONTENT_PAGE.ICON_BOXES.flexiblePayment}
            </div>
            <div className="text-sm text-muted-foreground">
              {CONTENT_PAGE.ICON_BOXES.flexiblePaymentDescription}
            </div>
          </div>
          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">
              {CONTENT_PAGE.ICON_BOXES.support}
            </div>
            <div className="text-sm text-muted-foreground">
              {CONTENT_PAGE.ICON_BOXES.supportDescription}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
