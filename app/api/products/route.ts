import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, addProduct } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  return NextResponse.json(getAllProducts());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = {
    id: uuidv4(),
    name: body.name,
    description: body.description,
    category: body.category,
    price: body.price,
    features: body.features || [],
    keywords: body.keywords || [],
    isActive: true,
  };
  addProduct(product);
  return NextResponse.json(product, { status: 201 });
}
