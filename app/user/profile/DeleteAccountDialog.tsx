"use client";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteMyAccount } from "@/lib/actions/user.actions";
import CONTENT_PAGE from "@/lib/content-page";

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDeleteClick = () => {
    startTransition(async () => {
      const res = await deleteMyAccount();

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }

      toast({
        description: res.message,
      });
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="lg" variant="destructive" className="w-full">
          {CONTENT_PAGE.PAGE.USER_PROFILE.deleteAccount}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {CONTENT_PAGE.GLOBAL.areYouAbsolutelySure}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {CONTENT_PAGE.GLOBAL.thisActionCannotBeUndone}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{CONTENT_PAGE.GLOBAL.cancel}</AlertDialogCancel>
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={handleDeleteClick}
          >
            {isPending
              ? CONTENT_PAGE.GLOBAL.deleting
              : CONTENT_PAGE.PAGE.USER_PROFILE.deleteAccount}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
