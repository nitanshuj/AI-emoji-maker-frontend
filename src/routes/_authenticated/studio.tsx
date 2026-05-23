import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChipGroup } from "@/components/chip-group";
import { UpgradeModal } from "@/components/upgrade-modal";
import { api, type Generation, type ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Sparkles, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/studio")({
  component: StudioPage,
});

const STYLES = ["Sticker", "Flat", "Doodle", "Pixel", "Mascot"] as const;
const MOODS = ["Happy", "Tired", "Confused", "Celebrate"] as const;
const SIZES = [
  { label: "128", value: 128 },
  { label: "256", value: 256 },
  { label: "512", value: 512 },
] as const;

function StudioPage() {
  const { token } = useAuth();
  const qc = useQueryClient();

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<string>("Sticker");
  const [mood, setMood] = useState<string>("Happy");
  const [size, setSize] = useState<number>(128);
  const [latest, setLatest] = useState<Generation | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const profile = useQuery({
    queryKey: ["me"],
    queryFn: () => api.me(token!),
    enabled: !!token,
  });

  const history = useQuery({
    queryKey: ["history"],
    queryFn: () => api.history(token!),
    enabled: !!token,
  });

  const generate = useMutation({
    mutationFn: () =>
      api.generate(token!, {
        prompt,
        style,
        mood,
        width: size,
        height: size,
      }),
    onSuccess: (gen) => {
      setLatest(gen);
      qc.invalidateQueries({ queryKey: ["history"] });
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: ApiError) => {
      if (
        err.status === 402 ||
        err.status === 403 ||
        /limit/i.test(err.detail || "")
      ) {
        setUpgradeOpen(true);
        return;
      }
      toast.error(err.detail || "Generation failed");
    },
  });

  const used = profile.data?.generations_used ?? 0;
  const max = profile.data?.max_generations ?? 10;
  const atLimit = used >= max;

  function onGenerate() {
    if (!prompt.trim()) {
      toast.error("Add a prompt first");
      return;
    }
    if (atLimit) {
      setUpgradeOpen(true);
      return;
    }
    generate.mutate();
  }

  const items = history.data?.generations ?? [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,420px)]">
        {/* Composer */}
        <section className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Studio</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Describe your emoji, then tune the style and mood.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Prompt
            </label>
            <Textarea
              placeholder="e.g. a sleepy cat holding a coffee cup"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <ChipGroup
            label="Style"
            options={STYLES}
            value={style}
            onChange={setStyle}
          />
          <ChipGroup
            label="Mood"
            options={MOODS}
            value={mood}
            onChange={setMood}
          />

          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Size
            </div>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSize(s.value)}
                  className={
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium font-mono " +
                    (s.value === size
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card hover:border-foreground/40")
                  }
                >
                  {s.label}px
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
            <div className="text-sm text-muted-foreground">
              <span className="font-mono text-foreground">
                {used}/{max}
              </span>{" "}
              generations used
            </div>
            <Button
              size="lg"
              onClick={onGenerate}
              disabled={generate.isPending}
            >
              {generate.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate
            </Button>
          </div>
        </section>

        {/* Preview */}
        <section className="space-y-4">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Preview
          </div>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-checkerboard">
            {generate.isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
              </div>
            )}
            {latest ? (
              <img
                key={latest.id}
                src={latest.image_url}
                alt={latest.original_prompt}
                className="animate-emoji-reveal absolute inset-0 h-full w-full object-contain p-8"
              />
            ) : (
              !generate.isPending && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                  Your emoji will appear here
                </div>
              )
            )}
          </div>
          {latest && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm">
              <div className="truncate pr-3 text-muted-foreground">
                {latest.original_prompt}
              </div>
              <a
                href={latest.image_url}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium hover:underline"
              >
                <Download className="h-4 w-4" />
                Save
              </a>
            </div>
          )}
        </section>
      </div>

      {/* History gallery */}
      <section className="mt-16">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-semibold">Recent generations</h2>
          <span className="text-xs text-muted-foreground">
            {items.length} total
          </span>
        </div>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Your generated emojis will show up here.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {items.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setLatest(g)}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-checkerboard transition-shadow hover:shadow-md"
                title={g.original_prompt}
              >
                <img
                  src={g.image_url}
                  alt={g.original_prompt}
                  className="absolute inset-0 h-full w-full object-contain p-4"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </main>
  );
}
