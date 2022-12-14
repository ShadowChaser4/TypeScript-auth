import nodemailer from 'nodemailer'


async function sendemail(subject:string, message:string, email:string)
{
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAILUSERNAME, // generated ethereal user
          pass: process.env.EMAILPASSWORD, // generated ethereal password
        },
        tls: {
          rejectUnauthorized: true
          }
      });


  const options = {
    from: process.env.EMAILUSERNAME,
    to: email,
    subject: subject,
    text:message
}
 await transporter.sendMail(options);

    return
}


export default sendemail