import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type EasypaisaTransferModalProps = {
  open: boolean;
  total: number;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function EasypaisaTransferModal({
  open,
  total,
  submitting,
  onOpenChange,
  onConfirm,
}: EasypaisaTransferModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete your Easypaisa transfer</DialogTitle>
          <DialogDescription>
            Send the exact order total to our Easypaisa account, then confirm below so we can verify your payment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 rounded-lg border border-outline-variant/30 bg-surface-container-low p-4 text-sm">
          <p>
            <span className="font-semibold text-on-surface">Account title:</span> Royal Orchard
          </p>
          <p>
            <span className="font-semibold text-on-surface">Easypaisa number:</span> 0300 1234567
          </p>
          <p>
            <span className="font-semibold text-on-surface">Amount to send:</span> PKR {total.toLocaleString("en-PK")}
          </p>
          <p className="text-on-surface-variant">
            Use your order name and phone number as the transfer note so our team can match your payment.
          </p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Back
          </Button>
          <Button type="button" onClick={onConfirm} disabled={submitting}>
            {submitting ? "Placing order..." : "I have sent the payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
