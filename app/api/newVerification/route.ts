import db from "@/db/db";
import { getUserByEmail } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { token } = body;
    console.log("BETOKEN>>", token);

    const existingToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { error: "Token does not exist" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Token has expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: "Email does not exist" };
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });
    await db.verificationToken.delete({ where: { id: existingToken.id } });
    return NextResponse.json(
      { success: "Email verified" },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {
        status: 500,
      }
    );
  }
}
