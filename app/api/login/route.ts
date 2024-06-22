import { NextResponse } from "next/server";
import db from "@/db/db";
import { sendVerificationEmail } from "@/lib/mail";
import { getUserByEmail } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { signIn } from "@/auth";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    const { email, password } = body;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return NextResponse.json(
        { error: "Email does not exist" },
        {
          status: 401,
        }
      );
    }
    if (!existingUser.emailVerified) {
      const token = uuidv4();
      const expires = new Date(new Date().getTime() + 3600 * 1000);

      const existingToken = await db.verificationToken.findFirst({
        where: { email },
      });

      if (existingToken) {
        await db.verificationToken.delete({
          where: {
            id: existingToken.id,
          },
        });
      }
      const verificationToken = await db.verificationToken.create({
        data: {
          email,
          token,
          expires,
        },
      });
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
      return NextResponse.json(
        {
          error:
            "Confirmation email sent to your email. Confirm your email to login!",
        },
        {
          status: 401,
        }
      );
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json(
      { success: "logged in successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("ERRR>>>>", error);

    return NextResponse.json(
      { error: "Invalid credentials" },
      {
        status: 500,
      }
    );
  }
}
