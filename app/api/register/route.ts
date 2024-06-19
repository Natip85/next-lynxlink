import * as z from "zod";
import { NextResponse } from "next/server";
import { RegisterSchema } from "@/validations";
import db from "@/db/db";
import bcryptjs from "bcryptjs";
import { getUserByEmail } from "@/lib/auth";
import { signIn } from "@/auth";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { name, email, password } = RegisterSchema.parse(body);
    const hashedPassword = await bcryptjs.hash(password, 10);
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already in use" };
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return NextResponse.json(
      { message: "Confirmation email sent" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("ERR>>", error.issues);
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
