import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (!session || !session.accessToken) {
        return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const response = await fetch(
            'https://www.strava.com/api/v3/athlete/activities',
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Strava API responded with status ${response.status}`
            );
        }

        const activities = await response.json();

        const athleteId = activities[0].athlete.id;

        const statsResponse = await fetch(
            `https://www.strava.com/api/v3/athletes/${athleteId}/stats`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            }
        );
        const stats = await statsResponse.json();
        console.log('stats', stats);

        const formattedActivities = activities.map((activity: any) => ({
            id: activity.id,
            name: activity.name,
            start_date: activity.start_date,
            athlete: {
                id: activity.athlete.id,
                firstname: activity.athlete.firstname,
                lastname: activity.athlete.lastname,
            },
            // Note: Strava API doesn't provide participants data directly
            // You might need to fetch this separately if available and permitted
            participants: [],
        }));

        return NextResponse.json(formattedActivities);
    } catch (error) {
        console.error('Error fetching Strava activities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Strava activities' },
            { status: 500 }
        );
    }
}
