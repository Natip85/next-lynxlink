import { NextResponse } from "next/server";
import db from "@/db/db";
import { UTApi } from "uploadthing/server";
import { currentUser } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import axios from "axios";

export async function DELETE(req: Request) {
  try {
    const utapi = new UTApi();
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, imageKeys } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "No product found" }, { status: 400 });
    }

    if (!Array.isArray(imageKeys)) {
      return NextResponse.json(
        { error: "Bad Request: imageKeys should be an array" },
        { status: 400 }
      );
    }

    await db.product.delete({
      where: { id },
    });

    const deleteResults = [];
    for (const key of imageKeys) {
      try {
        const res = await utapi.deleteFiles(key);
        deleteResults.push({ key, success: true, result: res });
      } catch (error: any) {
        deleteResults.push({ key, success: false, error: error.message });
      }
    }

    return NextResponse.json(
      { message: "Product deleted", deleteResults },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      return NextResponse.json(
        { error: "Failed to delete product due to network error" },
        { status: 500 }
      );
    }

    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
