import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Create the handler with the auth options
const handler = NextAuth(authOptions);

// Export only the handler functions
export { handler as GET, handler as POST };