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
import { UserPlus } from "lucide-react";

const AddStudentToGroupModal = () => {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-blue-500 dark:bg-blue-500 text-white dark:text-white hover:bg-blue-400 hover:text-white dark:hover:bg-blue-600 cursor-pointer "
          >
            <UserPlus size={18} />
            <span className="hidden md:inline">O'quvchi Qo'shish</span>
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Guruhga O'quvchi Qo'shish</AlertDialogTitle>
          </AlertDialogHeader>
          <div></div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddStudentToGroupModal;
