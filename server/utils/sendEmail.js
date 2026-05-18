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



// import axios from "axios";

// const brevoClient = axios.create({
//   baseURL: "https://api.brevo.com/v3",

//   headers: {
//     "api-key": process.env.BREVO_API_KEY,
//     "Content-Type": "application/json",
//   },
// });

// export const sendEmail = async ({
//   to,
//   subject,
//   text,
//   html,
// }) => {
//   if (!to) {
//     throw new Error(
//       "Recipient email is required"
//     );
//   }

//   try {
//     const response =
//       await brevoClient.post(
//         "/smtp/email",
//         {
//           sender: {
//             name: "Car Mart",
//             email:
//               process.env.EMAIL_FROM,
//           },

//           to: [
//             {
//               email: to,
//             },
//           ],

//           subject,

//           textContent: text,

//           htmlContent: html,
//         }
//       );

//     console.log(
//       "EMAIL SENT:",
//       response.data
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Brevo API Error:",
//       error.response?.data ||
//         error.message
//     );

//     throw error;
//   }
// };

// export const sendOtpEmail = async (
//   to,
//   otp
// ) => {
//   return sendEmail({
//     to,

//     subject: "Your OTP Code",

//     text: `Your OTP is ${otp}`,

//     html: `
//       <div style="font-family:sans-serif;">
//         <h2>OTP Verification</h2>

//         <p>Your OTP code is:</p>

//         <h1
//           style="
//             letter-spacing:4px;
//             color:#2563eb;
//           "
//         >
//           ${otp}
//         </h1>

//         <p>
//           This OTP will expire soon.
//         </p>
//       </div>
//     `,
//   });
// };

// utils/sendEmail.js

import axios from "axios";

const brevoClient = axios.create({
  baseURL:
    "https://api.brevo.com/v3",

  headers: {
    "api-key":
      process.env.BREVO_API_KEY,

    "Content-Type":
      "application/json",
  },
});


// ==============================
// SEND EMAIL
// ==============================

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  try {
    if (!to) {
      throw new Error(
        "Recipient email is required"
      );
    }

    const response =
      await brevoClient.post(
        "/smtp/email",
        {
          sender: {
            name: "Car Mart",

            email:
              process.env.EMAIL_FROM,
          },

          to: [
            {
              email: to,
            },
          ],

          subject,

          textContent: text,

          htmlContent: html,
        }
      );

    console.log(
      "EMAIL SENT:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "BREVO ERROR:",
      error.response?.data ||
        error.message
    );

    throw new Error(
      error.response?.data
        ?.message ||
        "Failed to send email"
    );
  }
};