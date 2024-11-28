import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { triggerUserCreation } from '../../../../lib/userCreation';
 // Relative path as a fallback


const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: 'Ov23ligtKVIvrdKXifVM',
      clientSecret: 'bc6cf6fa2bfc9cb768102b06703e634a60971bb6',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Trigger the user creation process without waiting for it to complete
        triggerUserCreation(user, account);
        return true; // Immediately allow the sign-in to proceed
      } catch (error) {
        console.error('Error during sign-in:', error);
        return false; // Deny the sign-in if something goes wrong
      }
    },
    async session({ session, token }) {
      // Attach the user ID to the session object
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      // Attach the user ID to the token if it's a new session
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: '8sMV574gfcfQ8xZ3r9vizEcfd2/wFYhfucpTmI7EIUw=',
  },
  secret: '8sMV574gfcfQ8xZ3r9vizEcfd2/wFYhfucpTmI7EIUw=',
});

export { handler as GET, handler as POST };