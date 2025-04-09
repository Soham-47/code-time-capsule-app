import NextAuth from "next-auth/next";
import authOptions from "@/lib/auth";

// Create the handler with the auth options
const handler = NextAuth(authOptions);

// Export both the handler functions and the authOptions
export { handler as GET, handler as POST, authOptions };