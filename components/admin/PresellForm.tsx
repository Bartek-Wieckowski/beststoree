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
import { insertPresellSchema } from "@/lib/validators";
import { Presell, Category } from "@/types";
import { setPresell, clearPresell } from "@/lib/actions/presell.actions";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import CONTENT_PAGE from "@/lib/content-page";

export default function PresellForm({
  categories,
  products,
  currentPresells,
}: {
  categories: Category[];
  products: { id: string; name: string; slug: string }[];
  currentPresells?: Presell[] | null;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearing, setIsClearing] = useState<Record<string, boolean>>({});

  type FormData = z.output<typeof insertPresellSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(insertPresellSchema) as unknown as Resolver<FormData>,
    defaultValues: {
      categoryId: "",
      productId: "",
      isEnabled: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await setPresell(
        data.categoryId,
        data.productId,
        data.isEnabled
      );
      if (result.success) {
        toast({
          description:
            result.message ||
            CONTENT_PAGE.COMPONENT.PRESELL_FORM.presellSetSuccessfully,
        });
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          description:
            result.message ||
            CONTENT_PAGE.COMPONENT.PRESELL_FORM.failedToSetPresell,
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

  const handleClear = async (categoryId: string) => {
    setIsClearing((prev) => ({ ...prev, [categoryId]: true }));
    try {
      const result = await clearPresell(categoryId);
      if (result.success) {
        toast({
          description:
            result.message ||
            CONTENT_PAGE.COMPONENT.PRESELL_FORM.presellClearedSuccessfully,
        });
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          description:
            result.message ||
            CONTENT_PAGE.COMPONENT.PRESELL_FORM.failedToClearPresell,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        description: CONTENT_PAGE.GLOBAL.errorOccurred,
      });
    } finally {
      setIsClearing((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {CONTENT_PAGE.COMPONENT.PRESELL_FORM.managePresell}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{CONTENT_PAGE.GLOBAL.category}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            CONTENT_PAGE.COMPONENT.PRESELL_FORM.selectCategory
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{CONTENT_PAGE.GLOBAL.product}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            CONTENT_PAGE.COMPONENT.PRESELL_FORM.selectProduct
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
                      {CONTENT_PAGE.COMPONENT.PRESELL_FORM.enablePresell}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {CONTENT_PAGE.COMPONENT.PRESELL_FORM.uncheckToHidePresell}
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? CONTENT_PAGE.GLOBAL.submitting
                : CONTENT_PAGE.COMPONENT.PRESELL_FORM.setPresell}
            </Button>
          </form>
        </Form>

        {currentPresells && currentPresells.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">
              {CONTENT_PAGE.COMPONENT.PRESELL_FORM.currentPresells}
            </h3>
            {currentPresells.map((presell) => (
              <div
                key={presell.id}
                className="p-4 bg-muted rounded-lg space-y-2"
              >
                <p>
                  <strong>
                    {CONTENT_PAGE.COMPONENT.PRESELL_FORM.categoryLabel}
                  </strong>{" "}
                  {presell.category.name}
                </p>
                <p>
                  <strong>
                    {CONTENT_PAGE.COMPONENT.PRESELL_FORM.productLabel}
                  </strong>{" "}
                  {presell.product.name}
                </p>
                <p>
                  <strong>
                    {CONTENT_PAGE.COMPONENT.PRESELL_FORM.statusLabel}
                  </strong>{" "}
                  {presell.isEnabled
                    ? CONTENT_PAGE.COMPONENT.PRESELL_FORM.enabled
                    : CONTENT_PAGE.COMPONENT.PRESELL_FORM.disabled}
                </p>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleClear(presell.categoryId)}
                  disabled={isClearing[presell.categoryId]}
                >
                  {isClearing[presell.categoryId]
                    ? CONTENT_PAGE.COMPONENT.PRESELL_FORM.clearing
                    : CONTENT_PAGE.COMPONENT.PRESELL_FORM.clearPresell}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
