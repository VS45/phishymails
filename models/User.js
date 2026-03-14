import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'client', 'tenant', 'accountant', 'facility_manager', 'property-manager', 'cleaner', 'security', 'user'],
        default: 'user',
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verificationExpires: {
        type: Date,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    lastActivity: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true // adds createdAt & updatedAt automatically
});


// ==============================
// HASH PASSWORD (Mongoose 7+)
// ==============================
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// ==============================
// INSTANCE METHODS
// ==============================

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Update last login
// Update last activity
userSchema.methods.updateActivity = function () {
    this.lastActivity = Date.now();
    return this.save();
};


// ==============================
// MODEL EXPORT (Next.js safe)
// ==============================
export default mongoose.models.User || mongoose.model('User', userSchema);
