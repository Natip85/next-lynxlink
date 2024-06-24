import { auth } from "@/auth";
import db from "@/db/db";
import { useTheme } from "next-themes";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const getUserById = async (id: string | undefined) => {
  try {
    if (!id) return null;
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    return null;
  }
};
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    return null;
  }
};
