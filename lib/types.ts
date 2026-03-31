export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  features: string[];
  keywords: string[];
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  priceRange: string;
  features: string[];
  keywords: string[];
  isActive: boolean;
}

export interface CallLog {
  id: string;
  callerNumber: string;
  callSid: string;
  timestamp: string;
  duration: number;
  status: "in-progress" | "completed" | "failed" | "no-answer";
  transcript: string[];
  querySummary: string;
  recommendedItems: string[];
  sentiment: "positive" | "neutral" | "negative";
}

export interface CallerProfile {
  id: string;
  phoneNumber: string;
  name?: string;
  preferences: string[];
  previousInteractions: string[];
  lastCallDate: string;
}

export interface NLPResult {
  intent: string;
  entities: Record<string, string>;
  confidence: number;
  suggestedProducts: string[];
  suggestedServices: string[];
  responseText: string;
}

export interface DashboardStats {
  totalCalls: number;
  activeCalls: number;
  avgDuration: number;
  satisfactionRate: number;
  topProducts: { name: string; count: number }[];
  topServices: { name: string; count: number }[];
  callsToday: number;
  callsThisWeek: number;
}
