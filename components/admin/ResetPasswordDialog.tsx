"use client";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetUserPassword } from "@/lib/actions/user.actions";
import CONTENT_PAGE from "@/lib/content-page";
import { resetPasswordSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ResetPasswordDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    startTransition(async () => {
      const res = await resetUserPassword(userId, values);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }

      setOpen(false);
      form.reset();
      toast({
        description: res.message,
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          {CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM.resetPassword}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM.resetPasswordTitle}
          </DialogTitle>
          <DialogDescription>
            {CONTENT_PAGE.GLOBAL.thisActionCannotBeUndone}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM.newPassword}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM
                          .newPassword
                      }
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
                <FormItem>
                  <FormLabel>
                    {
                      CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM
                        .confirmPassword
                    }
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM
                          .confirmPassword
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {CONTENT_PAGE.GLOBAL.cancel}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? CONTENT_PAGE.GLOBAL.submitting
                  : CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM
                      .resetPassword}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
