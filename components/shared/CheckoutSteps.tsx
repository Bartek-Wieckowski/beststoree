"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { User, MapPin, CreditCard, ShoppingCart, Check } from "lucide-react";

const steps = [
  {
    label: CONTENT_PAGE.COMPONENT.CHECKOUT_STEPS.userLogin,
    route: ROUTES.SIGN_IN,
    icon: User,
  },
  {
    label: CONTENT_PAGE.COMPONENT.CHECKOUT_STEPS.shippingAddress,
    route: ROUTES.SHIPPING_ADDRESS,
    icon: MapPin,
  },
  {
    label: CONTENT_PAGE.COMPONENT.CHECKOUT_STEPS.paymentMethod,
    route: ROUTES.PAYMENT_METHOD,
    icon: CreditCard,
  },
  {
    label: CONTENT_PAGE.COMPONENT.CHECKOUT_STEPS.placeOrder,
    route: ROUTES.PLACE_ORDER,
    icon: ShoppingCart,
  },
];

export default function CheckoutSteps({ current = 0 }) {
  return (
    <div className="mb-10 w-full">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between space-x-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === current;
          const isCompleted = index < current;
          // Only allow going back, but not from first step (User Login)
          const isClickable = index < current && index > 0;

          const StepContent = (
            <>
              <div
                className={cn(
                  "flex items-center gap-2 p-2 px-4 rounded-full text-center text-sm transition-colors",
                  isActive && "bg-primary text-primary-foreground font-medium",
                  isCompleted && !isActive && "bg-muted opacity-75",
                  !isActive && !isCompleted && "bg-muted/50",
                  isClickable && "cursor-pointer hover:bg-secondary/80"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span>{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    isCompleted ? "bg-primary" : "bg-gray-300"
                  )}
                />
              )}
            </>
          );

          if (isClickable) {
            return (
              <React.Fragment key={step.route}>
                <Link href={step.route} className="flex items-center flex-1">
                  {StepContent}
                </Link>
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={step.route}>
              <div className="flex items-center flex-1">{StepContent}</div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile View - Simplified Progress */}
      <div className="md:hidden w-full">
        {/* Current Step Display */}
        <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border-2",
                "bg-primary border-primary text-primary-foreground"
              )}
            >
              <span className="text-lg font-bold">{current + 1}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Step {current + 1} of {steps.length}
              </p>
              <p className="text-sm font-medium">{steps[current].label}</p>
            </div>
          </div>
          {current > 0 && (
            <Link
              href={steps[current - 1].route}
              className="text-sm text-primary hover:underline"
            >
              Back
            </Link>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 rounded-full"
            style={{
              width: `${((current + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mt-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === current;
            const isCompleted = index < current;
            const isClickable = index < current && index > 0;

            const StepContent = (
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && !isActive && "bg-primary/30 text-primary",
                    !isActive && !isCompleted && "bg-gray-200 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <span className="text-xs">✓</span>
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </div>
              </div>
            );

            if (isClickable) {
              return (
                <Link
                  href={step.route}
                  key={step.route}
                  className="flex flex-col items-center"
                >
                  {StepContent}
                </Link>
              );
            }

            return <div key={step.route}>{StepContent}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
