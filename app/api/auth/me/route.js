import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';

export async function GET(request) {
    try {
        // Authenticate and populate office data
        const { user } = await authenticate(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Prepare user data with office information
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        return NextResponse.json({ user: userData });

    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user data', details: error.message },
            { status: 500 }
        );
    }
}