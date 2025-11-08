import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      try {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }

        return true;
      } catch (error) {
        console.error("Error saving user:", error);
        return false;
      }
    },

    // ✅ NEW: attach MongoDB user _id to the token
    async jwt({ token, user }) {
      if (user?.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) token.id = dbUser._id.toString();
      }
      return token;
    },

    // ✅ Read userId back from token into session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
