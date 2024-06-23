import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import db from "./db/db";
import { getUserById } from "./lib/auth";
import { UserRole } from "@prisma/client";
import authConfig from "./auth.config";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      console.log("linkaccuser>>>", user);

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
      console.log("siginuser>>>", user);
      console.log("signinaccount>>>", account);

      //allow oauth without email verif
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id);
      //Prevent sign in witout email verif
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      console.log("SESSIONTOKEN>>>", token);
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
      console.log("jwtTOKEN>>>", token);

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
  session: { strategy: "jwt" },
});
