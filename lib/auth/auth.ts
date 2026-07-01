import { betterAuth, email } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { sendPasswordResetEmail } from "../emails/sendPasswordResetEmail";
import { sendEmailVerificationEmail } from "../emails/sendVerificationEmail";
import nodemailer from "nodemailer";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "../emails/sendWelcomeEmail";
import { sendChangeEmailConfirmationEmail } from "../emails/sendChangeEmailConfirmationEmail";
import { sendDeleteAccountEmail } from "../emails/sendDeleteAccountEmail";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const info = await sendPasswordResetEmail({ user, url });
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    },
  },
  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const info = await sendEmailVerificationEmail({ user, url });
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: () => {
        return {
          nickName: "googleUser",
        };
      },
    },
    github: {
      prompt: "select_account",
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: () => {
        return {
          nickName: "githubUser",
        };
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins: [nextCookies()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.includes("sign-up")) {
        const user = ctx.context.newSession?.user ?? { name: ctx.body.name, email: ctx.body.email };
        const info = await sendWelcomeEmail(user);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    }),
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, url, newEmail }) => {
        const info = await sendChangeEmailConfirmationEmail({
          user,
          newEmail,
          url,
        });
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      },
    },
    additionalFields: {
      nickName: {
        type: "string",
        required: true,
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        const info = await sendDeleteAccountEmail({ user, url });
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      },
    },
  },
});
