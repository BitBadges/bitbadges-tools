import NextAuth from 'next-auth';
import { BitBadgesNextAuth as BitBadges } from 'bitbadgesjs-sdk';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        //Default
        // BitBadges,

        //Custom parameters
        BitBadges({
            ownershipRequirements: {
                assets: [
                    {
                        collectionId: 1,
                        chain: 'BitBadges',
                        assetIds: [{ start: 9, end: 9 }],
                        ownershipTimes: [],
                        mustOwnAmounts: { start: 0, end: 0 },
                    },
                ],
            },
        }),
    ],
});
