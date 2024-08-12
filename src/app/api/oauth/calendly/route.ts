import { FRONTEND_BASE_URL } from '@/constants';
import { NextResponse } from 'next/server';

const CALENDLY_CLIENT_ID = process.env.CALENDLY_CLIENT_ID;
const REDIRECT_URI = `${FRONTEND_BASE_URL}/api/oauth/calendly/callback`;

export async function GET(request: Request) {
    const authUrl = `https://auth.calendly.com/oauth/authorize?client_id=${CALENDLY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
    )}`;
    return NextResponse.redirect(authUrl);
}
