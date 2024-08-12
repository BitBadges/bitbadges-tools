import NextAuth, { NextAuthConfig, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import StravaProvider from 'next-auth/providers/strava';
import { cookies } from 'next/headers';
import { FRONTEND_BASE_URL } from './constants';
import { Provider } from 'next-auth/providers';

//Manual providers are manually implemented instead of using next-auth's built-in providers
export const manualProviders = ['calendly'];

const isLocalDevelopment = FRONTEND_BASE_URL.includes('localhost');

//Active providers to be displayed on the login page
export const providers: {
    id: string;
    name: string;
    description: string;
    logo: string;
}[] = [
    {
        id: 'google',
        name: 'Google',
        description: 'Sign in with your Google account',
        logo: 'https://zapier-images.imgix.net/storage/services/5e4971d60629bca0548ded987b9ddc06.png?auto=format&ixlib=react-9.8.1&fit=crop&q=50&w=60&h=60&dpr=1',
    },
    isLocalDevelopment
        ? {
              id: 'calendly',
              name: 'Calendly',
              description: 'Sign in with your Calendly account',
              logo: 'https://zapier-images.imgix.net/storage/services/33464c48a26a29dd29977ffb16bcca53.png?auto=format&ixlib=react-9.8.1&fit=crop&q=50&w=60&h=60&dpr=1',
          }
        : undefined,
    isLocalDevelopment
        ? {
              id: 'strava',
              name: 'Strava',
              description: 'Sign in with your Strava account',
              logo: 'https://zapier-images.imgix.net/storage/developer/0bff80269156ba892a084e0fcf8eb841.png?auto=format&ixlib=react-9.8.1&fit=crop&q=50&w=60&h=60&dpr=1',
          }
        : undefined,
].filter(Boolean) as {
    id: string;
    name: string;
    description: string;
    logo: string;
}[];

const authOptions: NextAuthConfig = {
    trustHost: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,

            //Google Calendar - read access to calendar
            authorization: {
                params: {
                    scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly',
                },
            },
        }),
        isLocalDevelopment
            ? StravaProvider({
                  clientId: process.env.STRAVA_CLIENT_ID!,
                  clientSecret: process.env.STRAVA_CLIENT_SECRET!,
                  authorization: {
                      params: {
                          scope: 'activity:read',
                      },
                  },
              })
            : undefined,
    ].filter(Boolean) as Provider[],
    callbacks: {
        async jwt({ token, account }: { token: any; account: any }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: any }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken;
            session.provider = token.provider;

            return session;
        },
        async redirect({ url, baseUrl }) {
            console.log('redirect', url, baseUrl);
            baseUrl = FRONTEND_BASE_URL;
            // Allows relative callback URLs
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    debug: true,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

export async function getAuthStatus() {
    const session = await auth();
    const cookieStore = cookies();

    const calendlyToken = cookieStore.get('calendly_token')?.value;

    return {
        isAuthenticated: !!session || !!calendlyToken,
        provider: session?.provider || (calendlyToken ? 'calendly' : null),
        user:
            session?.user ||
            (calendlyToken
                ? {
                      name: 'Calendly User',
                  }
                : null),
    };
}
