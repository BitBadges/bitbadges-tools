import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { encrypt } from '../../encryption';
import { FRONTEND_BASE_URL } from '@/constants';

const CALENDLY_CLIENT_ID = process.env.CALENDLY_CLIENT_ID || '';
const CALENDLY_CLIENT_SECRET = process.env.CALENDLY_CLIENT_SECRET || '';
const REDIRECT_URI = `${FRONTEND_BASE_URL}/api/oauth/calendly/callback`;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        // If no code, initiate the OAuth flow
        const authUrl = `https://auth.calendly.com/oauth/authorize?client_id=${CALENDLY_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
        return NextResponse.redirect(authUrl);
    }

    // Create the Basic Auth token
    const basicAuth = Buffer.from(
        `${CALENDLY_CLIENT_ID}:${CALENDLY_CLIENT_SECRET}`
    ).toString('base64');

    const tokenResponse = await fetch('https://auth.calendly.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
            code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            client_id: CALENDLY_CLIENT_ID,
            client_secret: CALENDLY_CLIENT_SECRET,
        }),
    });
    if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        console.error('Token response error:', errorData);
        throw new Error('Failed to fetch token');
    }

    const tokenData = await tokenResponse.json();
    const encryptedToken = await encrypt(tokenData.access_token);

    // Store the encrypted token in a secure HttpOnly cookie
    cookies().set('calendly_token', encryptedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: tokenData.expires_in,
        path: '/',
    });

    return NextResponse.redirect(FRONTEND_BASE_URL);
}
