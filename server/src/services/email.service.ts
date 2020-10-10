import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface ResetPasswordEmailProps {
  email: string;
  jwt: string;
};

export const sendResetPasswordEmail = ({ email, jwt }: ResetPasswordEmailProps) => new Promise((resolve, reject) => {
  const url = process.env.BASE_URL + '/confirm-reset-password/' + jwt;
  const sgOptions = {
    to: email,
    from: 'password-reset@mealbase.app',
    subject: 'Password Reset Requested',
    text: 'Mealbase Lite has received a request to reset the password for this account. If you did not make this request, simply ignore this email. To proceed to reset your password, click the link below, which is valid for only 60 minutes. \n\n ' + url,
    html: `
      <h3>Password Reset Requested</h3>
      <p style="font-size: 16px;">Mealbase Lite has received a request to reset the password for this account. If you did not make this request, simply ignore this email. To proceed to reset your password, click the link below, which is valid for only 60 minutes.</p>
      <br/>
      <p style="font-size: 16px;"><b><a href="${url}" target="_blank">Reset Password on MealBase</a></b>
      <br/>
      *Caution: Do not share this link with anyone!
      </p>
      <br/>
      <br/>
      <p>Thank you!</p>
    `
  };
  sgMail.send(sgOptions, false, (err, results) => {
    if (err) {
      reject(err.message);
    } else {
      resolve(results);
    }
  })
});