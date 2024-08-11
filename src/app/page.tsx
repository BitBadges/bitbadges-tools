import { auth, signIn, signOut } from '@/auth';
import { DefaultSession } from 'next-auth';
import ToolSelectorServer from './ToolSelectorServer';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        accessToken?: string;
        provider?: string;
    }
}

const defaultClassName = 'blockin-button';

function SignOut() {
    return (
        <form
            action={async () => {
                'use server';
                await signOut();
            }}
        >
            <button type="submit" className={`${defaultClassName} mb-4 w-full`}>
                <div className="flex items-center justify-center hover:opacity-80 bg-gray-800 p-4 rounded-lg">
                    Sign Out
                </div>
            </button>
        </form>
    );
}

const providers: {
    id: string;
    name: string;
    description: string;
    logo: string;
}[] = [
    // {
    //     id: 'github',
    //     name: 'GitHub',
    //     description: 'Sign in with your GitHub account',
    //     logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    // },
    {
        id: 'google',
        name: 'Google',
        description: 'Sign in with your Google account',
        //square icon
        logo: 'https://static-00.iconduck.com/assets.00/google-icon-2048x2048-pks9lbdv.png',
    },
    // {
    //     id: 'calendly',
    //     name: 'Calendly',
    //     description: 'Sign in with your Calendly account',
    //     logo: 'https://static-00.iconduck.com/assets.00/google-icon-2048x2048-pks9lbdv.png',
    // },
    // {
    //     id: 'mailchimp',
    //     name: 'Mailchimp',
    //     description: 'Sign in with your Mailchimp account',
    //     logo: 'https://static-00.iconduck.com/assets.00/google-icon-2048x2048-pks9lbdv.png',
    // },
];

function SignInButton({ provider }: { provider: (typeof providers)[number] }) {
    return (
        <form
            action={async () => {
                'use server';
                await signIn(provider.id);
            }}
        >
            <button type="submit" className={`${defaultClassName} mb-4 w-full`}>
                <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                    <div className="flex items-center">
                        <img
                            src={provider.logo}
                            alt={provider.name}
                            className="w-6 h-6 mr-3"
                        />
                        <span>{provider.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                        {provider.description}
                    </span>
                </div>
            </button>
        </form>
    );
}

export default async function Home() {
    const session = await auth();

    const currProvider = providers.find((p) => p.id === session?.provider);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="w-full max-w-md">
                {!session?.user ? (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-center">
                            Sign In
                        </h1>
                        {providers.map((provider) => (
                            <SignInButton
                                key={provider.id}
                                provider={provider}
                            />
                        ))}
                    </>
                ) : (
                    <>
                        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
                            <div className="flex items-center justify-center mb-2">
                                <img
                                    src={currProvider?.logo}
                                    alt={`${currProvider?.name} logo`}
                                    className="w-8 h-8 mr-3"
                                />
                                <span className="text-xl font-semibold">
                                    {session.user.name ?? ''}
                                </span>
                            </div>
                            <div className="text-sm text-gray-400 text-center">
                                Signed in with {currProvider?.name}
                            </div>
                        </div>
                        <div className="my-6">
                            <SignOut />
                        </div>
                        {session.provider && (
                            <ToolSelectorServer provider={session.provider} />
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
