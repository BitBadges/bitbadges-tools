import { auth } from '@/auth';
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
        const response = await fetch(
            'https://api.calendly.com/scheduled_events?count=10',
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch Calendly events');
        }

        const data = await response.json();
        return NextResponse.json(data.collection, { status: 200 });
    } catch (error) {
        console.error('Error fetching Calendly events:', error);
        return NextResponse.json(
            { error: 'Error fetching Calendly events' },
            { status: 500 }
        );
    }
}
