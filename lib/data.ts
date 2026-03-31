import { Product, Service, CallLog, CallerProfile, DashboardStats } from "./types";

// --- In-Memory Data Store (replace with real DB in production) ---

const products: Product[] = [
  {
    id: "prod-1",
    name: "Ağıllı Ev Hub",
    description: "Bütün ağıllı ev cihazlarınız üçün mərkəzi idarəetmə vahidi. Süni intellekt köməkçisi inteqrasiyası ilə səslə aktivləşdirilir.",
    category: "Ağıllı Ev",
    price: 149.99,
    features: ["Səslə İdarə", "Wi-Fi 6", "Zigbee & Z-Wave", "Mobil Tətbiq"],
    keywords: ["ağıllı ev", "hub", "səslə idarə", "avtomatlaşdırma", "ev"],
    isActive: true,
  },
  {
    id: "prod-2",
    name: "Simsiz Təhlükəsizlik Kamerası",
    description: "Gecə görmə, hərəkət aşkarlama və bulud yaddaşı olan 1080p HD simsiz təhlükəsizlik kamerası.",
    category: "Təhlükəsizlik",
    price: 79.99,
    features: ["1080p HD", "Gecə Görmə", "Hərəkət Aşkarlama", "Bulud Yaddaşı"],
    keywords: ["təhlükəsizlik", "kamera", "müşahidə", "təhlükəsizlik", "monitor"],
    isActive: true,
  },
  {
    id: "prod-3",
    name: "Ağıllı Termostat Pro",
    description: "Cədvəlinizi öyrənən və enerji istifadəsini avtomatik optimallaşdıran süni intellektlə işləyən termostat.",
    category: "Ağıllı Ev",
    price: 199.99,
    features: ["Sİ Öyrənmə", "Enerji Hesabatları", "Uzaqdan İdarə", "Geofensinq"],
    keywords: ["termostat", "temperatur", "enerji", "isitmə", "soyutma", "iqlim"],
    isActive: true,
  },
  {
    id: "prod-4",
    name: "Mesh Wi-Fi Sistemi",
    description: "465 kv.m-ə qədər kəsintisiz əhatə təmin edən tam evli mesh Wi-Fi sistemi.",
    category: "Şəbəkə",
    price: 299.99,
    features: ["Wi-Fi 6E", "465 kv.m Əhatə", "Asan Quraşdırma", "Valideyn Nəzarəti"],
    keywords: ["wifi", "internet", "şəbəkə", "router", "mesh", "bağlantı"],
    isActive: true,
  },
  {
    id: "prod-5",
    name: "Ağıllı Qapı Kilidi",
    description: "Barmaq izi, PİN kod və tətbiq girişi ilə açarsız ağıllı kilid. Avtomatik kilidləmə funksiyası daxildir.",
    category: "Təhlükəsizlik",
    price: 179.99,
    features: ["Barmaq İzi", "PİN Girişi", "Tətbiq İdarəsi", "Avto-Kilidləmə"],
    keywords: ["kilid", "qapı", "təhlükəsizlik", "açarsız", "barmaq izi", "giriş"],
    isActive: true,
  },
];

const services: Service[] = [
  {
    id: "svc-1",
    name: "Ağıllı Ev Quraşdırması",
    description: "Sertifikatlı texniklər tərəfindən ağıllı ev cihazlarının peşəkar quraşdırılması və parametrlənməsi.",
    category: "Quraşdırma",
    priceRange: "99₼ - 299₼",
    features: ["Sertifikatlı Texniklər", "Eyni Gün Xidmət", "Konfiqurasiya", "İstifadəçi Təlimi"],
    keywords: ["quraşdırma", "parametr", "texnik", "kömək", "konfiqurasiya"],
    isActive: true,
  },
  {
    id: "svc-2",
    name: "24/7 Monitorinq Xidməti",
    description: "Təhlükəsizlik kameralarınızın və siqnalizasiyalarınızın gecə-gündüz peşəkar monitorinqi.",
    category: "Təhlükəsizlik",
    priceRange: "19.99₼/ay",
    features: ["24/7 Əhatə", "Ani Xəbərdarlıqlar", "Təcili Göndərmə", "Aylıq Hesabatlar"],
    keywords: ["monitorinq", "təhlükəsizlik", "siqnalizasiya", "nəzarət", "patrol", "qoruma"],
    isActive: true,
  },
  {
    id: "svc-3",
    name: "Texniki Dəstək Planı",
    description: "Prioritet növbə və uzaqdan problemlərin aradan qaldırılması ilə premium texniki dəstək.",
    category: "Dəstək",
    priceRange: "9.99₼/ay",
    features: ["Prioritet Növbə", "Uzaqdan Giriş", "Telefon və Çat", "Cihaz Diaqnostikası"],
    keywords: ["dəstək", "kömək", "problemin həlli", "düzəltmə", "problem", "məsələ", "texniki"],
    isActive: true,
  },
  {
    id: "svc-4",
    name: "Şəbəkə Optimallaşdırması",
    description: "Maksimum sürət və əhatə üçün peşəkar şəbəkə qiymətləndirilməsi və optimallaşdırılması.",
    category: "Şəbəkə",
    priceRange: "149₼ - 249₼",
    features: ["Sürət Testi", "Əhatə Xəritəsi", "Kanal Optimallaşdırması", "Təhlükəsizlik Auditi"],
    keywords: ["şəbəkə", "wifi", "sürət", "yavaş", "optimallaşdırma", "internet"],
    isActive: true,
  },
  {
    id: "svc-5",
    name: "Enerji Auditi və Optimallaşdırma",
    description: "Ağıllı cihazlarla qənaət imkanlarını müəyyən etmək üçün hərtərəfli enerji auditi.",
    category: "Enerji",
    priceRange: "199₼",
    features: ["Tam Audit", "Qənaət Hesabatı", "Cihaz Tövsiyələri", "Təkrar Məsləhət"],
    keywords: ["enerji", "elektrik", "faktura", "qənaət", "səmərəli", "audit", "xərc"],
    isActive: true,
  },
];

const callLogs: CallLog[] = [
  {
    id: "call-1",
    callerNumber: "+1234567890",
    callSid: "CA_demo_001",
    timestamp: "2026-03-31T10:30:00Z",
    duration: 185,
    status: "completed",
    transcript: [
      "Sİ: Salam! SmartTech Solutions-a xoş gəlmisiniz. Bu gün sizə necə kömək edə bilərəm?",
      "Zəng edən: Ev təhlükəsizliyi variantları ilə maraqlanıram.",
      "Sİ: Əla təhlükəsizlik həllərimiz var! Simsiz Təhlükəsizlik Kameramız 79.99₼-a 1080p HD, gecə görmə və bulud yaddaşı ilə təklif olunur. Həmçinin 179.99₼-a Ağıllı Qapı Kilidi təqdim edirik. Hər hansı biri haqqında ətraflı məlumat istərdiniz?",
      "Zəng edən: Kamera haqqında daha çox danışın.",
      "Sİ: Simsiz Təhlükəsizlik Kamerası 1080p HD keyfiyyət, gecə görmə, hərəkət aşkarlama funksiyalarına malikdir və bulud yaddaşı daxildir. Quraşdırması asandır və mobil tətbiqimizdən izlənilə bilər. Həmçinin 19.99₼/ay-a 24/7 Monitorinq Xidməti təklif edirik. Sifariş vermək istərdiniz?",
    ],
    querySummary: "Ev təhlükəsizliyi məhsulları ilə maraqlanır",
    recommendedItems: ["prod-2", "prod-5", "svc-2"],
    sentiment: "positive",
  },
  {
    id: "call-2",
    callerNumber: "+1987654321",
    callSid: "CA_demo_002",
    timestamp: "2026-03-31T14:15:00Z",
    duration: 120,
    status: "completed",
    transcript: [
      "Sİ: Salam! SmartTech Solutions-a xoş gəlmisiniz. Bu gün sizə necə kömək edə bilərəm?",
      "Zəng edən: İnternetim çox yavaşdır. Nə edə bilərsiniz?",
      "Sİ: Yavaş internetlə əlaqədar narahatlığınızı anlayıram. İki əla həllimiz var: Mesh Wi-Fi Sistemimiz 299.99₼-a 465 kv.m-ə qədər əhatə təmin edir, Şəbəkə Optimallaşdırma xidmətimiz isə mövcud şəbəkənizi 149₼-249₼-a peşəkar qiymətləndirib optimallaşdıra bilər. Hansı sizi maraqlandırır?",
      "Zəng edən: Mesh sistemi haqqında düşünəcəyəm.",
    ],
    querySummary: "Yavaş internet, şəbəkə həlləri ilə maraqlanır",
    recommendedItems: ["prod-4", "svc-4"],
    sentiment: "neutral",
  },
  {
    id: "call-3",
    callerNumber: "+1122334455",
    callSid: "CA_demo_003",
    timestamp: "2026-04-01T09:00:00Z",
    duration: 95,
    status: "completed",
    transcript: [
      "Sİ: Salam! SmartTech Solutions-a xoş gəlmisiniz. Bu gün sizə necə kömək edə bilərəm?",
      "Zəng edən: Termostatımla bağlı köməyə ehtiyacım var, düzgün işləmir.",
      "Sİ: Termostatınızla bağlı sizə kömək etməkdən məmnun olaram. Prioritet telefon dəstəyi və uzaqdan problemlərin aradan qaldırılması daxil olan 9.99₼/ay-a Texniki Dəstək Planı təklif edirik. Yaxud yeniləmə axtarırsınızsa, Ağıllı Termostat Pro süni intellektdən istifadə edərək cədvəlinizi öyrənir və enerji istifadəsini optimallaşdırır. Texniki dəstək yoxsa yeniləmə haqqında məlumat istərdiniz?",
    ],
    querySummary: "Termostat problemləri, texniki dəstək lazımdır",
    recommendedItems: ["prod-3", "svc-3"],
    sentiment: "negative",
  },
];

const callerProfiles: CallerProfile[] = [
  {
    id: "profile-1",
    phoneNumber: "+1234567890",
    name: "Səidə Həsənova",
    preferences: ["təhlükəsizlik", "ağıllı ev"],
    previousInteractions: ["call-1"],
    lastCallDate: "2026-03-31T10:30:00Z",
  },
  {
    id: "profile-2",
    phoneNumber: "+1987654321",
    name: "Murad Əliyev",
    preferences: ["şəbəkə", "wifi"],
    previousInteractions: ["call-2"],
    lastCallDate: "2026-03-31T14:15:00Z",
  },
  {
    id: "profile-3",
    phoneNumber: "+1122334455",
    preferences: ["enerji", "termostat"],
    previousInteractions: ["call-3"],
    lastCallDate: "2026-04-01T09:00:00Z",
  },
];

// --- Data Access Functions ---

export function getAllProducts(): Product[] {
  return products.filter((p) => p.isActive);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function addProduct(product: Product): void {
  products.push(product);
}

export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx] = { ...products[idx], ...updates };
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products.splice(idx, 1);
  return true;
}

export function getAllServices(): Service[] {
  return services.filter((s) => s.isActive);
}

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function addService(service: Service): void {
  services.push(service);
}

export function updateService(id: string, updates: Partial<Service>): Service | undefined {
  const idx = services.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  services[idx] = { ...services[idx], ...updates };
  return services[idx];
}

export function deleteService(id: string): boolean {
  const idx = services.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  services.splice(idx, 1);
  return true;
}

export function getAllCallLogs(): CallLog[] {
  return [...callLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getCallLogById(id: string): CallLog | undefined {
  return callLogs.find((c) => c.id === id);
}

export function addCallLog(log: CallLog): void {
  callLogs.push(log);
}

export function getCallerProfile(phoneNumber: string): CallerProfile | undefined {
  return callerProfiles.find((p) => p.phoneNumber === phoneNumber);
}

export function upsertCallerProfile(profile: CallerProfile): void {
  const idx = callerProfiles.findIndex((p) => p.phoneNumber === profile.phoneNumber);
  if (idx !== -1) {
    callerProfiles[idx] = profile;
  } else {
    callerProfiles.push(profile);
  }
}

export function getDashboardStats(): DashboardStats {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const callsToday = callLogs.filter((c) => new Date(c.timestamp) >= todayStart).length;
  const callsThisWeek = callLogs.filter((c) => new Date(c.timestamp) >= weekStart).length;
  const completedCalls = callLogs.filter((c) => c.status === "completed");
  const avgDuration = completedCalls.length
    ? completedCalls.reduce((sum, c) => sum + c.duration, 0) / completedCalls.length
    : 0;
  const positiveCalls = callLogs.filter((c) => c.sentiment === "positive").length;
  const satisfactionRate = callLogs.length ? (positiveCalls / callLogs.length) * 100 : 0;

  const productCounts: Record<string, number> = {};
  const serviceCounts: Record<string, number> = {};
  for (const log of callLogs) {
    for (const item of log.recommendedItems) {
      if (item.startsWith("prod-")) {
        const product = getProductById(item);
        if (product) productCounts[product.name] = (productCounts[product.name] || 0) + 1;
      } else if (item.startsWith("svc-")) {
        const service = getServiceById(item);
        if (service) serviceCounts[service.name] = (serviceCounts[service.name] || 0) + 1;
      }
    }
  }

  return {
    totalCalls: callLogs.length,
    activeCalls: callLogs.filter((c) => c.status === "in-progress").length,
    avgDuration: Math.round(avgDuration),
    satisfactionRate: Math.round(satisfactionRate),
    topProducts: Object.entries(productCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    topServices: Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    callsToday,
    callsThisWeek,
  };
}

// --- NLP / Intent Processing ---

export function searchProductsAndServices(query: string): { products: Product[]; services: Service[] } {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);

  const matchedProducts = products.filter((p) => {
    if (!p.isActive) return false;
    const allText = [p.name, p.description, p.category, ...p.keywords, ...p.features]
      .join(" ")
      .toLowerCase();
    return queryWords.some((word) => word.length > 2 && allText.includes(word));
  });

  const matchedServices = services.filter((s) => {
    if (!s.isActive) return false;
    const allText = [s.name, s.description, s.category, ...s.keywords, ...s.features]
      .join(" ")
      .toLowerCase();
    return queryWords.some((word) => word.length > 2 && allText.includes(word));
  });

  return { products: matchedProducts, services: matchedServices };
}
