import { auth, manualProviders, providers } from '@/auth';
import { DefaultSession } from 'next-auth';
import { SignInButton, SignOut } from './SignInsServer';
import {
    SignInButton as SignInButtonClient,
    SignOut as SignOutClient,
} from './SignInsClient';
import { cookies } from 'next/headers';
import ToolSelectorClient from './ToolSelector';
import Image from 'next/image';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        accessToken?: string;
        provider?: string;
    }
}

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

export default async function Home() {
    const session = await getAuthStatus();
    const currProvider = providers.find((p) => p.id === session?.provider);
    const isManualProvider = manualProviders.includes(session?.provider ?? '');

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="w-full max-w-md">
                {!session?.user ? (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-center">
                            Sign In
                        </h1>
                        {providers.map((provider) =>
                            manualProviders.includes(provider.id) ? (
                                <SignInButtonClient
                                    key={provider.id}
                                    provider={provider}
                                />
                            ) : (
                                <SignInButton
                                    key={provider.id}
                                    provider={provider}
                                />
                            )
                        )}
                    </>
                ) : (
                    <>
                        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
                            <div className="flex items-center justify-center mb-2">
                                <Image
                                    src={currProvider?.logo ?? ''}
                                    alt={`${currProvider?.name} logo`}
                                    className="w-8 h-8 mr-3"
                                    width={32}
                                    height={32}
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
                            {isManualProvider ? <SignOutClient /> : <SignOut />}
                        </div>
                        {session.provider && (
                            <ToolSelectorClient provider={session.provider} />
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
