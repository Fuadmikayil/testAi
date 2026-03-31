"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Phone,
  Clock,
  ThumbsUp,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import type { CallLog, DashboardStats } from "@/lib/types";

function BarIndicator({ value, max, color }: { value: number; max: number; color: string }) {
  const width = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-background rounded-full h-2.5">
      <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${width}%` }} />
    </div>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [calls, setCalls] = useState<CallLog[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats);
    fetch("/api/calls")
      .then((r) => r.json())
      .then(setCalls);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const sentimentCounts = {
    positive: calls.filter((c) => c.sentiment === "positive").length,
    neutral: calls.filter((c) => c.sentiment === "neutral").length,
    negative: calls.filter((c) => c.sentiment === "negative").length,
  };

  const statusCounts = {
    completed: calls.filter((c) => c.status === "completed").length,
    "in-progress": calls.filter((c) => c.status === "in-progress").length,
    failed: calls.filter((c) => c.status === "failed").length,
    "no-answer": calls.filter((c) => c.status === "no-answer").length,
  };

  const intentCounts: Record<string, number> = {};
  for (const call of calls) {
    const intentMatch = call.querySummary.match(/Intent:\s*(\S+)/);
    if (intentMatch) {
      const intent = intentMatch[1];
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    }
  }

  const maxSentiment = Math.max(...Object.values(sentimentCounts), 1);
  const maxStatus = Math.max(...Object.values(statusCounts), 1);
  const maxIntent = Math.max(...Object.values(intentCounts), 1);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Analitika</h1>
        <p className="text-sm text-muted mt-1">
          Sİ səsli sistem üçün məlumatlar və performans göstəriciləri
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Phone, label: "Ümumi Zənglər", value: stats.totalCalls, color: "bg-primary" },
          { icon: Clock, label: "Ort. Müddət", value: `${stats.avgDuration}s`, color: "bg-warning" },
          { icon: ThumbsUp, label: "Məmnuniyyət", value: `${stats.satisfactionRate}%`, color: "bg-success" },
          { icon: TrendingUp, label: "Bu Həftə", value: stats.callsThisWeek, color: "bg-accent" },
        ].map((metric) => (
          <div key={metric.label} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${metric.color} flex items-center justify-center`}>
              <metric.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted">{metric.label}</p>
              <p className="text-xl font-bold">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sentiment Distribution */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Sentiment Dağılımı</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Müsbət", value: sentimentCounts.positive, color: "bg-success" },
              { label: "Neytral", value: sentimentCounts.neutral, color: "bg-warning" },
              { label: "Mənfi", value: sentimentCounts.negative, color: "bg-danger" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted font-medium">{item.value} zəng</span>
                </div>
                <BarIndicator value={item.value} max={maxSentiment} color={item.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Call Status */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-sm">Zəng Statusu</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Tamamlandı", value: statusCounts.completed, color: "bg-success" },
              { label: "Davam edir", value: statusCounts["in-progress"], color: "bg-warning" },
              { label: "Uğursuz", value: statusCounts.failed, color: "bg-danger" },
              { label: "Cavab yoxdur", value: statusCounts["no-answer"], color: "bg-muted" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted font-medium">{item.value} zəng</span>
                </div>
                <BarIndicator value={item.value} max={maxStatus} color={item.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intent Distribution */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-success" />
            <h3 className="font-semibold text-sm">Aşkar Edilmiş Niyyətlər</h3>
          </div>
          {Object.keys(intentCounts).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(intentCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([intent, count]) => (
                  <div key={intent}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-foreground">{intent.replace(/_/g, " ")}</span>
                      <span className="text-muted font-medium">{count}</span>
                    </div>
                    <BarIndicator value={count} max={maxIntent} color="bg-primary" />
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Hələ niyyət məlumatı mövcud deyil</p>
          )}
        </div>

        {/* Top Recommended */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-warning" />
            <h3 className="font-semibold text-sm">Ən Çox Tövsiyə Olunanlar</h3>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs text-muted font-medium uppercase">Məhsullar</h4>
            {stats.topProducts.length > 0 ? (
              stats.topProducts.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {item.count}x
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted">Məlumat yoxdur</p>
            )}
            <h4 className="text-xs text-muted font-medium uppercase mt-4">Xidmətlər</h4>
            {stats.topServices.length > 0 ? (
              stats.topServices.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">
                    {item.count}x
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted">Məlumat yoxdur</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
