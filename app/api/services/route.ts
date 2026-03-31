import { NextRequest, NextResponse } from "next/server";
import { getAllServices, addService } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  return NextResponse.json(getAllServices());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const service = {
    id: uuidv4(),
    name: body.name,
    description: body.description,
    category: body.category,
    priceRange: body.priceRange,
    features: body.features || [],
    keywords: body.keywords || [],
    isActive: true,
  };
  addService(service);
  return NextResponse.json(service, { status: 201 });
}
