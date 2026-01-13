import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const useConfirmBlank = () => {
  const [open, setOpen] = useState(false);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null
  );
  const [athleteName, setAthleteName] = useState("");

  const changeAlertAthleteName = (name: string) => {
    setAthleteName(name);
  };

  const confirm = () =>
    // confirm returns a boolean promise
    // the promise constructor allows us take the resolve function and do stuff with it
    // so what we want to do is resolve this promise either with "true" or "false" controlled by the alert dialog
    // to get the resolve function in a way where we can call it at will we can store it in state
    // so what we do is store this resolve function as a state variable so that we can move it around and so that the function persists.
    new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
      // we store resolve function in an anon arrow bc useState set function will run any function that is passed through to update state
      // i.e setState(prev => state(prev))
      // so by putting the anon arrow function that returns resolve function, the setState runs the function and receives resolve
      // thus the Resolver state variable === resolve function
      setOpen(true);
      // and basically while the promise is started we want to open the alert
      // see handle continue and cancel next
    });

  const handleContinue = () => {
    // we want the promise to be resolved i.e. call the resolver when user clicks dialog buttons so we set up handlers
    resolver?.(true);
    // the handler will call the resolve function through the state variable with value "true" to continue
    setOpen(false);
    // once we continue we also lose th alert
  };

  const handleCancel = () => {
    // same same as above
    resolver?.(false);
    setOpen(false);
  };

  const ConfirmDialog = () => (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{athleteName}'s stats are blank.</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to create a blank stat sheet for {athleteName}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, ConfirmDialog, changeAlertAthleteName };
};

export default useConfirmBlank;
