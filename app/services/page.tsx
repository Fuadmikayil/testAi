"use client";

import { useEffect, useState } from "react";
import { Wrench, Plus, X, Tag } from "lucide-react";
import type { Service } from "@/lib/types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    priceRange: "",
    features: "",
    keywords: "",
  });

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(setServices);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        category: form.category,
        priceRange: form.priceRange,
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      const service = await res.json();
      setServices([...services, service]);
      setForm({ name: "", description: "", category: "", priceRange: "", features: "", keywords: "" });
      setShowForm(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Xidmətlər</h1>
          <p className="text-sm text-muted mt-1">
            Sİ-nin zəng edənlərə tövsiyə etdiyi xidmətləri idarə edin
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Ləğv et" : "Xidmət Əlavə Et"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Xidmət Adı</label>
              <input
                required
                type="text"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Kateqoriya</label>
              <input
                required
                type="text"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Təsvir</label>
            <textarea
              required
              rows={2}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Qiymət Aralığı</label>
              <input
                required
                type="text"
                placeholder="99₼ - 299₼ və ya 19.99₼/ay"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent"
                value={form.priceRange}
                onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Xüsusiyyətlər (vergüllə ayırın)
              </label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent"
                placeholder="Xüsusiyyət 1, Xüsusiyyət 2"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Açar sözlər (vergüllə ayırın)
              </label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent"
                placeholder="açar söz 1, açar söz 2"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Xidməti Yadda Saxla
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-card rounded-xl border border-border p-5 hover:border-accent/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{service.name}</h3>
                  <span className="text-xs text-muted">{service.category}</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                {service.priceRange}
              </span>
            </div>
            <p className="text-sm text-muted mb-3 line-clamp-2">{service.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {service.features.map((f) => (
                <span
                  key={f}
                  className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full"
                >
                  {f}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {service.keywords.map((k) => (
                <span
                  key={k}
                  className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {k}
                </span>
              ))}
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted">
            <Wrench className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Hələ xidmət yoxdur. İlk xidmətinizi əlavə edin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
