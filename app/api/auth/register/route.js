import { NextResponse } from 'next/server';
import { generateToken, sendVerificationEmail } from '@/lib/auth';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(request) {
    try {
        const { name, email, password, role, phone } = await request.json();

        await connectDB();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: 'user',
            phone,
            verificationToken: Math.random().toString(36).substring(2) + Date.now().toString(36),
        });

        // Send verification email
        await sendVerificationEmail(email, user.verificationToken);

        // Generate token
        const token = generateToken(user);

        const response = NextResponse.json({
            message: 'Registration successful. Please check your email for verification.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60,
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}