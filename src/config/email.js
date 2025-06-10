const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'zeiadkhaled2825@gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});
