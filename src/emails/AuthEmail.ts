import { transporter } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const html = `
        <p>UpTask - Hello ${user.name}</p>
        <p>UpTask - Click in the next link</p>
        <p style=" margin: 40px 0;">
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account" style="padding: 20px 15px; color: white; background: #7f22fe; text-decoration:none;">confirm your account</a>
        </p>
        <p>Enter the code: <b>${user.token}</b></p>
        <p style="color: #ff002c; text-decoration: underline;">This token expires in 10 minutes</p>
      `;
    await transporter.sendMail({
      from: "UpTask <admin@uptask.de>",
      to: user.email,
      subject: "UpTask - Confirme your account",
      text: "UpTask - Confirme your account",
      html: html,
    });
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const html = `
        <p>UpTask - Hello ${user.name}</p>
        <p>UpTask - Reset your password</p>
        <p style=" margin: 40px 0;">
        <a href="${process.env.FRONTEND_URL}/auth/new-password" style="padding: 20px 15px; color: white; background: #7f22fe; text-decoration:none;">Reset password</a>
        </p>
        <p>Enter the code: <b>${user.token}</b></p>
        <p style="color: #ff002c; text-decoration: underline;">This token expires in 10 minutes</p>
      `;
    await transporter.sendMail({
      from: "UpTask <admin@uptask.de>",
      to: user.email,
      subject: "UpTask - Confirme your account",
      text: "UpTask - Confirme your account",
      html: html,
    });
  };
}
