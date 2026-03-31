"use client";

import { useEffect, useState } from "react";
import {
  Phone,
  PhoneIncoming,
  Clock,
  ThumbsUp,
  TrendingUp,
  Package,
  Wrench,
  Activity,
} from "lucide-react";
import type { DashboardStats, CallLog } from "@/lib/types";

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-muted font-medium">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        {subValue && <p className="text-xs text-muted mt-1">{subValue}</p>}
      </div>
    </div>
  );
}

function RecentCallRow({ call }: { call: CallLog }) {
  const statusColors = {
    completed: "bg-success",
    "in-progress": "bg-warning",
    failed: "bg-danger",
    "no-answer": "bg-muted",
  };
  const sentimentEmoji = {
    positive: "😊",
    neutral: "😐",
    negative: "😟",
  };

  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-3 px-4 text-sm">{call.callerNumber}</td>
      <td className="py-3 px-4 text-sm text-muted">
        {new Date(call.timestamp).toLocaleString()}
      </td>
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full text-white font-medium ${statusColors[call.status]}`}
        >
          {call.status}
        </span>
      </td>
      <td className="py-3 px-4 text-sm">{call.duration}s</td>
      <td className="py-3 px-4 text-sm">{sentimentEmoji[call.sentiment]}</td>
      <td className="py-3 px-4 text-sm text-muted max-w-[200px] truncate">
        {call.querySummary || "—"}
      </td>
    </tr>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats);
    fetch("/api/calls")
      .then((r) => r.json())
      .then((calls: CallLog[]) => setRecentCalls(calls.slice(0, 5)));
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-1">
          AI Voice Response System — Real-time overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Phone}
          label="Total Calls"
          value={stats.totalCalls}
          subValue={`${stats.callsToday} today`}
          color="bg-primary"
        />
        <StatCard
          icon={PhoneIncoming}
          label="Active Calls"
          value={stats.activeCalls}
          subValue="Currently in progress"
          color="bg-accent"
        />
        <StatCard
          icon={Clock}
          label="Avg Duration"
          value={`${stats.avgDuration}s`}
          subValue={`${stats.callsThisWeek} this week`}
          color="bg-warning"
        />
        <StatCard
          icon={ThumbsUp}
          label="Satisfaction"
          value={`${stats.satisfactionRate}%`}
          subValue="Positive sentiment"
          color="bg-success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Top Recommended Products</h3>
          </div>
          {stats.topProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {item.count} times
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No data yet</p>
          )}
        </div>

        {/* Top Services */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-sm">Top Recommended Services</h3>
          </div>
          {stats.topServices.length > 0 ? (
            <div className="space-y-3">
              {stats.topServices.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-full">
                    {item.count} times
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No data yet</p>
          )}
        </div>

        {/* System Status */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-success" />
            <h3 className="font-semibold text-sm">System Status</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: "NLP Engine", status: "Online" },
              { name: "Twilio Integration", status: "Ready" },
              { name: "Voice Synthesis", status: "Active" },
              { name: "Database", status: "Connected" },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.name}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Calls Table */}
      <div className="bg-card rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold">Recent Calls</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 px-4 text-xs font-medium text-muted uppercase">Caller</th>
                <th className="py-3 px-4 text-xs font-medium text-muted uppercase">Time</th>
                <th className="py-3 px-4 text-xs font-medium text-muted uppercase">Status</th>
                <th className="py-3 px-4 text-xs font-medium text-muted uppercase">Duration</th>
                <th className="py-3 px-4 text-xs font-medium text-muted uppercase">Sentiment</th>
                <th className="py-3 px-4 text-xs font-medium text-muted uppercase">Summary</th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => (
                <RecentCallRow key={call.id} call={call} />
              ))}
              {recentCalls.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-muted">
                    No calls recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
