import db from "@/db/db";
import { ProductFilterValidator } from "@/validations";
import { Prisma } from "@prisma/client";
import axios from "axios";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    const { color, price, size, sort } = ProductFilterValidator.parse(
      body.filter
    );

    const whereClause: Prisma.ProductWhereInput = {
      priceInCents: {
        gte: price[0] * 100, // assuming price is in dollars, converting to cents
        lte: price[1] * 100, // assuming price is in dollars, converting to cents
      },
      ...(color.length > 0 ? { color: { in: color } } : { color: "" }),
      // Add other filters like size similarly
    };
    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === "none"
        ? { createdAt: "desc" }
        : { priceInCents: sort === "price-asc" ? "asc" : "desc" };

    const products = await db.product.findMany({
      where: whereClause,
      orderBy: orderBy,
    });

    return NextResponse.json(products, { status: 200 });
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
        { error: "Failed to filter products due to network error" },
        { status: 500 }
      );
    }

    console.error("Failed to filter products", error);
    return NextResponse.json(
      { error: "Failed to filter the products" },
      { status: 500 }
    );
  }
}
