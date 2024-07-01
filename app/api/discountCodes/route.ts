import { addDicountCodeSchema } from "@/validations";
import { Prisma } from "@prisma/client";
import axios from "axios";
import { NextResponse } from "next/server";
import * as z from "zod";
export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    const { code, discountType, limit, expiresAt, allProducts, productIds } =
      addDicountCodeSchema.parse(body);
    console.log("code>>>>", code);
    console.log("discountType>>>>", discountType);
    console.log("limit>>>>", limit);
    console.log("expiresAt>>>>", expiresAt);
    console.log("allProducts>>>>", allProducts);
    console.log("productIds>>>>", productIds);
    return NextResponse.json({ message: "yessss" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      return NextResponse.json(
        { error: "Failed to add discount code due to network error" },
        { status: 500 }
      );
    }

    console.error("Failed to add discount code", error);
    return NextResponse.json(
      { error: "Failed to add discount code" },
      { status: 500 }
    );
  }
}
