"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BrandDeal, BrandDealStatus } from "@/lib/types";
import { newId } from "@/lib/id";
import { todayIso } from "@/lib/weekUtils";

const STATUSES: BrandDealStatus[] = ["negotiating", "confirmed", "delivered", "paid"];
const STATUS_TONE: Record<BrandDealStatus, "grey" | "ice" | "sage"> = {
  negotiating: "grey",
  confirmed: "ice",
  delivered: "ice",
  paid: "sage",
};

export function BrandDeals({ deals, onChange }: { deals: BrandDeal[]; onChange: (deals: BrandDeal[]) => void }) {
  const [form, setForm] = useState({ brand: "", deliverable: "", deadline: todayIso(), payment: "", status: "negotiating" as BrandDealStatus });

  const sorted = [...deals].sort((a, b) => a.deadline.localeCompare(b.deadline));
  const totalPaid = deals.filter((d) => d.status === "paid").reduce((sum, d) => sum + d.payment, 0);

  function addDeal() {
    if (!form.brand.trim()) return;
    onChange([
      ...deals,
      {
        id: newId(),
        brand: form.brand.trim(),
        deliverable: form.deliverable.trim(),
        deadline: form.deadline,
        payment: Number(form.payment) || 0,
        status: form.status,
      },
    ]);
    setForm({ ...form, brand: "", deliverable: "", payment: "" });
  }

  return (
    <Card>
      <SectionHeader subtitle={`$${totalPaid.toLocaleString()} paid out to date`}>Brand deals & collaborations</SectionHeader>
      <div className="space-y-2">
        {sorted.map((d) => (
          <div key={d.id} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
            <div className="flex-1">
              <p className="text-sm text-ink">
                {d.brand} <span className="text-ink-faint">— {d.deliverable}</span>
              </p>
              <p className="text-xs text-ink-faint">
                Due {d.deadline} · ${d.payment.toLocaleString()}
              </p>
            </div>
            <select
              className="input-field w-auto bg-transparent py-1 text-xs"
              value={d.status}
              onChange={(e) => onChange(deals.map((x) => (x.id === d.id ? { ...x, status: e.target.value as BrandDealStatus } : x)))}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <Badge tone={STATUS_TONE[d.status]}>{d.status}</Badge>
            <button
              aria-label="Remove deal"
              className="text-ink-faint opacity-0 transition-opacity hover:text-sage group-hover:opacity-100"
              onClick={() => onChange(deals.filter((x) => x.id !== d.id))}
            >
              ✕
            </button>
          </div>
        ))}
        {sorted.length === 0 && <p className="py-4 text-center text-sm text-ink-faint">No brand deals logged yet.</p>}
      </div>
      <form
        className="mt-3 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addDeal();
        }}
      >
        <input
          className="input-field flex-1"
          placeholder="Brand name"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <input
          className="input-field flex-1"
          placeholder="Deliverable"
          value={form.deliverable}
          onChange={(e) => setForm({ ...form, deliverable: e.target.value })}
        />
        <input
          type="date"
          className="input-field w-auto"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />
        <input
          type="number"
          className="input-field w-24"
          placeholder="$"
          value={form.payment}
          onChange={(e) => setForm({ ...form, payment: e.target.value })}
        />
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </Card>
  );
}
