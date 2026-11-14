import type { ReactNode } from "react";
import { AlertCircleIcon, Loader } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Athlete } from "@/features/athletes/types/Athlete";
import StatForm, { type StatFormProps } from "./StatForm";

type StatDialogProps = StatFormProps & {
  athlete: Athlete;
  /** The element that opens the dialog (rendered with asChild). */
  trigger: ReactNode;
  /**
   * Pass to show a Save button that saves right away.
   * Leave out when the page saves later (e.g. Submit All), and the
   * footer shows a Done button instead.
   */
  onSave?: () => void;
  isPending?: boolean;
  error?: Error | null;
  /** Optional: control open/close from the page (e.g. close after saving). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** The dialog that wraps stat entry: trigger, header, form, footer. */
const StatDialog = ({
  athlete,
  trigger,
  onSave,
  isPending = false,
  error,
  open,
  onOpenChange,
  ...formProps
}: StatDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent className="max-h-11/12 flex flex-col overflow-hidden">
      <DialogHeader>
        <DialogTitle>{athlete.name}&apos;s Stats</DialogTitle>
        <DialogDescription>
          Tap a category, then the result.
          {onSave ? " Save when you're done." : " Close when you're done."}
        </DialogDescription>
      </DialogHeader>

      <div className="overflow-y-auto">
        {isPending ? (
          <div className="flex gap-4">
            <Loader className="animate-spin" />
            Adding stats...
          </div>
        ) : (
          <StatForm {...formProps} />
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="flex justify-start">
          <AlertCircleIcon />
          <AlertTitle className="px-1">{error.message}</AlertTitle>
        </Alert>
      )}

      <DialogFooter>
        {onSave ? (
          <>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={onSave} disabled={isPending}>
              Save New Stats
            </Button>
          </>
        ) : (
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        )}
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default StatDialog;
