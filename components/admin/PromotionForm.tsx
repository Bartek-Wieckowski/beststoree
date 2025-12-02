"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import { insertPromotionSchema } from "@/lib/validators";
import { Promotion } from "@/types";
import { setPromotion, clearPromotion } from "@/lib/actions/promotion.actions";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";

export default function PromotionForm({
  products,
  currentPromotion,
}: {
  products: { id: string; name: string; slug: string }[];
  currentPromotion?: Promotion | null;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  type FormData = z.output<typeof insertPromotionSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(
      insertPromotionSchema
    ) as unknown as Resolver<FormData>,
    defaultValues: {
      productId: currentPromotion?.productId || "",
      endDate: currentPromotion?.endDate
        ? new Date(currentPromotion.endDate)
        : undefined,
      isEnabled:
        currentPromotion?.isEnabled !== undefined
          ? currentPromotion.isEnabled
          : true,
    },
  });

  // Update form when currentPromotion changes
  useEffect(() => {
    if (currentPromotion) {
      form.reset({
        productId: currentPromotion.productId || "",
        endDate: currentPromotion.endDate
          ? new Date(currentPromotion.endDate)
          : undefined,
        isEnabled:
          currentPromotion.isEnabled !== undefined
            ? currentPromotion.isEnabled
            : true,
      });
    }
  }, [currentPromotion, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await setPromotion(
        data.productId,
        data.endDate,
        data.isEnabled
      );
      if (result.success) {
        toast({
          description:
            typeof result.message === "string"
              ? result.message
              : "Promotion set successfully",
        });
        // Reload to get updated promotion
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          description:
            typeof result.message === "string"
              ? result.message
              : "Failed to set promotion",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        description: "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      const result = await clearPromotion();
      if (result.success) {
        toast({
          description:
            typeof result.message === "string"
              ? result.message
              : "Promotion cleared successfully",
        });
        form.reset();
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          description:
            typeof result.message === "string"
              ? result.message
              : "Failed to clear promotion",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        description: "An error occurred",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Promotion</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
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
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion End Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? new Date(value) : undefined);
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable Promotion</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Uncheck to completely hide promotion from the site
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || isClearing}>
                {isSubmitting ? "Setting..." : "Set Promotion"}
              </Button>
              {currentPromotion && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleClear}
                  disabled={isSubmitting || isClearing}
                >
                  {isClearing ? "Clearing..." : "Clear Promotion"}
                </Button>
              )}
            </div>
          </form>
        </Form>

        {currentPromotion && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Current Promotion</h3>
            <p>
              <strong>Product:</strong> {currentPromotion.product.name}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {currentPromotion.endDate
                ? new Date(currentPromotion.endDate).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {currentPromotion.isEnabled === false
                ? "Disabled (not shown on site)"
                : "Enabled"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
