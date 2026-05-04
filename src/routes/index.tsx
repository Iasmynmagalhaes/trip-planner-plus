import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab } from "@/components/trip/GeneralTab";
import { ExpenseTab } from "@/components/trip/ExpenseTab";
import { ScheduledTab } from "@/components/trip/ScheduledTab";
import { RouteTab } from "@/components/trip/RouteTab";
import { useTrip, sumSimple, sumScheduled, formatBRL } from "@/lib/trip-store";
import { Mountain } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Planejador de Viagem — Gramado & Canela" },
      { name: "description", content: "Organize acomodação, voos, passeios, alimentação e roteiro com totais automáticos." },
    ],
  }),
  component: Index,
});

function Index() {
  const trip = useTrip();
  const grand =
    sumSimple(trip.flights) + sumSimple(trip.transport) + sumSimple(trip.lodging) +
    sumScheduled(trip.food) + sumScheduled(trip.tours);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
              <Mountain className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Planejador de Viagem</h1>
              <p className="text-xs text-muted-foreground">Gramado · Canela</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total geral</div>
            <div className="text-lg font-bold text-primary">{formatBRL(grand)}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Tabs defaultValue="geral">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-7">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="voo">Voo</TabsTrigger>
            <TabsTrigger value="estadia">Estadia</TabsTrigger>
            <TabsTrigger value="transporte">Transporte</TabsTrigger>
            <TabsTrigger value="alimentacao">Alimentação</TabsTrigger>
            <TabsTrigger value="passeios">Passeios</TabsTrigger>
            <TabsTrigger value="roteiro">Roteiro</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="geral"><GeneralTab /></TabsContent>
            <TabsContent value="voo"><ExpenseTab tabKey="flights" title="Voo" emoji="✈️" /></TabsContent>
            <TabsContent value="estadia"><ExpenseTab tabKey="lodging" title="Estadia" emoji="🏨" /></TabsContent>
            <TabsContent value="transporte"><ExpenseTab tabKey="transport" title="Transporte" emoji="🚌" /></TabsContent>
            <TabsContent value="alimentacao"><ScheduledTab tabKey="food" title="Alimentação" emoji="🍽️" nameLabel="Nome do Restaurante" /></TabsContent>
            <TabsContent value="passeios"><ScheduledTab tabKey="tours" title="Passeios" emoji="🗺️" nameLabel="Nome do Passeio" /></TabsContent>
            <TabsContent value="roteiro"><RouteTab /></TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
