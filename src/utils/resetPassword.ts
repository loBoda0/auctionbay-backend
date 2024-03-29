import * as nodemailer from 'nodemailer'
import Logging from 'src/library/Logging'

const resetPassword = async (email: string, token: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PASSWORD,
      },
    })

     // verify connection configuration
     transporter.verify(function (error, success) {
      if (error) {
        Logging.error(error)
      } else {
        console.log('Server is ready to take our messages');
      }
    })

    const mailOptions = {
      from: process.env.NM_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click the following link to reset your password:</p>
             <a href="${process.env.FRONTEND}/reset-password/${token}">Reset Password</a>`,
    }

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email} with reset token: ${token}`);
    } catch (error) {
      Logging.error(error)
      console.error(`Error sending password reset email: ${error.message}`);
      throw new Error('Error sending password reset email');
    }
  } catch (error) {
    Logging.error(error)
  }
}

export default resetPassword