// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendEmail = async ({ to, subject, text, html }) => {
//   if (!to) throw new Error("No recipient email provided");

//   await transporter.sendMail({
//     from: `"CARMART" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//     html,
//   });
// };


// import nodemailer from "nodemailer";

// const transporter =
//   nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     family: 4,

//     requireTLS: true,

//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },

//     connectionTimeout: 30000,
//     greetingTimeout: 30000,
//     socketTimeout: 30000,
//   });

//   export const sendEmail = async ({ to, subject, text, html }) => {
//   if (!to) throw new Error("No recipient email provided");

//   await transporter.sendMail({
//     from: `"CARMART" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//     html,
//   });
// };



import axios from "axios";

export const sendOtpEmail = async (to, otp) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Car Mart",
          email: process.env.EMAIL_FROM,
        },

        to: [
          {
            email: to,
          },
        ],

        subject: "Your OTP Code",

        htmlContent: `
          <div>
            <h2>Your OTP</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
          </div>
        `,
      },

      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("EMAIL SENT:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Brevo API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  if (!to) {
    throw new Error(
      "No recipient email provided"
    );
  }

  try {
    await transporter.sendMail({
      from: `"CARMART" <${process.env.BREVO_VERIFIED_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(
      "Email sent successfully"
    );
  } catch (error) {
    console.error(
      "Brevo SMTP error:",
      error
    );

    throw error;
  }
};