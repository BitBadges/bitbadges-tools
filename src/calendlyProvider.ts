import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface CalendlyProfile extends Record<string, any> {
    resource: {
        email: string;
        name: string;
        uri: string;
    };
}

export function CalendlyProvider<P extends CalendlyProfile>(
    options: OAuthUserConfig<P>
): OAuthConfig<P> {
    const config: OAuthConfig<P> = {
        id: 'calendly',
        name: 'Calendly',
        type: 'oauth',
        authorization: {
            url: 'https://auth.calendly.com/oauth/authorize',
            params: { scope: 'default' },
        },
        token: {
            url: 'https://auth.calendly.com/oauth/token',
            async request(context: any) {
                console.log('context', context);
                const { provider, params } = context;
                const { clientId, clientSecret } = provider;

                if (!params.code) {
                    throw new Error('No code returned from Calendly');
                }

                const body = new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: params.code,
                    redirect_uri: provider.callbackUrl,
                    client_id: clientId as string,
                    client_secret: clientSecret as string,
                });

                const response = await fetch(config.token.url as string, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: body.toString(),
                });

                if (!response.ok) {
                    console.error(
                        'Token exchange failed:',
                        await response.text()
                    );
                    throw new Error(
                        'Failed to exchange authorization code for access token'
                    );
                }

                const tokens = await response.json();
                return { tokens };
            },
        },
        userinfo: {
            url: 'https://api.calendly.com/users/me',
            async request({ client, tokens }: { client: any; tokens: any }) {
                const profile = await client.userinfo(tokens.access_token!);
                return profile;
            },
        },
        profile(profile) {
            return {
                id: profile.resource.uri,
                name: profile.resource.name,
                email: profile.resource.email,
            };
        },
        clientId: options.clientId,
        clientSecret: options.clientSecret,
    };
    return config;
}
