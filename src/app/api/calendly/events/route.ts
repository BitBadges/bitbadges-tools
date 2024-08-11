import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decrypt } from '../../oauth/encryption';

const CALENDLY_CLIENT_ID = process.env.CALENDLY_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:3002/api/oauth/calendly/callback';

export async function GET(request: Request) {
    const cookieStore = cookies();
    const encryptedToken = cookieStore.get('calendly_token')?.value;

    if (!encryptedToken) {
        return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
        );
    }

    const token = await decrypt(encryptedToken);

    if (!token) {
        return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const userResponse = await fetch('https://api.calendly.com/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!userResponse.ok) {
            if (userResponse.status === 401) {
                // Token might be expired, redirect to re-authenticate
                const authUrl = `https://auth.calendly.com/oauth/authorize?client_id=${CALENDLY_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
                return NextResponse.redirect(authUrl);
            }
            throw new Error(
                `Calendly API responded with status ${userResponse.status}`
            );
        }

        const user = await userResponse.json();
        const eventsResponse = await fetch(
            `https://api.calendly.com/scheduled_events?user=${user.resource.uri}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const res = await eventsResponse.json();

        const attendees: any[] = [];
        for (const event of res.collection) {
            const attendeesResponse = await fetch(
                `https://api.calendly.com/scheduled_events/${event.uri
                    .split('/')
                    .pop()}/invitees`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const attendeesRes = await attendeesResponse.json();
            attendees.push(attendeesRes.collection);
        }

        return NextResponse.json(
            res.collection.map((event: any, index: number) => ({
                ...event,
                attendees: attendees[index],
            }))
        );
    } catch (error) {
        console.error('Error fetching Calendly events:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Calendly events' },
            { status: 500 }
        );
    }
}
