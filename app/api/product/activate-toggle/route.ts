import db from "@/db/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { id, isAvailableForPurchase } = body;
    const active = await db.product.update({
      where: { id },
      data: { isAvailableForPurchase },
    });
    return NextResponse.json(
      { isAvailable: active.isAvailableForPurchase },
      { status: 200 }
    );
  } catch (error) {
    console.log("ERROR>>>", error);

    return NextResponse.json(
      { error: "An unexpected error occurred!" },
      {
        status: 500,
      }
    );
  }
}
