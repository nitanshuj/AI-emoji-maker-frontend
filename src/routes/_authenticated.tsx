import {
  createFileRoute,
  Outlet,
  Navigate,
  useRouter,
} from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthenticated, user, clear } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/studio" className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-accent" />
            Emoji Maker
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.full_name}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clear();
                router.navigate({ to: "/" });
              }}
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
