import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

// Export as default AND named export for flexibility
const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any, // Type cast to avoid compatibility issues
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only proceed for OAuth providers
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // Check if user already exists in the database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          
          // If user doesn't exist, create a new user with a generated username
          if (!existingUser && user.email) {
            // Generate a username from the email
            let username = user.email.split('@')[0];
            
            // Check if username already exists
            const usernameExists = await prisma.user.findUnique({
              where: { username },
            });
            
            // If username exists, append a random number
            if (usernameExists) {
              username = `${username}${Math.floor(Math.random() * 1000)}`;
            }
            
            // Create the user with a generated username
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || username,
                username: username,
                image: user.image,
              },
            });
            
            // Add username to user object
            user.username = username;
          } else if (existingUser) {
            // Add username from existing user
            user.username = existingUser.username;
          }
        } catch (error) {
          console.error("OAuth sign in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Add custom properties to token
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Add custom properties to session
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export { authOptions };
export default authOptions; 