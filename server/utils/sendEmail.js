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



import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,

  family: 4,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,

  tls: {
    rejectUnauthorized: false,
  },
});

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