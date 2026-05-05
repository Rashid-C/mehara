import NextAuth from "next-auth";
import { assertCustomerAuthConfigured, authOptions } from "@/auth";

const handler = NextAuth(authOptions);

async function GET(request: Request) {
  assertCustomerAuthConfigured();
  return handler(request);
}

async function POST(request: Request) {
  assertCustomerAuthConfigured();
  return handler(request);
}

export { GET, POST };
