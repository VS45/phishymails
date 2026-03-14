import { NextResponse } from 'next/server';
//import { generateToken, sendVerificationEmail } from '@/lib/auth';
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
            role,
            phone,
            verificationToken: Math.random().toString(36).substring(2) + Date.now().toString(36),
        });


        return NextResponse.json({
            message: 'User created successfully',
            user,
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}