import { providers, signIn, signOut } from '@/auth';
import { ProviderButtonContent, StyledButton } from './components/StyledButton';

export function SignInButton({
    provider,
}: {
    provider: (typeof providers)[number];
}) {
    return (
        <form
            action={async () => {
                'use server';
                await signIn(provider.id);
            }}
        >
            <StyledButton type="submit">
                <ProviderButtonContent provider={provider} />
            </StyledButton>
        </form>
    );
}

export function SignOut() {
    return (
        <form
            action={async () => {
                'use server';
                await signOut();
            }}
        >
            <StyledButton type="submit">Sign Out</StyledButton>
        </form>
    );
}
