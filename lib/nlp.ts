import { NLPResult } from "./types";
import { searchProductsAndServices, getCallerProfile } from "./data";

interface IntentPattern {
  intent: string;
  patterns: RegExp[];
  entityExtractors?: Record<string, RegExp>;
}

const intentPatterns: IntentPattern[] = [
  {
    intent: "inquiry_security",
    patterns: [
      /secur/i,
      /camera/i,
      /surveil/i,
      /protect/i,
      /safe/i,
      /alarm/i,
      /lock/i,
      /monitor/i,
    ],
  },
  {
    intent: "inquiry_smart_home",
    patterns: [
      /smart\s*home/i,
      /automat/i,
      /voice\s*control/i,
      /hub/i,
      /alexa/i,
      /google\s*home/i,
    ],
  },
  {
    intent: "inquiry_network",
    patterns: [
      /internet/i,
      /wi-?fi/i,
      /network/i,
      /router/i,
      /slow/i,
      /speed/i,
      /connect/i,
      /mesh/i,
    ],
  },
  {
    intent: "inquiry_energy",
    patterns: [
      /energy/i,
      /thermostat/i,
      /temperature/i,
      /heat/i,
      /cool/i,
      /bill/i,
      /electric/i,
      /climate/i,
    ],
  },
  {
    intent: "request_support",
    patterns: [
      /help/i,
      /support/i,
      /problem/i,
      /issue/i,
      /not\s*work/i,
      /broken/i,
      /trouble/i,
      /fix/i,
    ],
  },
  {
    intent: "request_pricing",
    patterns: [
      /price/i,
      /cost/i,
      /how\s*much/i,
      /expensive/i,
      /cheap/i,
      /afford/i,
      /budget/i,
    ],
  },
  {
    intent: "request_installation",
    patterns: [
      /install/i,
      /setup/i,
      /set\s*up/i,
      /configure/i,
      /technician/i,
    ],
  },
  {
    intent: "greeting",
    patterns: [/hello/i, /hi\b/i, /hey/i, /good\s*(morning|afternoon|evening)/i],
  },
  {
    intent: "farewell",
    patterns: [/bye/i, /goodbye/i, /thank/i, /that'?s\s*all/i, /done/i],
  },
];

function detectIntent(text: string): { intent: string; confidence: number } {
  let bestMatch = { intent: "general_inquiry", confidence: 0.3 };

  for (const pattern of intentPatterns) {
    const matchCount = pattern.patterns.filter((p) => p.test(text)).length;
    if (matchCount > 0) {
      const confidence = Math.min(0.5 + matchCount * 0.15, 0.98);
      if (confidence > bestMatch.confidence) {
        bestMatch = { intent: pattern.intent, confidence };
      }
    }
  }

  return bestMatch;
}

function extractEntities(text: string): Record<string, string> {
  const entities: Record<string, string> = {};

  const productNames = [
    "smart home hub",
    "security camera",
    "thermostat",
    "mesh wi-fi",
    "door lock",
  ];
  for (const name of productNames) {
    if (text.toLowerCase().includes(name)) {
      entities.product = name;
    }
  }

  const phoneMatch = text.match(/\+?\d{10,}/);
  if (phoneMatch) entities.phone = phoneMatch[0];

  const priceMatch = text.match(/\$[\d,.]+/);
  if (priceMatch) entities.price = priceMatch[0];

  return entities;
}

function generateResponse(
  intent: string,
  matchedProducts: { name: string; price: number; description: string }[],
  matchedServices: { name: string; priceRange: string; description: string }[],
  callerName?: string
): string {
  const greeting = callerName ? `Hello ${callerName}!` : "Hello!";

  switch (intent) {
    case "greeting":
      return `${greeting} Welcome to SmartTech Solutions. I can help you with smart home products, security systems, networking, and more. What are you looking for today?`;

    case "farewell":
      return `Thank you for calling SmartTech Solutions${callerName ? `, ${callerName}` : ""}! If you need anything else, don't hesitate to call back. Have a great day!`;

    case "request_support":
      if (matchedProducts.length > 0 || matchedServices.length > 0) {
        const items = [...matchedProducts.map((p) => p.name), ...matchedServices.map((s) => s.name)];
        return `I understand you're having some trouble. We offer a Technical Support Plan for $9.99/month with priority queue and remote troubleshooting. I also found these related items: ${items.join(", ")}. Would you like to learn more about any of these?`;
      }
      return `I'm sorry to hear you're having issues. We offer a Technical Support Plan for $9.99/month that includes priority phone support, remote troubleshooting, and device diagnostics. Would you like me to set that up for you?`;

    case "request_pricing":
      if (matchedProducts.length > 0) {
        const priceList = matchedProducts.map((p) => `${p.name} at $${p.price}`).join(", ");
        return `Here are our prices: ${priceList}. Would you like more details on any of these products?`;
      }
      return `I'd be happy to help with pricing! Could you tell me which product or service you're interested in?`;

    case "request_installation":
      return `We offer professional Smart Home Installation starting at $99. Our certified technicians provide same-day service, full configuration, and user training. Would you like to schedule an installation?`;

    default:
      if (matchedProducts.length > 0 || matchedServices.length > 0) {
        let response = `${greeting} Based on your inquiry, I'd recommend: `;
        if (matchedProducts.length > 0) {
          response += matchedProducts
            .map((p) => `${p.name} ($${p.price}) - ${p.description}`)
            .join(". ");
        }
        if (matchedServices.length > 0) {
          if (matchedProducts.length > 0) response += ". We also offer: ";
          response += matchedServices
            .map((s) => `${s.name} (${s.priceRange}) - ${s.description}`)
            .join(". ");
        }
        response += ". Would you like more details on any of these?";
        return response;
      }
      return `${greeting} Welcome to SmartTech Solutions. We offer smart home products, security systems, networking equipment, and various services. How can I assist you today?`;
  }
}

export function processQuery(text: string, callerPhone?: string): NLPResult {
  const { intent, confidence } = detectIntent(text);
  const entities = extractEntities(text);
  const { products, services } = searchProductsAndServices(text);

  let callerName: string | undefined;
  if (callerPhone) {
    const profile = getCallerProfile(callerPhone);
    if (profile) {
      callerName = profile.name;
    }
  }

  const responseText = generateResponse(
    intent,
    products.map((p) => ({ name: p.name, price: p.price, description: p.description })),
    services.map((s) => ({ name: s.name, priceRange: s.priceRange, description: s.description })),
    callerName
  );

  return {
    intent,
    entities,
    confidence,
    suggestedProducts: products.map((p) => p.id),
    suggestedServices: services.map((s) => s.id),
    responseText,
  };
}
