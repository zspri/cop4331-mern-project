const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY)

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