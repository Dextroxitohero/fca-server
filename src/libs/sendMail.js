import nodemailer from 'nodemailer';
import {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_SERVICE,
    MAIL_USER,
    MAIL_PASSWORD
} from '../config';


const html = `
<div style="display: block; margin: 0px auto; width: 60%; background: #F0FBFF; height: 600px;">
//header
<div style="display:block;">

  <img style="display: block; width: 30%; margin: 0px auto" src="./logo.png" alt="">
</div>
<div style="width: 100%;">
  <a 
    style="margin: 0px auto; text-decoration: none; background: #4F46E5; color: white; font-weight: bold; padding: 20px 40px 20px; border-radius: 10%;" 
    href="https://fca-client-production.up.railway.app/">Iniciar sesion</a>
</div>
</div>
`

export const sendMail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: MAIL_HOST,
            port: MAIL_PORT,
            service: MAIL_SERVICE,
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: MAIL_USER,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: html
        };
        // Enviamos el correo electrónico
        const info = await transporter.sendMail(mailOptions);

        return info;
    } catch (error) {
        console.log('Error al enviar el correo electrónico:', error);
        throw error;
    }
}