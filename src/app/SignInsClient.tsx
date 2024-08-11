'use client';

import { useRouter } from 'next/navigation';
import {
    Provider,
    ProviderButtonContent,
    StyledButton,
} from './components/StyledButton';

export function SignInButton({ provider }: { provider: Provider }) {
    const router = useRouter();
    return (
        <StyledButton
            onClick={() => {
                router.push(`/api/oauth/${provider.id}`);
            }}
        >
            <ProviderButtonContent provider={provider} />
        </StyledButton>
    );
}

export function SignOut() {
    return (
        <StyledButton
            type="submit"
            onClick={async () => {
                await fetch('/api/oauth/calendly/signOut', {
                    method: 'POST',
                });
                window.location.reload();
            }}
        >
            Sign Out
        </StyledButton>
    );
}
