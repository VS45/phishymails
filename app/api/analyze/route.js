import { NextResponse } from 'next/server';
import { authenticate, authorize, logActivity } from '@/lib/auth';
import connectDB from '@/lib/db';
import Email from '@/models/Email';
import MLModelService from '@/lib/mlModelService';

// ============================================
// POST /api/analyze - Analyze an email
// ============================================
export async function POST(request) {
    try {
        const { user} = await authenticate(request);
        console.log('Authenticated user:', user);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        
        // Validate required fields
        if (!body.sender || !body.recipient || !body.subject || !body.body) {
            return NextResponse.json(
                { error: 'Missing required fields: sender, recipient, subject, body' },
                { status: 400 }
            );
        }
        
        await connectDB();

        // Get client IP and user agent
        const ip = request.headers.get('x-forwarded-for') || request.ip;
        const userAgent = request.headers.get('user-agent');

        // Add metadata from authenticated user
        const emailData = {
            ...body,
            metadata: {
                ...body.metadata,
                analyzedBy: user.id,
                userRole: user.role,
                organization: user.organization,
                ipAddress: ip,
                userAgent: userAgent
            }
        };

        // Analyze email with ML model
        const analysis = await MLModelService.predict(emailData);

        // Create email record
        const email = await Email.create({
            ...emailData,
            ...analysis,
            reportedBy: user.id,
            ipAddress: ip,
            userAgent: userAgent
        });

        // Log activity
        await logActivity(
            user.id,
            'EMAIL_ANALYZED',
            ip,
            userAgent,
            {
                emailId: email._id,
                status: analysis.status,
                confidenceScore: analysis.confidenceScore,
                detectionCount: analysis.reasons?.length || 0
            }
        );

        return NextResponse.json({
            success: true,
            data: email
        }, { status: 201 });

    } catch (error) {
        console.error('Email analysis error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze email: ' + error.message },
            { status: 500 }
        );
    }
}

// ============================================
// GET /api/analyze - Get analyzed emails with filters
// ============================================
export async function GET(request) {
    try {
        const { user, error, sessionExpired, notVerified } = await authenticate(request);
        
        // Handle authentication errors
        if (error) {
            const status = sessionExpired ? 401 : notVerified ? 403 : 401;
            return NextResponse.json(
                { error: error },
                { status }
            );
        }

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const sender = searchParams.get('sender');
        const recipient = searchParams.get('recipient');
        const minConfidence = parseInt(searchParams.get('minConfidence')) || 0;
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = {};

        // Regular users can only see their own analyzed emails
        // Admins and security analysts can see all
        const allowedRoles = ['admin', 'security_analyst', 'facility_manager'];
        if (!authorize(user, allowedRoles)) {
            filter.reportedBy = user.id;
        }
        
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        if (sender) {
            filter.sender = { $regex: sender, $options: 'i' };
        }
        
        if (recipient) {
            filter.recipient = { $regex: recipient, $options: 'i' };
        }
        
        if (minConfidence > 0) {
            filter.confidenceScore = { $gte: minConfidence };
        }
        
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Get total count
        const total = await Email.countDocuments(filter);

        // Get emails with pagination
        const emails = await Email.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('reportedBy', 'name email role')
            .lean();

        // Get summary statistics for the filtered results
        const stats = await Email.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    avgConfidence: { $avg: '$confidenceScore' },
                    maxConfidence: { $max: '$confidenceScore' },
                    minConfidence: { $min: '$confidenceScore' },
                    threats: {
                        $sum: {
                            $cond: [
                                { $in: ['$status', ['scam', 'phishing', 'suspicious']] },
                                1,
                                0
                            ]
                        }
                    },
                    safe: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'safe'] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        // Log activity
        await logActivity(
            user.id,
            'VIEWED_EMAILS',
            request.headers.get('x-forwarded-for') || request.ip,
            request.headers.get('user-agent'),
            {
                filter: { status, sender, recipient, minConfidence },
                page,
                limit,
                resultCount: emails.length
            }
        );

        return NextResponse.json({
            success: true,
            data: emails,
            stats: stats[0] || {
                total: 0,
                avgConfidence: 0,
                maxConfidence: 0,
                minConfidence: 0,
                threats: 0,
                safe: 0
            },
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching emails:', error);
        return NextResponse.json(
            { error: 'Failed to fetch emails: ' + error.message },
            { status: 500 }
        );
    }
}