"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { insertCategorySchema, updateCategorySchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import slugify from "slugify";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createCategory, updateCategory } from "@/lib/actions/category.actions";
import ROUTES from "@/lib/routes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import * as LucideIcons from "lucide-react";
import { Control, useWatch } from "react-hook-form";
import { Category } from "@/types";
import CONTENT_PAGE from "@/lib/content-page";

type IconFieldProps = {
  control: Control<z.infer<typeof insertCategorySchema>>;
};

function IconField({ control }: IconFieldProps) {
  const iconValue = useWatch({ control, name: "icon" });
  const [useCustomIcon, setUseCustomIcon] = useState(
    iconValue ? !POPULAR_ICONS.includes(iconValue) : false
  );

  useEffect(() => {
    if (iconValue && !POPULAR_ICONS.includes(iconValue)) {
      setUseCustomIcon(true);
    } else if (!iconValue || (iconValue && POPULAR_ICONS.includes(iconValue))) {
      setUseCustomIcon(false);
    }
  }, [iconValue]);

  return (
    <FormField
      control={control}
      name="icon"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Icon</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={!useCustomIcon ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setUseCustomIcon(false);
                      field.onChange(null);
                    }}
                  >
                    Select from list
                  </Button>
                  <Button
                    type="button"
                    variant={useCustomIcon ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setUseCustomIcon(true);
                      field.onChange("");
                    }}
                  >
                    Enter custom icon name
                  </Button>
                </div>
                {!useCustomIcon ? (
                  <Select
                    onValueChange={(value) => {
                      const iconValue = value === "none" ? null : value;
                      field.onChange(iconValue);
                    }}
                    value={field.value ?? "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {POPULAR_ICONS.map((iconName) => {
                        const IconComponent = (
                          LucideIcons as unknown as Record<
                            string,
                            React.ComponentType<{ className?: string }>
                          >
                        )[iconName];
                        return (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center gap-2">
                              {IconComponent && (
                                <IconComponent className="h-4 w-4" />
                              )}
                              <span>{iconName}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder="Enter Lucide React icon name (e.g., ShoppingCart, Heart)"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

// Popularne ikony z lucide-react
const POPULAR_ICONS = [
  "ShoppingBag",
  "Shirt",
  "Laptop",
  "Smartphone",
  "Headphones",
  "Watch",
  "Camera",
  "Gamepad2",
  "Book",
  "Home",
  "Car",
  "Bike",
  "Dumbbell",
  "Music",
  "Palette",
  "Utensils",
  "Baby",
  "Heart",
  "Gift",
  "Star",
];

export default function CategoryForm({
  type,
  category,
  categoryId,
}: {
  type: "Create" | "Update";
  category?: Category;
  categoryId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  // Use insertCategorySchema type for form, but we'll add id in onSubmit for Update
  type FormData = z.infer<typeof insertCategorySchema>;

  // Create a resolver that works for both Create and Update
  // For Update, we'll validate without id first, then add id before sending
  const form = useForm<FormData>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: category
      ? {
          name: category.name || "",
          slug: category.slug || "",
          icon: category.icon || null,
        }
      : {
          name: "",
          slug: "",
          icon: null,
        },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    // On Create
    if (type === "Create") {
      const res = await createCategory(values);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message as string,
        });
      } else {
        toast({
          description: res.message as string,
        });
        router.push(ROUTES.ADMIN_CATEGORIES);
      }
      return;
    }

    // On Update
    if (type === "Update") {
      const idToUse = categoryId || category?.id;

      if (!idToUse || typeof idToUse !== "string" || idToUse.trim() === "") {
        toast({
          variant: "destructive",
          description: CONTENT_PAGE.COMPONENT.CATEGORY_FORM.categoryIdMissing,
        });
        return;
      }

      // For update, use slug from form values
      const slugValue = values.slug?.trim() || "";

      if (!slugValue || slugValue.length < 3) {
        toast({
          variant: "destructive",
          description: CONTENT_PAGE.COMPONENT.CATEGORY_FORM.slugRequired,
        });
        return;
      }

      const updateData: z.infer<typeof updateCategorySchema> = {
        id: idToUse.trim(),
        name: values.name.trim(),
        slug: slugValue,
        icon: values.icon || null,
      };

      const res = await updateCategory(updateData);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message as string,
        });
      } else {
        toast({
          description: res.message as string,
        });
        router.push(ROUTES.ADMIN_CATEGORIES);
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

  // Auto-generate slug from name (for both Create and Update modes)
  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    // Auto-generate slug from name if name is not empty
    if (value && value.trim().length > 0) {
      const slug = slugify(value, { lower: true, strict: true });
      form.setValue("slug", slug);
    }
  };

  // Generate slug from name (can be used in both Create and Update)
  const handleGenerateSlug = () => {
    const name = form.getValues("name");
    if (name && name.trim().length > 0) {
      const slug = slugify(name, { lower: true, strict: true });
      form.setValue("slug", slug);
    }
  };

  // Ensure slug is set for Update mode from category data
  useEffect(() => {
    if (type === "Update" && category?.slug) {
      const currentSlug = form.getValues("slug");
      if (!currentSlug || currentSlug.trim() === "") {
        form.setValue("slug", category.slug);
      }
    }
  }, [type, category?.slug, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={
                    CONTENT_PAGE.COMPONENT.CATEGORY_FORM.categoryName
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input {...field} placeholder="category-slug" />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-fit"
                    onClick={handleGenerateSlug}
                  >
                    {CONTENT_PAGE.COMPONENT.CATEGORY_FORM.generateFromName}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <IconField control={form.control} />

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? CONTENT_PAGE.GLOBAL.saving
              : type === "Create"
                ? CONTENT_PAGE.COMPONENT.CATEGORY_FORM.createCategory
                : CONTENT_PAGE.COMPONENT.CATEGORY_FORM.updateCategory}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(ROUTES.ADMIN_CATEGORIES)}
          >
            {CONTENT_PAGE.GLOBAL.cancel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
