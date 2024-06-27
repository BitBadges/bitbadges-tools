import { auth, signIn, signOut } from '@/auth';
import { getChainForAddress } from 'bitbadgesjs-sdk';

const buttonStyle = {
    width: 250,
    backgroundColor: 'black',
    fontSize: 14,
    fontWeight: 600,
    color: 'white',
};

const defaultClassName = 'blockin-button';

export function SignOut() {
    return (
        <form
            action={async () => {
                'use server';
                await signOut();
            }}
        >
            <button
                type="submit"
                style={{
                    ...buttonStyle,
                }}
                className={`${defaultClassName}`}
            >
                <div className="flex items-center justify-center hover:opacity-80 bg-gray-800 p-4 rounded-lg">
                    Sign Out
                </div>
            </button>
        </form>
    );
}

export function SignIn() {
    return (
        <form
            action={async () => {
                'use server';
                await signIn('bitbadges');
            }}
        >
            <button
                type="submit"
                style={{
                    ...buttonStyle,
                }}
                className={`${defaultClassName}`}
            >
                <div className="flex items-center justify-center hover:opacity-80 bg-gray-800 p-4 rounded-lg">
                    Sign In with{' '}
                    <img
                        src="https://bitbadges.io/images/bitbadgeslogotext.png"
                        style={{ height: 20, marginLeft: 5 }}
                        alt="BitBadges"
                    />
                </div>
            </button>
        </form>
    );
}

export default async function Home() {
    const session = await auth();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {session?.user ? <SignOut /> : <SignIn />}

            {session?.user?.name ? (
                <div>
                    User is signed in as {getChainForAddress(session.user.name)}{' '}
                    address {session.user.name}
                </div>
            ) : null}
        </main>
    );
}
