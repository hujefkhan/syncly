import { Resend } from 'resend';


export const sendResetEmail = async (
  to,
  link
) => {
const resend = new Resend(
  process.env.RESEND_API_KEY
);

await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Reset your Syncly password',
    html: `
      <h2>Reset Password</h2>
      <p>Click below to reset your password:</p>
      <a href="${link}">
        Reset Password
      </a>
    `
  });

};

export const sendVerificationEmail = async (
  to,
  link
) => {
const resend = new Resend(
  process.env.RESEND_API_KEY
);

const result = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Verify your Syncly account',
    html: `
      <h2>Verify Email</h2>
      <p>Click below to verify your account:</p>
      <a href="${link}">
        Verify Account
      </a>
    `
  });
  

};