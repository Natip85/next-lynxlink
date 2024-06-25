import db from "@/db/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { id, isAvailableForPurchase } = body;
    await db.product.update({
      where: { id },
      data: { isAvailableForPurchase },
    });
    return NextResponse.json({ message: "Product created." }, { status: 200 });
  } catch (error) {}
}
