import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const plans = [
  { name: "Premium", price: "$9", limit: "100 generations / month" },
  { name: "Ultra", price: "$29", limit: "500 generations / month" },
];

const perks = [
  "Higher resolution exports",
  "Priority generation queue",
  "Full history retention",
];

export function UpgradeModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>You've hit the Free limit</DialogTitle>
          <DialogDescription>
            Upgrade to keep generating emojis without interruption.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2">
          {plans.map((p) => (
            <div
              key={p.name}
              className="rounded-lg border border-border p-4"
            >
              <div className="text-sm font-medium">{p.name}</div>
              <div className="mt-1 text-2xl font-semibold">{p.price}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {p.limit}
              </div>
            </div>
          ))}
        </div>

        <ul className="space-y-1.5 text-sm">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" />
              {perk}
            </li>
          ))}
        </ul>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
          <Button onClick={() => onOpenChange(false)}>Upgrade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
