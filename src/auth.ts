import NextAuth, { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createUser, getUserByEmail, upsertOAuthUser } from "@/lib/data";
import { verifyPassword } from "@/lib/password";

const providers = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = String(credentials?.email ?? "").toLowerCase();
      const password = String(credentials?.password ?? "");
      const record = await getUserByEmail(email);

      if (!record?.passwordHash) {
        return null;
      }

      if (!verifyPassword(password, record.passwordHash)) {
        return null;
      }

      return {
        id: record.user.id,
        email: record.user.email,
        name: record.user.name,
        image: record.user.image,
        role: record.user.role,
      };
    },
  }),
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : []),
];

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const dbUser = await upsertOAuthUser({
          name: user.name ?? "Mehara Customer",
          email: user.email,
          image: user.image,
        });

        user.id = dbUser.id;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const record = await getUserByEmail(user.email);
        if (record) {
          token.userId = record.user.id;
          token.role = record.user.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.role = String(token.role ?? "customer");
      }

      return session;
    },
  },
};

export function getCustomerSession() {
  return getServerSession(authOptions);
}

export async function registerCustomer(input: { name: string; email: string; passwordHash: string }) {
  return createUser(input);
}

export default NextAuth(authOptions);
