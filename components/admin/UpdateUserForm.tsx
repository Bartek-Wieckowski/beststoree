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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateUser } from "@/lib/actions/user.actions";
import { USER_ROLES } from "@/lib/constants";
import CONTENT_PAGE from "@/lib/content-page";
import ROUTES from "@/lib/routes";
import { updateUserSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import ResetPasswordDialog from "./ResetPasswordDialog";

export default function UpdateUserForm({
  user,
}: {
  user: z.infer<typeof updateUserSchema>;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      const res = await updateUser({
        ...values,
        id: user.id,
      });

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
      router.push(ROUTES.ADMIN_USERS);
    } catch (error) {
      toast({
        variant: "destructive",
        description: (error as Error).message,
      });
    }
  };

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Email */}
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                "email"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM.email}
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={true}
                    placeholder={
                      CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM
                        .emailPlaceholder
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Name */}
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                "name"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM.name}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM
                        .namePlaceholder
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Role */}
        <div>
          <FormField
            control={form.control}
            name="role"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                "role"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM.role}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM
                            .rolePlaceholder
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex-between mt-6 flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM.submitting
              : CONTENT_PAGE.COMPONENT.ADMIN_USERS_UPDATE_FORM.updateUser}
          </Button>
          <ResetPasswordDialog userId={user.id} />
        </div>
      </form>
    </Form>
  );
}
