import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { tripActions, useTrip, sumSimple, sumScheduled, formatBRL } from "@/lib/trip-store";
import { Plane, Hotel, UtensilsCrossed, Bus, MapPinned, Wallet } from "lucide-react";

export function GeneralTab() {
  const trip = useTrip();
  const g = trip.general;

  const totals = {
    flights: sumSimple(trip.flights),
    transport: sumSimple(trip.transport),
    lodging: sumSimple(trip.lodging),
    food: sumScheduled(trip.food),
    tours: sumScheduled(trip.tours),
  };
  const grand = Object.values(totals).reduce((a, b) => a + b, 0);

  const cards = [
    { label: "Voo", value: totals.flights, icon: Plane },
    { label: "Estadia", value: totals.lodging, icon: Hotel },
    { label: "Alimentação", value: totals.food, icon: UtensilsCrossed },
    { label: "Transporte", value: totals.transport, icon: Bus },
    { label: "Passeios", value: totals.tours, icon: MapPinned },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>🏨 Acomodação</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div><Label>Local / Hotel</Label><Input value={g.accommodationName} onChange={(e) => tripActions.updateGeneral({ accommodationName: e.target.value })} /></div>
          <div><Label>Endereço</Label><Input value={g.accommodationAddress} onChange={(e) => tripActions.updateGeneral({ accommodationAddress: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Check-in (data)</Label><Input type="date" value={g.checkinDate} onChange={(e) => tripActions.updateGeneral({ checkinDate: e.target.value })} /></div>
            <div><Label>Hora</Label><Input type="time" value={g.checkinTime} onChange={(e) => tripActions.updateGeneral({ checkinTime: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Check-out (data)</Label><Input type="date" value={g.checkoutDate} onChange={(e) => tripActions.updateGeneral({ checkoutDate: e.target.value })} /></div>
            <div><Label>Hora</Label><Input type="time" value={g.checkoutTime} onChange={(e) => tripActions.updateGeneral({ checkoutTime: e.target.value })} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>✈️ Voos</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div><Label>Voo de ida</Label><Textarea rows={3} placeholder="Cia, número, data, horário, aeroportos…" value={g.outboundFlight} onChange={(e) => tripActions.updateGeneral({ outboundFlight: e.target.value })} /></div>
          <div><Label>Voo de volta</Label><Textarea rows={3} placeholder="Cia, número, data, horário, aeroportos…" value={g.returnFlight} onChange={(e) => tripActions.updateGeneral({ returnFlight: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" />Resumo de custos</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm"><Icon className="h-4 w-4" />{label}</div>
                <div className="mt-2 text-lg font-semibold">{formatBRL(value)}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl p-5 text-primary-foreground" style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}>
            <div className="text-sm opacity-90">Total geral da viagem</div>
            <div className="text-3xl font-bold">{formatBRL(grand)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}