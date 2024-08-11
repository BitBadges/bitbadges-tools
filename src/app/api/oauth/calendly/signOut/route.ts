import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    cookies().delete('calendly_token');

    console.log('Signed out successfully');

    return NextResponse.json({ message: 'Signed out successfully' });
}
