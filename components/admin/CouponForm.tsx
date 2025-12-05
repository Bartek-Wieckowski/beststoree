"use client";

import React from "react";
import { useToast } from "@/hooks/use-toast";
import { insertCouponSchema, updateCouponSchema } from "@/lib/validators";
import {
  dateToLocalDateTimeString,
  localDateTimeStringToDate,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, Resolver } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createCoupon, updateCoupon } from "@/lib/actions/coupon.actions";
import ROUTES from "@/lib/routes";
import { Checkbox } from "../ui/checkbox";
import CONTENT_PAGE from "@/lib/content-page";
import { Coupon } from "@/types";

export default function CouponForm({
  type,
  coupon,
  couponId,
}: {
  type: "Create" | "Update";
  coupon?: Coupon;
  couponId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  type FormData = z.output<typeof insertCouponSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(insertCouponSchema) as unknown as Resolver<FormData>,
    defaultValues: coupon
      ? {
          code: coupon.code || "",
          discountPercentage: Number(coupon.discountPercentage) || 0,
          startDate: coupon.startDate ? new Date(coupon.startDate) : new Date(),
          endDate: coupon.endDate ? new Date(coupon.endDate) : new Date(),
          isEnabled: coupon.isEnabled ?? true,
        }
      : {
          code: "",
          discountPercentage: 0,
          startDate: new Date(),
          endDate: new Date(),
          isEnabled: true,
        },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    // On Create
    if (type === "Create") {
      const parsedValues = insertCouponSchema.parse(values);
      const res = await createCoupon(parsedValues);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message as string,
        });
      } else {
        toast({
          description: res.message as string,
        });
        router.push(ROUTES.ADMIN_COUPONS);
      }
      return;
    }

    // On Update
    if (type === "Update") {
      const idToUse = couponId || coupon?.id;

      if (!idToUse || typeof idToUse !== "string" || idToUse.trim() === "") {
        toast({
          variant: "destructive",
          description: CONTENT_PAGE.PAGE.ADMIN_COUPONS.couponIdMissing,
        });
        return;
      }

      const updateData: z.infer<typeof updateCouponSchema> = {
        id: idToUse.trim(),
        code: values.code.trim(),
        discountPercentage: values.discountPercentage,
        startDate:
          values.startDate instanceof Date
            ? values.startDate
            : new Date(values.startDate),
        endDate:
          values.endDate instanceof Date
            ? values.endDate
            : new Date(values.endDate),
        isEnabled: values.isEnabled ?? true,
      };

      const parsedUpdateValues = updateCouponSchema.parse(updateData);
      const res = await updateCoupon(parsedUpdateValues);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message as string,
        });
      } else {
        toast({
          description: res.message as string,
        });
        router.push(ROUTES.ADMIN_COUPONS);
      }
    }
  };

  const onError = (errors: Record<string, { message?: string }>) => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message)
      .filter(Boolean)
      .join(", ");

    toast({
      variant: "destructive",
      description: errorMessages || CONTENT_PAGE.GLOBAL.pleaseFixFormErrors,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{CONTENT_PAGE.PAGE.ADMIN_COUPONS.code}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="SUMMER2024"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {CONTENT_PAGE.PAGE.ADMIN_COUPONS.discountPercentage}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...field}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  placeholder="10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{CONTENT_PAGE.PAGE.ADMIN_COUPONS.startDate}</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={
                    field.value
                      ? dateToLocalDateTimeString(
                          field.value instanceof Date
                            ? field.value
                            : new Date(field.value)
                        )
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(
                      value ? localDateTimeStringToDate(value) : new Date()
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{CONTENT_PAGE.PAGE.ADMIN_COUPONS.endDate}</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={
                    field.value
                      ? dateToLocalDateTimeString(
                          field.value instanceof Date
                            ? field.value
                            : new Date(field.value)
                        )
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(
                      value ? localDateTimeStringToDate(value) : new Date()
                    );
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {CONTENT_PAGE.PAGE.ADMIN_COUPONS.isEnabled}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? CONTENT_PAGE.GLOBAL.saving
              : type === "Create"
                ? CONTENT_PAGE.PAGE.ADMIN_COUPONS.createCoupon
                : CONTENT_PAGE.PAGE.ADMIN_COUPONS.updateCoupon}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(ROUTES.ADMIN_COUPONS)}
          >
            {CONTENT_PAGE.GLOBAL.cancel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
