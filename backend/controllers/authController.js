const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const getBackendBaseUrl = () => {
    return process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`;
};

const canBypassEmailVerification = () => {
    return process.env.NODE_ENV !== 'production' && process.env.DISABLE_EMAIL_VERIFICATION_FALLBACK !== 'true';
};

// @desc Register user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires,
            isVerified: false,
        });

        const verifyUrl = `${getBackendBaseUrl()}/api/auth/verify-email/${verificationToken}`;

        const html = `
            <h2>Verify Your Email</h2>
            <p>Hello ${user.firstName},</p>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <p>
                <a href="${verifyUrl}" target="_blank">
                    Verify Email
                </a>
            </p>
            <p>This link will expire in 24 hours.</p>
        `;

        try {
            await sendEmail(user.email, 'Verify your email address', html);
        } catch (error) {
            const message = typeof error?.message === 'string' ? error.message : '';
            const missingEmailConfig = message.includes('Email service is not configured');

            if (missingEmailConfig && canBypassEmailVerification()) {
                user.isVerified = true;
                user.verificationToken = null;
                user.verificationTokenExpires = null;
                await user.save();

                return res.status(201).json({
                    message: 'User registered successfully. Email verification is disabled in this environment.',
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        isVerified: user.isVerified,
                    },
                });
            }

            throw error;
        }

        res.status(201).json({
            message: 'User registered successfully. Please check your email to verify your account before logging in.',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                error: 'Please verify your email before logging in',
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc Verify email
// @route GET /api/auth/verify-email/:token
// @access Public
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                error: 'Invalid or expired verification token',
            });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpires = null;

        await user.save();

        // If you have a frontend route, redirect there.
        if (process.env.CLIENT_URL) {
            return res.redirect(`${process.env.CLIENT_URL}?verified=true`);
        }

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc Resend verification email
// @route POST /api/auth/resend-verification
// @access Public
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires;
        await user.save();

        const verifyUrl = `${getBackendBaseUrl()}/api/auth/verify-email/${verificationToken}`;

        const html = `
            <h2>Verify Your Email</h2>
            <p>Hello ${user.firstName},</p>
            <p>Please verify your email by clicking the link below:</p>
            <p>
                <a href="${verifyUrl}" target="_blank">
                    Verify Email
                </a>
            </p>
            <p>This link will expire in 24 hours.</p>
        `;

        await sendEmail(user.email, 'Verify your email address', html);

        res.status(200).json({
            message: 'Verification email sent successfully',
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        const message = typeof error?.message === 'string' ? error.message : '';
        if (message.includes('Email service is not configured')) {
            return res.status(503).json({ error: message });
        }
        return res.status(500).json({ error: 'Failed to send verification email' });
    }
};

// @desc Forgot password
// @route POST /api/auth/forgot-password
// @access Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl = `${getBackendBaseUrl()}/api/auth/reset-password/${resetToken}`;

        const html = `
            <h2>Password Reset</h2>
            <p>Hello ${user.firstName},</p>
            <p>Click the link below to reset your password:</p>
            <p>
                <a href="${resetUrl}" target="_blank">
                    Reset Password
                </a>
            </p>
            <p>This link will expire in 15 minutes.</p>
        `;

        await sendEmail(user.email, 'Reset your password', html);

        res.status(200).json({
            message: 'Password reset email sent successfully',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc Reset password
// @route POST /api/auth/reset-password/:token
// @access Public
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'New password is required' });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc Get current user
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    getMe,
};