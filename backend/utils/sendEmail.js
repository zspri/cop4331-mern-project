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
    const email = await resend.emails.send({
        from: process.env.RESEND_EMAIL_ADDRESS,
        to,
        subject,
        html,
    });

    console.log(email);
};

module.exports = sendEmail;