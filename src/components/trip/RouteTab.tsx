import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTrip, DAYS, formatBRL, type ScheduledItem } from "@/lib/trip-store";
import { UtensilsCrossed, MapPinned } from "lucide-react";

export function RouteTab() {
  const trip = useTrip();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Roteiro montado automaticamente a partir das agendas de alimentação e passeios.</p>
      {DAYS.map((d) => {
        const food = trip.food.filter((i) => i.day === d);
        const tours = trip.tours.filter((i) => i.day === d);
        const total = [...food, ...tours].reduce((a, b) => a + b.value, 0);
        const empty = food.length + tours.length === 0;
        return (
          <Card key={d}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Dia {d}</CardTitle>
              <Badge variant="secondary">{formatBRL(total)}</Badge>
            </CardHeader>
            <CardContent>
              {empty ? (
                <p className="text-sm text-muted-foreground">Sem atividades cadastradas.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <Section title="Passeios" icon={<MapPinned className="h-4 w-4" />} items={tours} />
                  <Section title="Alimentação" icon={<UtensilsCrossed className="h-4 w-4" />} items={food} />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function Section({ title, icon, items }: { title: string; icon: React.ReactNode; items: ScheduledItem[] }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">{icon}{title}</div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">—</p>
      ) : (
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.id} className="rounded-md border bg-card p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{i.name}</span>
                <span className="text-sm">{formatBRL(i.value)}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{i.location}</Badge>
                <Badge variant="outline">{i.payment}</Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}