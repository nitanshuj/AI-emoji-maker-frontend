import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Layers } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-accent" />
          <span>Emoji Maker</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/sign-in">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button size="sm">Get started</Button>
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="pt-16 pb-20 text-center md:pt-24">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Generate emojis in seconds
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">
            Custom emojis from a prompt.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            Describe a moment, pick a style, choose a mood. We'll generate a
            sticker-ready emoji you can drop anywhere.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/sign-up">
              <Button size="lg">Start generating</Button>
            </Link>
            <Link to="/sign-in">
              <Button size="lg" variant="ghost">
                I have an account
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Wand2,
              title: "Prompt to emoji",
              body: "Type what you want. We turn it into a polished sticker.",
            },
            {
              icon: Layers,
              title: "Five styles",
              body: "Sticker, Flat, Doodle, Pixel, or Mascot — your call.",
            },
            {
              icon: Sparkles,
              title: "Four moods",
              body: "Happy, Tired, Confused, Celebrate. Set the vibe.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <Icon className="h-5 w-5 text-accent" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
