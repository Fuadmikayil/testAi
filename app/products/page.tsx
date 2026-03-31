"use client";

import { useEffect, useState } from "react";
import { Package, Plus, X, DollarSign, Tag } from "lucide-react";
import type { Product } from "@/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    features: "",
    keywords: "",
  });

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        category: form.category,
        price: parseFloat(form.price),
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      const product = await res.json();
      setProducts([...products, product]);
      setForm({ name: "", description: "", category: "", price: "", features: "", keywords: "" });
      setShowForm(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Məhsullar</h1>
          <p className="text-sm text-muted mt-1">
            Sİ-nin zəng edənlərə tövsiyə etdiyi məhsulları idarə edin
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Ləğv et" : "Məhsul Əlavə Et"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Məhsul Adı</label>
              <input
                required
                type="text"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Kateqoriya</label>
              <input
                required
                type="text"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
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
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Qiymət (₼)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Xüsusiyyətlər (vergüllə ayırın)
              </label>
              <input
                type="text"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
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
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="açar söz 1, açar söz 2"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Məhsulu Yadda Saxla
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{product.name}</h3>
                  <span className="text-xs text-muted">{product.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-success font-semibold text-sm">
                <DollarSign className="w-3.5 h-3.5" />
                {product.price}
              </div>
            </div>
            <p className="text-sm text-muted mb-3 line-clamp-2">{product.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.features.map((f) => (
                <span
                  key={f}
                  className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                >
                  {f}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.keywords.map((k) => (
                <span
                  key={k}
                  className="flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {k}
                </span>
              ))}
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Hələ məhsul yoxdur. İlk məhsulunuzu əlavə edin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
