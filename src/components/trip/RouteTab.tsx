import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTrip, DAYS, formatBRL } from "@/lib/trip-store";
import { UtensilsCrossed, MapPinned, CalendarDays } from "lucide-react";

type Entry = {
  id: string;
  kind: "food" | "tour";
  name: string;
  location: string;
  payment: string;
  value: number;
};

export function RouteTab() {
  const trip = useTrip();
  const grand = [...trip.food, ...trip.tours].reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />Roteiro da viagem</CardTitle>
          <Badge variant="secondary">{formatBRL(grand)}</Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Lista gerada automaticamente a partir das agendas de Alimentação e Passeios.</p>
        </CardContent>
      </Card>

      {DAYS.map((d) => {
        const entries: Entry[] = [
          ...trip.tours.filter((i) => i.day === d).map((i) => ({ id: i.id, kind: "tour" as const, name: i.name, location: i.location, payment: i.payment, value: i.value })),
          ...trip.food.filter((i) => i.day === d).map((i) => ({ id: i.id, kind: "food" as const, name: i.name, location: i.location, payment: i.payment, value: i.value })),
        ];
        const total = entries.reduce((a, b) => a + b.value, 0);

        return (
          <Card key={d}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Dia {d}</CardTitle>
              <Badge variant="outline">{formatBRL(total)}</Badge>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sem atividades cadastradas.</p>
              ) : (
                <ol className="relative space-y-3 border-l-2 border-primary/20 pl-4">
                  {entries.map((e) => (
                    <li key={e.id} className="relative">
                      <span className="absolute -left-[22px] top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {e.kind === "tour" ? <MapPinned className="h-2.5 w-2.5" /> : <UtensilsCrossed className="h-2.5 w-2.5" />}
                      </span>
                      <div className="rounded-md border bg-card p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={e.kind === "tour" ? "default" : "secondary"} className="text-[10px]">
                              {e.kind === "tour" ? "Passeio" : "Alimentação"}
                            </Badge>
                            <span className="font-medium">{e.name}</span>
                          </div>
                          <span className="text-sm font-semibold">{formatBRL(e.value)}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                          <Badge variant="outline">{e.location}</Badge>
                          <Badge variant="outline">{e.payment}</Badge>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}