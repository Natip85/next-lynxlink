import { NextResponse } from "next/server";
import db from "@/db/db";

export async function DELETE(req: Request, res: Response) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "No product found" }, { status: 400 });
    }
    await db.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
