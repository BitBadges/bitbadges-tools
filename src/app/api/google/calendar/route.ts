import { auth } from '@/auth';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await auth();

    if (!session || !session.accessToken) {
        return NextResponse.json(
            { error: 'No session or access token available' },
            { status: 401 }
        );
    }

    try {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: session.accessToken });

        const calendar = google.calendar({
            version: 'v3',
            auth: oauth2Client,
        });

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items;
        if (!events || events.length === 0) {
            return NextResponse.json(
                { message: 'No upcoming events found.' },
                { status: 200 }
            );
        }

        const formattedEvents = events;

        return NextResponse.json(formattedEvents, { status: 200 });
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        return NextResponse.json(
            { error: 'Error fetching calendar events' },
            { status: 500 }
        );
    }
}
