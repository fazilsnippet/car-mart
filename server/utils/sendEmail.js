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


import nodemailer from "nodemailer";

const transporter =
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
      from: `"CARMART" <${process.env.EMAIL_USER}>`,
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
      "Email sending error:",
      error
    );

    throw error;
  }
};