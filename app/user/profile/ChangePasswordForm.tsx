"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { changePassword } from "@/lib/actions/user.actions";
import CONTENT_PAGE from "@/lib/content-page";
import { changePasswordSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ChangePasswordForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
    const res = await changePassword(values);

    if (!res.success) {
      return toast({
        variant: "destructive",
        description: res.message as string,
      });
    }

    toast({
      description: res.message as string,
    });
    form.reset();
    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{CONTENT_PAGE.GLOBAL.currentPassword}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={CONTENT_PAGE.GLOBAL.currentPassword}
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{CONTENT_PAGE.GLOBAL.newPassword}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={CONTENT_PAGE.GLOBAL.newPassword}
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{CONTENT_PAGE.GLOBAL.confirmPassword}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={CONTENT_PAGE.GLOBAL.confirmPassword}
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="button col-span-2 w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? CONTENT_PAGE.GLOBAL.submitting
            : CONTENT_PAGE.PAGE.USER_PROFILE.changePassword}
        </Button>
      </form>
    </Form>
  );
}
