import NextAuth, { Session } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import MailchimpProvider from 'next-auth/providers/mailchimp';
import { CalendlyProvider } from './calendlyProvider';

const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: {
                    scope: 'read:user user:email repo',
                },
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            //Google Calendar - read access to calendar
            authorization: {
                params: {
                    scope: 'openid email profile https://www.googleapis.com/auth/calendar',
                },
            },
        }),
        MailchimpProvider,
        // BitBadges,
        CalendlyProvider({
            clientId: process.env.CALENDLY_CLIENT_ID!,
            clientSecret: process.env.CALENDLY_CLIENT_SECRET!,
        }),
    ],
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
    },

    //allow doorkeeper to be used as a provider
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
