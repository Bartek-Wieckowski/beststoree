"use client";

import { useToast } from "@/hooks/use-toast";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
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
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import ROUTES from "@/lib/routes";
import { useState, useEffect, useRef } from "react";
import { Trash } from "lucide-react";
import { deleteImages } from "@/lib/actions/image.actions";
import CONTENT_PAGE from "@/lib/content-page";

export default function ProductForm({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) {
  const [imagesToBeDeleted, setImagesToBeDeleted] = useState<string[]>([]);
  const [bannerToBeDeleted, setBannerToBeDeleted] = useState<string | null>(
    null
  );
  const [newlyAddedImages, setNewlyAddedImages] = useState<Map<string, string>>(
    new Map()
  ); // Map<url, key>
  const [newlyAddedBanner, setNewlyAddedBanner] = useState<string | null>(null);
  const newlyAddedImagesRef = useRef(newlyAddedImages);
  const newlyAddedBannerRef = useRef(newlyAddedBanner);
  const router = useRouter();
  const { toast } = useToast();

  // Keep refs in sync with state
  useEffect(() => {
    newlyAddedImagesRef.current = newlyAddedImages;
  }, [newlyAddedImages]);

  useEffect(() => {
    newlyAddedBannerRef.current = newlyAddedBanner;
  }, [newlyAddedBanner]);

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(
      type === "Create" ? insertProductSchema : updateProductSchema
    ),
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
    // On Create
    if (type === "Create") {
      const res = await createProduct(values);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message as string,
        });
      } else {
        // Clear newly added images and banner map on success
        setNewlyAddedImages(new Map());
        setNewlyAddedBanner(null);
        toast({
          description: res.message as string,
        });
        router.push(ROUTES.ADMIN_PRODUCTS);
      }
    }

    // On Update
    if (type === "Update") {
      if (!productId) {
        router.push(ROUTES.ADMIN_PRODUCTS);
        return;
      }

      const res = await updateProduct({
        ...values,
        id: productId,
        imagesToBeDeleted,
        bannerToBeDeleted,
      });

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message as string,
        });
      } else {
        // Clear states on success
        setImagesToBeDeleted([]);
        setBannerToBeDeleted(null);
        setNewlyAddedImages(new Map());
        setNewlyAddedBanner(null);
        toast({
          description: res.message as string,
        });
        router.push(ROUTES.ADMIN_PRODUCTS);
      }
    }
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  const handleImageRemove = async (removedImage: string) => {
    // Check if this is a newly added image (not yet saved to database)
    if (newlyAddedImages.has(removedImage)) {
      // Delete immediately from uploadthing since it's not in database yet
      const imageKey = newlyAddedImages.get(removedImage)!;
      await deleteImages(imageKey);
      setNewlyAddedImages((prev) => {
        const newMap = new Map(prev);
        newMap.delete(removedImage);
        return newMap;
      });
    } else {
      // This is an existing image from database, mark it for deletion
      const imageKey = removedImage.split("/").pop() as string;
      setImagesToBeDeleted((prev) => [...prev, imageKey]);
    }

    // Filter out removed images and update images form value
    const filteredImages = images.filter((image) => image !== removedImage);
    form.setValue("images", filteredImages);
  };

  const handleBannerRemove = async () => {
    if (banner) {
      // Check if this is a newly added banner (not yet saved to database)
      if (newlyAddedBanner === banner) {
        // Delete immediately from uploadthing since it's not in database yet
        const bannerKey = banner.split("/").pop() as string;
        await deleteImages(bannerKey);
        setNewlyAddedBanner(null);
      } else {
        // This is an existing banner from database, mark it for deletion
        const bannerKey = banner.split("/").pop() as string;
        setBannerToBeDeleted(bannerKey);
      }
      form.setValue("banner", null);
    }
  };

  // Cleanup: Delete newly added images and banner if form is unmounted or user navigates away
  useEffect(() => {
    return () => {
      // Cleanup on unmount - delete any newly added images that weren't saved
      const keysToDelete: string[] = [];
      if (newlyAddedImagesRef.current.size > 0) {
        keysToDelete.push(...Array.from(newlyAddedImagesRef.current.values()));
      }
      if (newlyAddedBannerRef.current) {
        const bannerKey = newlyAddedBannerRef.current.split("/").pop();
        if (bannerKey) {
          keysToDelete.push(bannerKey);
        }
      }
      if (keysToDelete.length > 0) {
        deleteImages(keysToDelete).catch(console.error);
      }
    };
  }, []);

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row gap-5">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "name"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{CONTENT_PAGE.ADMIN_PRODUCTS_FORM.name}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      CONTENT_PAGE.ADMIN_PRODUCTS_FORM.enterProductName
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "slug"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{CONTENT_PAGE.ADMIN_PRODUCTS_FORM.slug}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={CONTENT_PAGE.ADMIN_PRODUCTS_FORM.enterSlug}
                      {...field}
                    />
                    <Button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), { lower: true })
                        );
                      }}
                    >
                      {CONTENT_PAGE.ADMIN_PRODUCTS_FORM.generate}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "category"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {CONTENT_PAGE.ADMIN_PRODUCTS_FORM.category}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={CONTENT_PAGE.ADMIN_PRODUCTS_FORM.enterCategory}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "brand"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{CONTENT_PAGE.ADMIN_PRODUCTS_FORM.brand}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={CONTENT_PAGE.ADMIN_PRODUCTS_FORM.enterBrand}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "price"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{CONTENT_PAGE.ADMIN_PRODUCTS_FORM.price}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={CONTENT_PAGE.ADMIN_PRODUCTS_FORM.enterPrice}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "stock"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>{CONTENT_PAGE.ADMIN_PRODUCTS_FORM.stock}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={CONTENT_PAGE.ADMIN_PRODUCTS_FORM.enterStock}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field flex flex-col md:flex-row gap-5">
          {/* Images */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>{CONTENT_PAGE.ADMIN_PRODUCTS_FORM.images}</FormLabel>
                <Card className="p-0 pt-2">
                  <CardContent className="space-y-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.filter(img => img && img.trim() !== '').map((image: string) => (
                        <div key={image} className="border relative rounded-md">
                          <Image
                            src={image}
                            alt="product image"
                            className="w-20 h-20 object-cover object-center rounded-sm"
                            width={100}
                            height={100}
                          />
                          <Button
                            variant={"destructive"}
                            className="absolute top-1 right-1 w-7 h-7 rounded-full"
                            onClick={() => handleImageRemove(image)}
                          >
                            <Trash
                              className="w-5 h-5"
                              style={{ color: "white" }}
                            />
                          </Button>
                        </div>
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint={"imageUploader"}
                          onClientUploadComplete={(
                            res: { url: string; key: string }[]
                          ) => {
                            const uploadedFile = res[0];
                            // Store the mapping of url to key for newly added images
                            setNewlyAddedImages((prev) => {
                              const newMap = new Map(prev);
                              newMap.set(uploadedFile.url, uploadedFile.key);
                              return newMap;
                            });
                            form.setValue("images", [
                              ...images,
                              uploadedFile.url,
                            ]);
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              description: `Error! ${error.message}`,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          {/* isFeatured */}
          {CONTENT_PAGE.ADMIN_PRODUCTS_FORM.featuredProduct}
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="space-x-2 flex items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>
                      {CONTENT_PAGE.ADMIN_PRODUCTS_FORM.isFeatured}
                    </FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <div className="relative">
                  <Image
                    src={banner}
                    alt="banner image"
                    className="w-full object-cover object-center rounded-sm"
                    width={1920}
                    height={680}
                  />
                  <Button
                    variant={"destructive"}
                    className="absolute top-2 right-2"
                    onClick={handleBannerRemove}
                    type="button"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    {CONTENT_PAGE.ADMIN_PRODUCTS_FORM.removeBanner}
                  </Button>
                </div>
              )}

              {isFeatured && !banner && (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(
                    res: { url: string; key: string }[]
                  ) => {
                    const uploadedFile = res[0];
                    setNewlyAddedBanner(uploadedFile.url);
                    form.setValue("banner", uploadedFile.url);
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      variant: "destructive",
                      description: `ERROR! ${error.message}`,
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                "description"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {CONTENT_PAGE.ADMIN_PRODUCTS_FORM.description}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={
                      CONTENT_PAGE.ADMIN_PRODUCTS_FORM.enterDescription
                    }
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting
              ? CONTENT_PAGE.ADMIN_PRODUCTS_FORM.submitting
              : `${type} ${CONTENT_PAGE.ADMIN_PRODUCTS_FORM.product}`}
          </Button>
        </div>
      </form>
    </Form>
  );
}
