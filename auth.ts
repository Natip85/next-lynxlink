import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import db from "./db/db";
import { getUserByEmail, getUserById } from "./lib/auth";
import { UserRole } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema, RegisterSchema } from "./validations";
import bcryptjs from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      //allow oauth without email verif
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id);
      //Prevent sign in witout email verif
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      console.log("TOKEN>>", token);
      console.log("SESSION>>>", session);
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.emailVerified = token.emailVerified as Date | null;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token }) {
      console.log("THETOKEN>>>", token);

      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.emailVerified = existingUser.emailVerified;
      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcryptjs.compare(
            password,
            user.password
          );
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],

  session: { strategy: "jwt" },
});
