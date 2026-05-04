import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Mountain } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const signIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      console.error(result.error);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
          <Mountain className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold">Planejador de Viagem</h1>
        <p className="mt-2 text-sm text-muted-foreground">Entre para acessar seu planejamento de qualquer dispositivo.</p>
        <Button onClick={signIn} className="mt-6 w-full" size="lg">
          Entrar com Google
        </Button>
      </div>
    </div>
  );
}