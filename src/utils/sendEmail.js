import nodemailer from "nodemailer";

const api = process.env.MODE === "DEV" ? `:${process.env.PORT}` : ""; // Fixes colon syntax issue


const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail SMTP configuration
  auth: {
    user:  "askofeld11511@gmail.com",
    pass: "qknj wuqc rszu vdbw"
  },
  tls: {
    rejectUnauthorized: false}
});

export const sendEmail = async ({ to, subject, temp, attachments }) => {
  try {
    const info = await transporter.sendMail({
      from:'"kiddo app " <askofeld11511@gmail.com>"' , // Corrected template literal usage
      to,
      subject,
      html: temp,
      attachments,
    });

    console.log("Email sent: ", info.response);
    return info.accepted.length > 0; // Return true if email is accepted
  } catch (err) {
    console.error("Error sending email: ", err);
    return false; // Return false on failure
  }
};