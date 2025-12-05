"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUpsellSchema } from "@/lib/validators";
import { Upsell } from "@/types";
import { setUpsell, clearUpsell } from "@/lib/actions/upsell.actions";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import CONTENT_PAGE from "@/lib/content-page";

export default function UpsellForm({
  products,
  currentUpsell,
}: {
  products: { id: string; name: string; slug: string }[];
  currentUpsell?: Upsell | null;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  type FormData = z.output<typeof insertUpsellSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(insertUpsellSchema) as unknown as Resolver<FormData>,
    defaultValues: {
      productId: currentUpsell?.productId || "",
      isEnabled:
        currentUpsell?.isEnabled !== undefined ? currentUpsell.isEnabled : true,
    },
  });

  // Update form when currentUpsell changes
  useEffect(() => {
    if (currentUpsell) {
      form.reset({
        productId: currentUpsell.productId || "",
        isEnabled:
          currentUpsell.isEnabled !== undefined
            ? currentUpsell.isEnabled
            : true,
      });
    }
  }, [currentUpsell, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await setUpsell(data.productId, data.isEnabled);
      if (result.success) {
        toast({
          description:
            result.message ||
            CONTENT_PAGE.COMPONENT.UPSELL_FORM.upsellSetSuccessfully,
        });
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          description:
            result.message ||
            CONTENT_PAGE.COMPONENT.UPSELL_FORM.failedToSetUpsell,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        description: CONTENT_PAGE.GLOBAL.errorOccurred,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      const result = await clearUpsell();
      if (result.success) {
        toast({
          description:
            result.message ||
            CONTENT_PAGE.COMPONENT.UPSELL_FORM.upsellClearedSuccessfully,
        });
        form.reset();
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          description:
            result.message ||
            CONTENT_PAGE.COMPONENT.UPSELL_FORM.failedToClearUpsell,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        description: CONTENT_PAGE.GLOBAL.errorOccurred,
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{CONTENT_PAGE.COMPONENT.UPSELL_FORM.manageUpsell}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{CONTENT_PAGE.GLOBAL.product}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            CONTENT_PAGE.COMPONENT.UPSELL_FORM.selectProduct
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {CONTENT_PAGE.COMPONENT.UPSELL_FORM.enableUpsell}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {CONTENT_PAGE.COMPONENT.UPSELL_FORM.uncheckToHideUpsell}
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || isClearing}>
                {isSubmitting
                  ? CONTENT_PAGE.GLOBAL.submitting
                  : CONTENT_PAGE.COMPONENT.UPSELL_FORM.setUpsell}
              </Button>
              {currentUpsell && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleClear}
                  disabled={isSubmitting || isClearing}
                >
                  {isClearing
                    ? CONTENT_PAGE.COMPONENT.UPSELL_FORM.clearing
                    : CONTENT_PAGE.COMPONENT.UPSELL_FORM.clearUpsell}
                </Button>
              )}
            </div>
          </form>
        </Form>

        {currentUpsell && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">
              {CONTENT_PAGE.COMPONENT.UPSELL_FORM.currentUpsell}
            </h3>
            <p>
              <strong>{CONTENT_PAGE.COMPONENT.UPSELL_FORM.productLabel}</strong>{" "}
              {currentUpsell.product.name}
            </p>
            <p>
              <strong>{CONTENT_PAGE.COMPONENT.UPSELL_FORM.statusLabel}</strong>{" "}
              {currentUpsell.isEnabled
                ? CONTENT_PAGE.COMPONENT.UPSELL_FORM.enabled
                : CONTENT_PAGE.COMPONENT.UPSELL_FORM.disabled}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
