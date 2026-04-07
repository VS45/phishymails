import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    entityType: {
        type: String,
        enum: ['user', 'client', 'property', 'unit', 'tenant', 'payment'],
    },
    entityId: mongoose.Schema.Types.ObjectId,
    ip: String,
    userAgent: String,
    details: mongoose.Schema.Types.Mixed,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Activity || mongoose.model('Activity', activitySchema);