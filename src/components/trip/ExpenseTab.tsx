import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { tripActions, useTrip, sumSimple, formatBRL, type SimpleExpense } from "@/lib/trip-store";

type Key = "flights" | "transport" | "lodging";

export function ExpenseTab({ tabKey, title, emoji }: { tabKey: Key; title: string; emoji: string }) {
  const trip = useTrip();
  const items = trip[tabKey];
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [val, setVal] = useState("");

  const submit = () => {
    if (!desc.trim()) return;
    tripActions.addExpense(tabKey, { description: desc.trim(), value: Number(val) || 0 });
    setDesc(""); setVal(""); setOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><span>{emoji}</span>{title}</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Adicionar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo gasto — {title}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Descrição</Label><Input value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
              <div><Label>Valor (R$)</Label><Input type="number" step="0.01" value={val} onChange={(e) => setVal(e.target.value)} /></div>
            </div>
            <DialogFooter><Button onClick={submit}>Salvar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum gasto registrado.</p>
        ) : (
          <ul className="divide-y">
            {items.map((it: SimpleExpense) => (
              <li key={it.id} className="flex items-center justify-between py-2">
                <span>{it.description}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatBRL(it.value)}</span>
                  <Button variant="ghost" size="icon" onClick={() => tripActions.removeExpense(tabKey, it.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-end border-t pt-3 text-sm">
          Total: <span className="ml-2 font-semibold text-primary">{formatBRL(sumSimple(items))}</span>
        </div>
      </CardContent>
    </Card>
  );
}