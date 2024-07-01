import db from "@/db/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { id, isActive } = body;
    const toggledCode = await db.discountCode.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(
      { isActive: toggledCode.isActive },
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
export async function DELETE(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { id } = body;

    const deletedDiscountCode = await db.discountCode.delete({
      where: { id },
    });
    if (!deletedDiscountCode) {
      return NextResponse.redirect("/discount-codes", { status: 400 });
    }
    return NextResponse.json(deletedDiscountCode, { status: 200 });
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
