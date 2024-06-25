import db from "@/db/db";
import { currentUser } from "@/lib/auth";
import { addProductSchema } from "@/validations";
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
    const { name, description, images, priceInCents } =
      addProductSchema.parse(body);
    console.log("BENAME", name);
    console.log("BEDESC", description);
    console.log("BEIMGS", images);
    console.log("BEPRICE", priceInCents);

    const product = await db.product.create({
      data: {
        isAvailableForPurchase: false,
        name,
        description,
        priceInCents,
        images,
      },
    });
    return NextResponse.json(
      { product: product, message: "Product created." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
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
