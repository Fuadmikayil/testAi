"use client";

import { useEffect, useState } from "react";
import { Phone, Search, ChevronDown, ChevronUp } from "lucide-react";
import type { CallLog } from "@/lib/types";

function TranscriptViewer({ transcript }: { transcript: string[] }) {
  return (
    <div className="mt-3 space-y-2 pl-4 border-l-2 border-primary/30">
      {transcript.map((line, i) => {
        const isAI = line.startsWith("AI:");
        return (
          <p
            key={i}
            className={`text-sm ${isAI ? "text-primary font-medium" : "text-foreground"}`}
          >
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function CallsPage() {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/calls")
      .then((r) => r.json())
      .then(setCalls);
  }, []);

  const filtered = calls.filter(
    (c) =>
      c.callerNumber.includes(search) ||
      c.querySummary.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    completed: "bg-success text-white",
    "in-progress": "bg-warning text-white",
    failed: "bg-danger text-white",
    "no-answer": "bg-muted text-white",
  };

  const sentimentLabels: Record<string, { label: string; color: string }> = {
    positive: { label: "Positive", color: "text-success" },
    neutral: { label: "Neutral", color: "text-warning" },
    negative: { label: "Negative", color: "text-danger" },
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Call Logs</h1>
          <p className="text-sm text-muted mt-1">
            View all incoming call history and transcripts
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search calls..."
            className="bg-transparent text-sm outline-none w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((call) => (
          <div
            key={call.id}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === call.id ? null : call.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">
                    {call.callerNumber}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(call.timestamp).toLocaleString()} &bull; {call.duration}s
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[call.status]}`}
                >
                  {call.status}
                </span>
                <span className={`text-xs font-medium ${sentimentLabels[call.sentiment].color}`}>
                  {sentimentLabels[call.sentiment].label}
                </span>
                {expandedId === call.id ? (
                  <ChevronUp className="w-4 h-4 text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted" />
                )}
              </div>
            </button>

            {expandedId === call.id && (
              <div className="px-5 pb-4 border-t border-border pt-3">
                <div className="mb-3">
                  <span className="text-xs font-medium text-muted uppercase">Summary</span>
                  <p className="text-sm text-foreground mt-1">
                    {call.querySummary || "No summary available"}
                  </p>
                </div>
                {call.recommendedItems.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs font-medium text-muted uppercase">
                      Recommended Items
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {call.recommendedItems.map((item) => (
                        <span
                          key={item}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-xs font-medium text-muted uppercase">Transcript</span>
                  <TranscriptViewer transcript={call.transcript} />
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted">
            <Phone className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No calls found</p>
          </div>
        )}
      </div>
    </div>
  );
}
