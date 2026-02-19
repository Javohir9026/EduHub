import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";

export function UserEditModal({ classname }: { classname: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="outline" className={classname}>
          <Pen />
          Tahrirlash
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer !dark:bg-red-500/70 !bg-red-500 text-white hover:!bg-red-500/80 hover:text-white">Bekor qilish</AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer !dark:bg-green-500/70 !bg-green-500 text-white hover:!bg-green-500/80 hover:text-white">Saqlash</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent> 
    </AlertDialog>
  );
}
