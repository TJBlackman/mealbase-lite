import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface PasswordResetProps {
  email: string;
  jwt: string;
};

export const sendResetPassword = ({ email, jwt }: PasswordResetProps) => new Promise((resolve, reject) => {
  const url = process.env.BASE_URL + '/reset-password/' + jwt;
  const sgOptions = {
    to: email,
    from: 'password-reset@mealbase.app',
    subject: 'Password Reset Requested',
    text: 'Visit the URL below to reset your password. It is valid for 60 minutes. If you did not request to reset your password, simply ignore this email. \n\n ' + url,
    html: `
      <h3>Password Reset Requested</h3>
      <p style="font-size: 16px;">Mealbase Lite has received a request to reset the password for this account. If you did not make this request, simply ignore this email. To proceed to reset your password, click the link below, which is valid for only 60 minutes.</p>
      <br/>
      <p><b><a href="${url}" target="_blank">Reset Password on MealBase</a></b></p>
    `
  };
  sgMail.send(sgOptions, false, (err) => {
    if (err) {
      reject(err.message);
    } else {
      resolve(true);
    }
  })
}); 