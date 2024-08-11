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
        // First, get the Mailchimp API endpoint
        const metadataResponse = await fetch(
            'https://login.mailchimp.com/oauth2/metadata',
            {
                headers: {
                    Authorization: `OAuth ${session.accessToken}`,
                },
            }
        );

        if (!metadataResponse.ok) {
            throw new Error('Failed to fetch Mailchimp metadata');
        }

        const metadata = await metadataResponse.json();
        const apiEndpoint = metadata.api_endpoint;

        // Now fetch the lists
        const listsResponse = await fetch(`${apiEndpoint}/3.0/lists?count=10`, {
            headers: {
                Authorization: `OAuth ${session.accessToken}`,
            },
        });

        if (!listsResponse.ok) {
            throw new Error('Failed to fetch Mailchimp lists');
        }

        const listsData = await listsResponse.json();
        return NextResponse.json(listsData.lists, { status: 200 });
    } catch (error) {
        console.error('Error fetching Mailchimp lists:', error);
        return NextResponse.json(
            { error: 'Error fetching Mailchimp lists' },
            { status: 500 }
        );
    }
}
