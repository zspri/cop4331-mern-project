const { Resend } = require('resend');

let resend = null;

const getResendClient = () => {
    if (!process.env.RESEND_API_KEY) {
        return null;
    }

    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }

    return resend;
};

const sendEmail = async (to, subject, html) => {
    const client = getResendClient();
    if (!client) {
        throw new Error('Email service is not configured (missing RESEND_API_KEY).');
    }

    await client.emails.send({
        from: `onboarding@resend.dev`,
        to,
        subject,
        html,
    });
};

module.exports = sendEmail;