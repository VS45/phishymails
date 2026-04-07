import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
        lowercase: true,
    },
    recipient: {
        type: String,
        required: true,
        lowercase: true,
    },
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    headers: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    status: {
        type: String,
        enum: ['safe', 'scam', 'phishing', 'suspicious', 'pending','low_risk', 'medium_risk', 'high_risk'],
        default: 'pending',
        required: true,
    },
    confidenceScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    detectionReasons: [{
        reason: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: [
                'suspicious_links',
                'urgent_language',
                'grammar_issues',
                'spoofed_sender',
                'request_for_personal_info',
                'unusual_attachments',
                'too_good_to_be_true',
                'threatening_language',
                'mismatched_urls',
                'generic_greeting',
                'other'
            ],
            required: true,
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium',
        },
        details: String,
    }],
    analyzedAt: {
        type: Date,
    },
    attachments: [{
        filename: String,
        size: Number,
        type: String,
        isMalicious: {
            type: Boolean,
            default: false,
        },
        scanResult: String,
    }],
    links: [{
        url: String,
        domain: String,
        isSuspicious: {
            type: Boolean,
            default: false,
        },
        threatLevel: {
            type: String,
            enum: ['safe', 'suspicious', 'malicious'],
            default: 'safe',
        },
        reason: String,
    }],
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
}, {
    timestamps: true,
});

// Index for efficient queries
emailSchema.index({ sender: 1, createdAt: -1 });
emailSchema.index({ status: 1, confidenceScore: -1 });
emailSchema.index({ 'links.isSuspicious': 1 });

// Instance method to update analysis results
emailSchema.methods.updateAnalysis = function(analysisResult) {
    this.status = analysisResult.status;
    this.confidenceScore = analysisResult.confidenceScore;
    this.detectionReasons = analysisResult.reasons;
    this.analyzedAt = new Date();
    
    if (analysisResult.links) {
        this.links = analysisResult.links;
    }
    
    return this.save();
};

// Static method to find suspicious emails
emailSchema.statics.findSuspiciousEmails = function(minConfidence = 70) {
    return this.find({
        $or: [
            { status: { $in: ['scam', 'phishing', 'suspicious'] } },
            { confidenceScore: { $gte: minConfidence } }
        ]
    }).sort({ confidenceScore: -1, createdAt: -1 });
};

export default mongoose.models.Email || mongoose.model('Email', emailSchema);