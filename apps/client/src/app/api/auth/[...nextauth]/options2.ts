import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import investorService from '@/axios/investor/investor.service';
import NextAuth from 'next-auth/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';

const nextAuthOptions = (
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions => {
  return {
    pages: {
      signIn: '/login',
    },
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: {
            label: 'Email:',
            type: 'email',
            placeholder: 'Введите email',
          },
          password: {
            label: 'password:',
            type: 'password',
            placeholder: 'Напечатайте пароль',
          },
        },
        async authorize(credentials) {
          if (!credentials) return null;

          try {
            const response = await investorService.auth.login(credentials);

            const sessionIdCookie: string | undefined = (
              response.headers['set-cookie'] as string[]
            )
              .find(cookie => cookie.includes('connect.sid'))
              ?.match(new RegExp(`^${'connect.sid'}=(.+?);`))?.[1];

            if (!sessionIdCookie) return null;

            cookies().set({
              name: 'connect.sid',
              value: decodeURIComponent(sessionIdCookie),
              httpOnly: true,
              // secure: true,
            });

            return response.data;
          } catch (e: any) {
            console.log(
              'CredentialsProvider authorizer ERROR',
              e.response.data,
            );
            return null;
          }
        },
      }),
    ],
    callbacks: {
      // https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
      async jwt({ token, user, profile }) {
        if (user) token.role = user.role;
        return token;
      },
      // If you want to use the role in client components
      async session({ session, token, user }) {
        if (session?.user) session.user.role = token.role;
        return session;
      },
    },
    events: {
      async signOut(message) {
        cookies().delete('connect.sid');
      },
    },
    logger: {
      error(code, metadata) {
        console.error('[NEXT_AUTH LOGGER]:', code, metadata);
      },
    },
  };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, nextAuthOptions(req, res));
};

export default handler;
