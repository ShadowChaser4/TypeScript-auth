import nodemailer from 'nodemailer'


async function sendemail(subject:string, email:string, message:string)
{
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAILUSERNAME, // generated ethereal user
          pass: process.env.EMAILPASSWORD, // generated ethereal password
        },
      });


      await transporter.sendMail({
        from: process.env.EMAILUSERNAME,
        to: email,
        subject: subject,
        text:message
    });

    return
}


export default sendemail