import { cn } from "@/lib/utils";

type Props = {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
};

export function ChipGroup({ label, options, value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-foreground/40",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
