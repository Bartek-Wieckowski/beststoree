import React from "react";
import { cn } from "@/lib/utils";
import CONTENT_PAGE from "@/lib/content-page";

export default function CheckoutSteps({ current = 0 }) {
  return (
    <div className="flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
      {[
        CONTENT_PAGE.COMPONENT.CHECKOUT_STEPS.userLogin,
        CONTENT_PAGE.COMPONENT.CHECKOUT_STEPS.shippingAddress,
        CONTENT_PAGE.COMPONENT.CHECKOUT_STEPS.paymentMethod,
        CONTENT_PAGE.COMPONENT.CHECKOUT_STEPS.placeOrder,
      ].map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-center text-sm",
              index === current ? "bg-secondary" : ""
            )}
          >
            {step}
          </div>
          {step !== CONTENT_PAGE.COMPONENT.CHECKOUT_STEPS.placeOrder && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
