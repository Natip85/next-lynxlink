import db from "@/db/db";
import { currentUser } from "@/lib/auth";
import { addProductSchema } from "@/validations";
import { Prisma } from "@prisma/client";
import axios from "axios";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function POST(req: Request, res: Response) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "You must be logged in to create a product." },
        {
          status: 401,
        }
      );
    }
    const body = await req.json();
    const { name, description, images, priceInCents, color, size } =
      addProductSchema.parse(body);

    const product = await db.product.create({
      data: {
        isAvailableForPurchase: false,
        name,
        description,
        priceInCents,
        images,
        color,
        size,
      },
    });
    return NextResponse.json(
      { product: product, message: "Product created." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("ERRRRR>>>>>", error);

      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      console.log("ERROR>>>", error);

      return NextResponse.json(
        { error: "An unexpected error occurred!" },
        {
          status: 500,
        }
      );
    }
  }
}

export async function PATCH(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { id, name, description, images, priceInCents, color, size } = body;
    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json(
        { error: "No such product exists." },
        {
          status: 400,
        }
      );
    }
    await db.product.update({
      where: { id },
      data: {
        name,
        description,
        priceInCents,
        images,
        color,
        size,
      },
    });
    return NextResponse.json({ message: "Product updated." }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      return NextResponse.json(
        { error: "Failed to edit product due to network error" },
        { status: 500 }
      );
    }

    console.error("Failed to edit product:", error);
    return NextResponse.json(
      { error: "Failed to edit the product" },
      { status: 500 }
    );
  }
}
