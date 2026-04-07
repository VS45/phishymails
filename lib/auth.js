import jwt from 'jsonwebtoken';
import User from '@/models/User';
import Activity from '@/models/Activity';
import connectDB from './db';
import { JWT_SECRET, TOKEN_EXPIRY } from '@/config/constants';
import { sendEmail } from './send-email';

export const generateToken = (user) => {
    console.log(JWT_SECRET)
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            organization: user.organization
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const authenticate = async (request) => {
    // Try to get token from cookies first
    let token = request.cookies.get('token')?.value;
    
    // If not in cookies, try Authorization header
    if (!token) {
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }
    
    console.log('Extracted token:', token ? 'Token present' : 'No token'); // Debug log
    
    if (!token) {
        console.log("No token found in request")
        return { user: null, error: 'No token provided' }
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            console.log("Token could not be decoded!")
            return { user: null, error: 'Invalid token' }
        }

        await connectDB();
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log("User not found")
            return { user: null, error: 'User not found' }
        }

        // Check if user is verified
        if (!user.isVerified) {
            return { user: null, error: 'Email not verified', notVerified: true };
        }

        // Check session timeout (20 minutes)
        if (user.lastActivity && new Date() - new Date(user.lastActivity) > 20 * 60 * 1000) {
            return { user: null, error: 'Session expired', sessionExpired: true };
        }

        // Update last activity
        user.lastActivity = Date.now();
        await user.save();

        return { user: user.toObject() };
    } catch (error) {
        console.log('Authentication error:', error)
        return { user: null, error: 'Authentication failed' };
    }
};

export const logActivity = async (userId, action, ip, userAgent, details = {}) => {
    try {
        await connectDB();
        await Activity.create({ 
            user: userId, 
            action, 
            ip, 
            userAgent, 
            details,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

export const authorize = (user, allowedRoles = []) => {
    if (!user) return false;
    if (allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
};

export const hasPermission = (user, requiredPermission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(requiredPermission);
};

export const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;
    console.log(`Verification link for ${email}: ${verificationLink}`);
    await sendEmail({
        to: email,
        subject: 'Email Verification',
        text: `Click here: ${verificationLink} to verify your email`,
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email</p><p>Or copy and paste this link: ${verificationLink}</p>`,
    });
};