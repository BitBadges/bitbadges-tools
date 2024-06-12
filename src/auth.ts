import NextAuth from 'next-auth';
import BitBadges from './BitBadgesAuth';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [BitBadges({ issuedAtTimeWindowMs: 1 })],
});
