import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },
    github: {
      prompt:'select_account',
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },
  session:{
    cookieCache:{
        enabled: true,
        maxAge: 60 * 5  // 5 minutes
    }
  },
  plugins:[nextCookies()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
