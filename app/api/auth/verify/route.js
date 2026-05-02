import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { logActivity } from '@/lib/auth';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');
        if (!token) {
            return NextResponse.json(
                { error: 'Invalid verification token' },
                { status: 400 }
            );
        }

        const user = await User.findOne({
            verificationToken: token
        });
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        // Verify user
        user.isVerified = true;
        user.verificationToken = undefined;
        user.lastActivity = undefined;
        await user.save();

        // Log activity
        await logActivity(user._id, 'email_verified');

        return NextResponse.json({
            message: 'Email verified successfully! You can now log in.',
            success: true
        });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}