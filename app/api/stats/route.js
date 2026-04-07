import { NextResponse } from 'next/server';
import { authenticate, authorize, logActivity } from '@/lib/auth';
import connectDB from '@/lib/db';
import Email from '@/models/Email';

// ============================================
// GET /api/stats - Get email analysis statistics
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

        // Check if user has permission to view stats
        const allowedRoles = ['admin', 'security_analyst', 'facility_manager'];
        if (!authorize(user, allowedRoles)) {
            await logActivity(
                user.id,
                'UNAUTHORIZED_STATS_ACCESS',
                request.headers.get('x-forwarded-for') || request.ip,
                request.headers.get('user-agent'),
                { reason: 'Insufficient permissions' }
            );
            
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'all';
        const propertyId = searchParams.get('propertyId');
        const department = searchParams.get('department');

        // Build date filter based on period
        let dateFilter = {};
        const now = new Date();
        
        if (period === 'today') {
            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            dateFilter = { createdAt: { $gte: startOfDay } };
        } else if (period === 'week') {
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            dateFilter = { createdAt: { $gte: weekAgo } };
        } else if (period === 'month') {
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            dateFilter = { createdAt: { $gte: monthAgo } };
        }

        // Build filter object
        const filter = { ...dateFilter };
        
        // Regular users can only see stats from their organization/property
        if (user.role !== 'admin') {
            if (user.organization) {
                filter['metadata.organization'] = user.organization;
            }
            if (propertyId && user.role === 'property-manager') {
                filter['metadata.propertyId'] = propertyId;
            }
        } else if (propertyId) {
            filter['metadata.propertyId'] = propertyId;
        }
        
        if (department) {
            filter['metadata.department'] = department;
        }

        // Get summary statistics by status
        const statusStats = await Email.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    avgConfidence: { $avg: '$confidenceScore' },
                    maxConfidence: { $max: '$confidenceScore' },
                    minConfidence: { $min: '$confidenceScore' }
                }
            },
            {
                $project: {
                    status: '$_id',
                    count: 1,
                    avgConfidence: { $round: ['$avgConfidence', 2] },
                    maxConfidence: 1,
                    minConfidence: 1,
                    _id: 0
                }
            }
        ]);

        // Get total counts
        const totalEmails = await Email.countDocuments(filter);
        
        const safeCount = await Email.countDocuments({ 
            ...filter, 
            status: 'safe' 
        });
        
        const suspiciousCount = await Email.countDocuments({ 
            ...filter, 
            status: { $in: ['suspicious', 'scam', 'phishing'] } 
        });

        // Get recent threats
        const recentThreats = await Email.find({
            ...filter,
            status: { $in: ['scam', 'phishing', 'suspicious'] }
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('subject sender status confidenceScore detectionReasons createdAt')
            .populate('reportedBy', 'name email')
            .lean();

        // Get top detection reasons
        const topReasons = await Email.aggregate([
            { $match: filter },
            { $unwind: '$detectionReasons' },
            {
                $group: {
                    _id: '$detectionReasons.category',
                    count: { $sum: 1 },
                    avgSeverity: { $avg: '$detectionReasons.severity' },
                    reasons: { $push: '$detectionReasons.reason' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    count: 1,
                    avgSeverity: { $round: ['$avgSeverity', 2] },
                    sampleReasons: { $slice: ['$reasons', 3] },
                    _id: 0
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Get timeline data for charts
        const timelineData = await Email.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        status: '$status'
                    },
                    count: { $sum: 1 },
                    avgConfidence: { $avg: '$confidenceScore' }
                }
            },
            {
                $group: {
                    _id: '$_id.date',
                    data: {
                        $push: {
                            status: '$_id.status',
                            count: '$count',
                            avgConfidence: { $round: ['$avgConfidence', 2] }
                        }
                    },
                    total: { $sum: '$count' }
                }
            },
            { $sort: { '_id': -1 } },
            { $limit: 30 }
        ]);

        // Get sender domain statistics
        const domainStats = await Email.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: { $arrayElemAt: [{ $split: ['$sender', '@'] }, 1] },
                    count: { $sum: 1 },
                    threats: {
                        $sum: {
                            $cond: [
                                { $in: ['$status', ['scam', 'phishing', 'suspicious']] },
                                1,
                                0
                            ]
                        }
                    },
                    avgConfidence: { $avg: '$confidenceScore' }
                }
            },
            {
                $project: {
                    domain: '$_id',
                    count: 1,
                    threats: 1,
                    threatRate: {
                        $round: [
                            { $multiply: [{ $divide: ['$threats', '$count'] }, 100] },
                            2
                        ]
                    },
                    avgConfidence: { $round: ['$avgConfidence', 2] },
                    _id: 0
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Calculate threat score (0-100)
        const threatScore = totalEmails > 0 
            ? Math.round((suspiciousCount / totalEmails) * 100)
            : 0;

        // Log activity
        await logActivity(
            user.id,
            'VIEWED_STATS',
            request.headers.get('x-forwarded-for') || request.ip,
            request.headers.get('user-agent'),
            {
                period,
                propertyId,
                department,
                totalEmails,
                threatScore
            }
        );

        return NextResponse.json({
            success: true,
            data: {
                summary: {
                    totalEmails,
                    safeCount,
                    suspiciousCount,
                    threatScore,
                    period,
                    ...statusStats.reduce((acc, stat) => {
                        acc[stat.status] = {
                            count: stat.count,
                            avgConfidence: stat.avgConfidence,
                            maxConfidence: stat.maxConfidence,
                            minConfidence: stat.minConfidence
                        };
                        return acc;
                    }, {})
                },
                recentThreats,
                topReasons,
                timeline: timelineData,
                domainStats,
                filters: {
                    period,
                    propertyId: propertyId || null,
                    department: department || null,
                    userRole: user.role
                }
            }
        });

    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics: ' + error.message },
            { status: 500 }
        );
    }
}