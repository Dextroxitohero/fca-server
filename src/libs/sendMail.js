import nodemailer from 'nodemailer';
import { SMPT_HOST, SMPT_PORT, SMPT_SERVICE, SMPT_MAIL, SMPT_PASSWORD } from '../config';





export const sendMail = async (options) => {

    try {
        // const transporter = nodemailer.createTransport({
        //     host: SMPT_HOST,
        //     port: SMPT_PORT,
        //     service: SMPT_SERVICE,
        //     auth: {
        //         user: SMPT_MAIL,
        //         pass: SMPT_PASSWORD,
        //     },
        // });
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "54dca79fdac48f",
              pass: "09e17c6be5807e"
            }
          });
        const mailOptions = {
            from: SMPT_MAIL,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };


        // Enviamos el correo electrónico
        const info = await transporter.sendMail(mailOptions);

        return info;
    } catch (error) {
        console.log('Error al enviar el correo electrónico:', error);
        throw error;
    }

}

