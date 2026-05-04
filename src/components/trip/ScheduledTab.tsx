import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { tripActions, useTrip, sumScheduled, formatBRL, PAYMENT_METHODS, LOCATIONS, DAYS, type Location, type PaymentMethod, type DayKey, type ScheduledItem } from "@/lib/trip-store";

type Key = "food" | "tours";

export function ScheduledTab({ tabKey, title, emoji, nameLabel }: { tabKey: Key; title: string; emoji: string; nameLabel: string }) {
  const trip = useTrip();
  const items = trip[tabKey];
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loc, setLoc] = useState<Location>("Gramado");
  const [pay, setPay] = useState<PaymentMethod>("Dinheiro/Cartão");
  const [day, setDay] = useState<DayKey>("01");
  const [val, setVal] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    tripActions.addScheduled(tabKey, { name: name.trim(), location: loc, payment: pay, day, value: Number(val) || 0 });
    setName(""); setVal(""); setOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><span>{emoji}</span>{title}</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Incluir</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo registro — {title}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>{nameLabel}</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Local</Label>
                  <Select value={loc} onValueChange={(v) => setLoc(v as Location)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Agenda</Label>
                  <Select value={day} onValueChange={(v) => setDay(v as DayKey)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{DAYS.map((d) => <SelectItem key={d} value={d}>Dia {d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Forma de pagamento</Label>
                <Select value={pay} onValueChange={(v) => setPay(v as PaymentMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PAYMENT_METHODS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Valor gasto (R$)</Label><Input type="number" step="0.01" value={val} onChange={(e) => setVal(e.target.value)} /></div>
            </div>
            <DialogFooter><Button onClick={submit}>Salvar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nada cadastrado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr><th className="py-2">{nameLabel}</th><th>Local</th><th>Pagamento</th><th>Dia</th><th className="text-right">Valor</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((it: ScheduledItem) => (
                  <tr key={it.id} className="border-t">
                    <td className="py-2">{it.name}</td>
                    <td>{it.location}</td>
                    <td>{it.payment}</td>
                    <td>Dia {it.day}</td>
                    <td className="text-right font-medium">{formatBRL(it.value)}</td>
                    <td className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => tripActions.removeScheduled(tabKey, it.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 flex justify-end border-t pt-3 text-sm">
          Total: <span className="ml-2 font-semibold text-primary">{formatBRL(sumScheduled(items))}</span>
        </div>
      </CardContent>
    </Card>
  );
}