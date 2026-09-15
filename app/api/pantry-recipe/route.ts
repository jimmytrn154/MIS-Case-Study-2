import { NextResponse } from "next/server";
import { z } from "zod";
import { generatePantryRecipe } from "@/lib/ai/pantry-recipe";
import { withCalculatedPantryStatus } from "@/lib/pantry-core";
import { DEMO_TODAY } from "@/data/demo-date";

const requestSchema = z.object({
  pantryItems: z.array(
    z.object({
      id: z.string().min(1),
      customerId: z.string().min(1),
      productId: z.string().min(1),
      quantity: z.number().min(0),
      unit: z.string().min(1),
      purchasedAt: z.string().min(1),
      expiresAt: z.string().optional(),
      openedAt: z.string().optional(),
      lowStockThreshold: z.number().min(0),
      status: z.enum(["fresh", "use-soon", "expired", "low-stock"]),
    }),
  ).min(1).max(30),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid pantry context." }, { status: 400 });
  }

  try {
    const pantryItems = withCalculatedPantryStatus(parsed.data.pantryItems, DEMO_TODAY);
    return NextResponse.json(await generatePantryRecipe(pantryItems));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "FreshWave Assistant could not generate a pantry recipe.",
      },
      { status: 502 },
    );
  }
}
